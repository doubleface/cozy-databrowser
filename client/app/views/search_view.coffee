BaseView = require '../lib/base_view'
ResultCollectionView = require '../views/result_collection_view'

module.exports = class SearchView extends BaseView

	el: '#content'    
	template: require('./templates/search')  

	initialize : ->
		@rcView = new ResultCollectionView(@options)
		that = this

		#scroll event trigger next page (infinite scroll)
		$(window).bind 'scroll', () ->
			if !that.rcView.isLoading and !that.rcView.noMoreItems
				if $(window).scrollTop() + $(window).height() is $(document).height()
					that.loadMore()

		#resize event could trigger next pages (infinite scroll)
		$(window).bind 'resize', () ->
			that.loopFirstScroll()

	afterRender : ->
		@rcView.render()

		#native size of the window could trigger next pages (infinite scroll)
		@loopFirstScroll()

	loadMore : (callback)->		
		@rcView.loadNextPage(callback)

	loopFirstScroll : ()->
		that = this
		if !@rcView.isLoading and !@rcView.noMoreItems			
			firstScroll = $(document).height() is $(window).height()
			if (firstScroll)
				@loadMore () ->
					that.loopFirstScroll()
