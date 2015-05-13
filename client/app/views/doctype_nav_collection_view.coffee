ViewCollection = require '../lib/view_collection'
DoctypeCollection = require '../collections/doctype_collection'
DoctypeNavView = require './doctype_nav_view'

module.exports = class DoctypeNavCollectionView extends ViewCollection

    itemview: DoctypeNavView
    collection : new DoctypeCollection()
    collectionEl : '#doctype-nav-collection-view'
    el : '#doctype-nav-collection-view'
    lastSlimScrolled : null

    events:
        'click a' : 'activateMenuElement'
        'mouseenter .doctype-list-item' : 'showMinimizedMenu'

    initialize: ->
        @bindMenuResponsive()
        @collection.fetch
            data: $.param
                'menu' : true
        @views = {}
        @listenTo @collection, "reset", @onReset
        super

    showMinimizedMenu: (event) ->
        jqLiContainer = $(event.currentTarget)
        jqSubmenu = jqLiContainer.find(' .submenu:eq(0)')

    activateMenuElement: (event) ->

        #needed elements
        jqMenuLink = $ event.target
        parentLi = jqMenuLink.parent 'li'
        parentsLi = jqMenuLink.parentsUntil '#doctype-nav-collection-view', 'li'
        jqSubmenu = parentLi.find '> .submenu'
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

        #close other submenu
        submenuIsVisible = jqSubmenu.is ':visible'
        if not submenuIsVisible
            jqParentUl.find('.open').find('.submenu').each ->
                if $(this) isnt jqSubmenu
                    $(this).slideUp(200).closest('li').removeClass 'open'

            @applySlimscroll jqSubmenu

        return false

    applySlimscroll : (jqSubmenu)->
        @destroySlimscrolls()
        hasSubmenu = jqSubmenu.length > 0
        hasParentSubmenu = jqSubmenu.parent().closest('.submenu').length > 0
        isFirstSubmenu = hasSubmenu and not hasParentSubmenu
        searchHeight = $('.nav-search:eq(0)').height()
        navlistHeight = $('.nav-list > li').length * 46
        navHeight = navlistHeight + searchHeight
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

