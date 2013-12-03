ViewCollection = require '../lib/view_collection'
DoctypeCollection = require '../collections/doctype_collection'
DoctypeNavView = require './doctype_nav_view'

module.exports = class DoctypeNavCollectionView extends ViewCollection

    itemview: DoctypeNavView
    collection : new DoctypeCollection()
    collectionEl : '#doctype-nav-collection-view'
    el : '#doctype-nav-collection-view'
    isMenuMinimized : false
    lastSlimScrolled : null

    events:
        'click a' : 'activateMenuElement'
        'mouseenter .doctype-list-item' : 'showMinimizedMenu'

    initialize: ->
        @bindMenuCollapser()
        @bindMenuResponsive()
        @collection.fetch
            data: $.param
                'menu' : true
        @views = {}
        @listenTo @collection, "reset", @onReset
        super

    showMinimizedMenu: ->
        jqLiContainer = $(event.currentTarget)
        jqSubmenu = jqLiContainer.find(' .submenu:eq(0)')
        if @isMenuMinimized
            @destroySlimscrolls
            @applySlimscroll(jqSubmenu, true)
            jqScrollDiv = jqLiContainer.find('.slimScrollDiv')

    activateMenuElement: (event) ->

        #needed elements
        jqMenuLink = $(event.currentTarget)
        parentLi = jqMenuLink.parent 'li'
        parentsLi = jqMenuLink.parentsUntil '#doctype-nav-collection-view', 'li'
        jqSubmenu = parentLi.find('.submenu:eq(0)')
        jqParentUl = jqSubmenu.parent().closest 'ul'

        #needed booleans
        isDirectLink = not jqMenuLink.hasClass 'dropdown-toggle'
        hasSubmenu = jqSubmenu.length > 0

        #clean slimscrolls
        if not isDirectLink
            @destroySlimscrolls()

            #clean last slimscrolled
            if @lastSlimScrolled? and (@lastSlimScrolled isnt jqSubmenu)
                @lastSlimScrolled = null
            else
                @lastSlimScrolled = jqSubmenu


        #activate the all tree
        if not hasSubmenu
            $('#doctype-nav-collection-view li').removeClass 'active'
            parentsLi.addClass 'active'
            parentLi.addClass 'active'

        #stop here if it's a link
        if isDirectLink then return

        #verify if minimized
        @isMenuMinimized = $('#sidebar').hasClass 'menu-min'

        #close other submenu
        submenuIsVisible = jqSubmenu.is ':visible'
        if not submenuIsVisible
            if @isMenuMinimized and jqParentUl.hasClass 'nav-list' then return
            jqParentUl.find('.open:eq(0)').find(' .submenu:eq(0)').each ->
                if $(this) isnt jqSubmenu
                    $(this).slideUp(200).closest('li').removeClass 'open'

            @applySlimscroll jqSubmenu

        if @isMenuMinimized and jqParentUl.hasClass 'nav-list' then return false
        jqSubmenu.slideToggle 200
        parentLi.toggleClass 'open'

        #Add arrow icon behavior
        $('.icon-angle-down')
            .addClass('icon-angle-right')
            .removeClass('icon-angle-down')
        $('.open > a > .icon-angle-right')
            .addClass('icon-angle-down')
            .removeClass('icon-angle-right')

        return false

    applySlimscroll : (jqSubmenu)->
        @destroySlimscrolls()
        hasSubmenu = jqSubmenu.length > 0
        hasParentSubmenu = jqSubmenu.parent().closest('.submenu').length > 0
        isFirstSubmenu = hasSubmenu and not hasParentSubmenu
        collaspseHeight = $('#sidebar-collapse').height()
        searchHeight = $('.nav-search:eq(0)').height()
        navlistHeight = $('.nav-list > li').length * 46
        navHeight = navlistHeight + collaspseHeight + searchHeight
        if @isMenuMinimized
            navHeight = searchHeight + 25
        menuHeight = jqSubmenu.height()
        fullHeight = navHeight + menuHeight
        winHeight = $(window).height()
        maxHeightOfMenu = winHeight - navHeight
        parentSubmenu = jqSubmenu.parent().closest('.submenu')
        bSlimScollExist = false

        if isFirstSubmenu and fullHeight > winHeight #and @isMenuTooLong

            jqSubmenu.slimScroll
                height: maxHeightOfMenu + 'px'
            bSlimScollExist = true
        else if parentSubmenu.length > 0 and not isFirstSubmenu
            if fullHeight + parentSubmenu.height() > winHeight
                parentSubmenu.slimScroll
                    height: maxHeightOfMenu + 'px'


                #recaclculate height after slideup
                triggerEnter = ->
                    parentSubmenu.mouseenter()
                setTimeout triggerEnter, 200
                bSlimScollExist = true
        if bSlimScollExist
            @lastSlimScrolled = jqSubmenu


    collapseSidebar : (collpase) ->

        @destroySlimscrolls()

        collpase = collpase || false
        sidebar = $('#sidebar')
        collapseId = 'sidebar-collapse'
        iconClass ='[class*="icon-"]'
        icon = document.getElementById(collapseId).querySelector iconClass
        icon1 = icon.getAttribute('data-icon1')
        icon2 = icon.getAttribute('data-icon2')

        if collpase
            sidebar.addClass('menu-min')
            $(icon).removeClass(icon1)
            $(icon).addClass(icon2)
            @isMenuMinimized = true
        else
            sidebar.removeClass('menu-min')
            $(icon).removeClass(icon2)
            $(icon).addClass(icon1)
            @isMenuMinimized = false

    bindMenuCollapser: ->

        #sidebar menu collapser
        $('#sidebar-collapse').on 'click', =>
            @isMenuMinimized = $('#sidebar').hasClass 'menu-min'
            @collapseSidebar !@isMenuMinimized

    bindMenuResponsive: ->
        $('#menu-toggler').on 'click', ->
            $('#sidebar').toggleClass('display')
            $(this).toggleClass('display')
            return false
        $(window).resize =>
            if @lastSlimScrolled?
                @applySlimscroll @lastSlimScrolled



    destroySlimscrolls: ->
        $('.slimScrollDiv').each ->
            jqObj = $(this).children('ul')
            jqObj.css
                'height':'auto'
            jqObj.parent().unbind()
            jqObj.parent().undelegate()
            jqObj.parent().replaceWith jqObj

