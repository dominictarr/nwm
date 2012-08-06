
//subclass of the screen types.

var EventTree = require('event-tree')
var inherits = require('util').inherits
var fields = 'id,x,y,width,height,title,class,isfloating'.split(',')

inherits(Panel, EventTree)

module.exports = Panel

function Panel (box, parent) {
  EventTree.call(this, parent)
  
  if(box) {
    var self = this
    fields.forEach(function (k) {
      self[k] = box[k]
    })
  }
}

Panel.prototype.inside = function(x, y) {
  return (x >= this.x && x < this.x+this.width
          && y >= this.y && y < this.y+this.height);
};

// _move, _resize, _hide, _show 
// to be implemented by subclasses

Panel.prototype._move = 
Panel.prototype._resize =
Panel.prototype._raise =
Panel.prototype._lower =
Panel.prototype._hide =
Panel.prototype._show =
  function noop() {}

Panel.prototype.move = function (x, y) {
  var event = {
    _x: this.x,
    _y: this.y,
    x: x,
    y: y,
  }
  this.x = x
  this.y = y
  this._move(x, y)
  this.emit('move', event)
  return this
}

Panel.prototype.resize = function (w, h) {
  var event = {
    _width: this.width,
    _height: this.height,
    width: w,
    height: h,
  }
  this.width = w
  this.height = h
  this._resize(w, h)
  this.emit('move', event)
  return this
}

Panel.prototype.raise = function () {
  this._raise()
  this.emit('raise', 'raise')
  return this
}

Panel.prototype.lower = function () {
  this._lower()
  this.emit('lower', 'lower')
  return this
}

Panel.prototype.hide = function () {
  this.visible = false
  this._hide()
  this.emit('hide', 'hide')
  return this
}

Panel.prototype.show = function () {
  this.visible = true
  this._show()
  this.emit('show', 'show')
  return this
}

