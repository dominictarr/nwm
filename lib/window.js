// Window
// ------
var Panel = require('./panel')
var inherits = require('util').inherits
var wm = require('../build/Release/nwm.node');
//need to inject the c instance. i think.
//module.exports = function (wm) {

  inherits(Window, Panel)

  function Window (box, parent) {
    Panel.call(this, box, parent)
  }

  Window.prototype._move = function () {
    wm.moveWindow(this.id, this.x, this.y)
  }

  Window.prototype._resize = function () {
    wm.resizeWindow(this.id, this.width, this.height)
  }

  Window.prototype._show = function() {
    if(!this.visible) {
      this.visible = true;
      wm.moveWindow(this.id, this.x, this.y);
    }
  }

  //move the window off screen
  Window.prototype._hide = function() {
    if(!this.visible) {
      this.visible = true;
      wm.moveWindow(this.id, this.x, this.y + 2e3);
    }
  }

  Window.prototype._raise = function () {
    wm.raiseWindow(this.id)
  }

  Window.prototype._lower = function () {
    wm.lowerWindow(this.id)
  }

  Window.prototype.close = function () {
    //maybe, need to emit an event here?
    //or, will killWindow trigger that?
    wm.killWindow(this.id)
    //the parent must handle the removeWindow event
  }
//  return Window
//}
module.exports = Window

