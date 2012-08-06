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
    this.on('updateWindow', function (event) {
      this.title = event.title || this.title
      this.class = event.class || this.class
    })
    this.on('enterNotify', function () {
      this.raise().focus()
    })
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

  Window.prototype.focus = function () {
    wm.focusWindow(this.id)
    return this
  }

//  return Window
//}
module.exports = Window

