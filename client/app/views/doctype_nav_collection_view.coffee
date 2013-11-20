ViewCollection = require '../lib/view_collection'
DoctypeCollection = require '../collections/doctype_collection'
DoctypeNavView = require './doctype_nav_view'

module.exports = class DoctypeNavCollectionView extends ViewCollection

    itemview: DoctypeNavView
    collection : new DoctypeCollection()
    collectionEl : '#doctype-nav-collection-view'
    el : '#doctype-nav-collection-view'

    events:
        'click a' : 'changeActivePosition'

    initialize: ->
        @collection.fetch
            data: $.param
                'menu' : true
        @views = {}
        @listenTo @collection, "reset", @onReset
        super

    changeActivePosition: (event) ->
        jqMenuLink = $(event.currentTarget)
        parentLi = jqMenuLink.parent('li')
        hasSubmenu = parentLi.children('.submenu').length > 0
        parentsLi = jqMenuLink.parentsUntil '#doctype-nav-collection-view', 'li'

        if not hasSubmenu
            $('#doctype-nav-collection-view li').removeClass 'active'
            parentsLi.addClass 'active'
            parentLi.addClass 'active'

# ace.handle_side_menu = function($) {
#     $('#menu-toggler').on(ace.click_event, function() {
#         $('#sidebar').toggleClass('display');
#         $(this).toggleClass('display');
#         return false;
#     });
#     //mini
#     var $minimized = $('#sidebar').hasClass('menu-min');
#     $('#sidebar-collapse').on(ace.click_event, function(){
#         $minimized = $('#sidebar').hasClass('menu-min');
#         ace.settings.sidebar_collapsed(!$minimized);//@ ace-extra.js
#     });

#     var touch = "ontouchend" in document;
#     //opening submenu
#     $('.nav-list').on(ace.click_event, function(e){
#         //check to see if we have clicked on an element which is inside a .dropdown-toggle element?!
#         //if so, it means we should toggle a submenu
#         var link_element = $(e.target).closest('a');
#         if(!link_element || link_element.length == 0) return;//if not clicked inside a link element

#         $minimized = $('#sidebar').hasClass('menu-min');

#         if(! link_element.hasClass('dropdown-toggle') ) {//it doesn't have a submenu return
#             //just one thing before we return
#             //if sidebar is collapsed(minimized) and we click on a first level menu item
#             //and the click is on the icon, not on the menu text then let's cancel event and cancel navigation
#             //Good for touch devices, that when the icon is tapped to see the menu text, navigation is cancelled
#             //navigation is only done when menu text is tapped
#             if($minimized && ace.click_event == "tap" &&
#                 link_element.get(0).parentNode.parentNode == this /*.nav-list*/ )//i.e. only level-1 links
#             {
#                     var text = link_element.find('.menu-text').get(0);
#                     if( e.target != text && !$.contains(text , e.target) )//not clicking on the text or its children
#                       return false;
#             }

#             return;
#         }
#         //
#         var sub = link_element.next().get(0);

#         //if we are opening this submenu, close all other submenus except the ".active" one
#         if(! $(sub).is(':visible') ) {//if not open and visible, let's open it and make it visible
#           var parent_ul = $(sub.parentNode).closest('ul');
#           if($minimized && parent_ul.hasClass('nav-list')) return;

#           parent_ul.find('> .open > .submenu').each(function(){
#             //close all other open submenus except for the active one
#             if(this != sub && !$(this.parentNode).hasClass('active')) {
#                 $(this).slideUp(200).parent().removeClass('open');

#                 //uncomment the following line to close all submenus on deeper levels when closing a submenu
#                 //$(this).find('.open > .submenu').slideUp(0).parent().removeClass('open');
#             }
#           });
#         } else {
#             //uncomment the following line to close all submenus on deeper levels when closing a submenu
#             //$(sub).find('.open > .submenu').slideUp(0).parent().removeClass('open');
#         }

#         if($minimized && $(sub.parentNode.parentNode).hasClass('nav-list')) return false;

#         $(sub).slideToggle(200).parent().toggleClass('open');
#         return false;
#      })
# }

