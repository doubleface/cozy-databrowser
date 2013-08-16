module.exports = class UpdatingCollectionView extends Backbone.View
  initialize : (options) -> 
    _(this).bindAll('add', 'remove');
 
    if !options.childViewConstructor 
      throw "no child view constructor provided"
    if !options.childViewTagName 
      throw "no child view tag name provided"
 
    this._childViewConstructor = options.childViewConstructor
    this._childViewTagName = options.childViewTagName
 
    this._childViews = []
 
    this.collection.each(this.add)
 
    this.collection.bind('add', this.add)
    this.collection.bind('remove', this.remove)
  
 
  add : (model) ->
    childView = new this._childViewConstructor({
      tagName : this._childViewTagName
      model : model
    })
 
    this._childViews.push(childView)
 
    if this._rendered
      $(this.el).append(childView.render().el)
    
  
 
  remove : (model) ->
    viewToRemove = _(this._childViews).select((cv) ->  
      return cv.model is model
    )[0]
    this._childViews = _(this._childViews).without(viewToRemove)
 
    if this._rendered 
      $(viewToRemove.el).remove()

 
  render : ->
    that = this
    this._rendered = true
 
    $(this.el).empty()
 
    _(this._childViews).each((childView) -> 
      $(that.el).append(childView.render().el)
    )
 
    return this