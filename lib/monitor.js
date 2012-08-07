
var Collection = require('./collection.js');
var Panel = require('./panel')
var inherits = require('util').inherits

inherits(Monitor, Panel)

function Monitor (monitor, nwm) {
  Panel.call(this, monitor, null)
  this.main_window = null;
  this.main_window_scale = 50;
  this.monitor = this
  this.on('removeWindow', function (event) {
    this.remove(event.source)
    this.rearrange()
  })
  this.on('add', function (event) {
    if(this.contains(event.source))
      this.setMainWindow(event.source).rearrange()
  })
  this.on('fullscreen', function (event) {
    //set the source as the focused window
    //and switch to the monocle layout.
    this.layout = 'monocle'    
    this
      .remove(event.source)
      .unshift(event.source)
      .rearrange()
  })
  this.on('enterNotify', function (event) {
    this.focused_window = event.source
  })

  //dereference from prototype's layouts
  this.layouts = this.layouts.slice()

  this.focused_window = null;
};

// this may not be the ideal way because
// it's arkward to switch to a particular 
// layout.

Monitor.prototype.layouts = [
  require('./layouts/tile'),
  require('./layouts/grid'),
  require('./layouts/wide'),
  require('./layouts/monocle')
]

Monitor.prototype.getCurrentWorkspace = function () {
  return this
}
Monitor.prototype.getMainWindow = function () {
  return this.children[0]
}

//just rotate the windows
Monitor.prototype.cycle = function () {
  this.children.push(this.children.shift())
  return this
}

Monitor.prototype.setMainWindow = function (id) {
  if('object' === typeof id)
    id = id.id

  var m = (function () {
    for (var k in this.children)
      if(this.children[k].id == id)
        return this.children.splice(k, 1)
  })();
  m && this.children.unshift(m)
  return this
}

Monitor.prototype.visible = function () {
  return this.children.filter(function (e) {
    return e.visible
  })
}

Monitor.prototype.rearrange = function() {
  console.log('REARANGE!!!!!')
  if(!this.children.length) return
  var l = this.layouts[0]
  l(this)
  return this
};

// Window access
Monitor.prototype.filter = function(filtercb) {
  return
};

// Switch to another workspace
Monitor.prototype.go = function(workspace_id) {
  return  //DISABLED
};

// Move a window to a different workspace
Monitor.prototype.windowTo = function(id, workspace_id) {
  return  //DISABLED
};

Monitor.prototype.inside = function(x, y) {
  return (x >= this.x && x < this.x+this.width
          && y >= this.y && y < this.y+this.height);
};

Monitor.prototype.currentWorkspace = function() {
  return this
};

Monitor.prototype.currentWindow = function() {
  if(this.focused_window)
    return this.focused_window
};

// Get the main window scale
Monitor.prototype.getMainWindowScale = function() {
  return this.main_window_scale;
};

// Set the main window scale
Monitor.prototype.setMainWindowScale = function(scale) {
  this.main_window_scale = Math.min(Math.max(scale, 1), 99);
  this.rearrange();
};


module.exports = Monitor;
