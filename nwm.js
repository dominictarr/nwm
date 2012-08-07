//     nwm.js
//     (c) 2011 Mikito Takada
//     nwm is freely distributable under the MIT license.
//     Portions of nwm are inspired or borrowed from dwm.

// Modules
// -------

var Collection = require('./lib/collection.js')
var Monitor = require('./lib/monitor.js')
var wm = require('./build/Release/nwm.node');
var Window = require('./lib/window.js');

// Node Window Manager
// -------------------
var NWM = function() {
  this.layouts = {};
  this.shortcuts = [];
}

require('util').inherits(NWM, require('events').EventEmitter);

// Events
// ------
NWM.prototype.events = [
  'addMonitor',
  'updateMonitor',
  'removeMonitor',
  'addWindow',
  'removeWindow',
  'updateWindow',
  'fullscreen',
  'configureRequest',
  'mouseDown',
  'mouseDrag',
  'enterNotify',
  'rearrange',
  'keyPress'
]

// Layout operations
// -----------------

// Register a new layout
NWM.prototype.addLayout = function(name, callback){
  this.layouts[name] = callback;
};

// Given the current layout, get the next layout (e.g. for switching layouts via keyboard shortcut)
NWM.prototype.nextLayout = function(name) {
  var keys = Object.keys(this.layouts);
  var pos = keys.indexOf(name);
  // Wrap around the array
  return (keys[pos+1] ? keys[pos+1] : keys[0] );
};

// Keyboard shortcut operations
// ----------------------------

// Add a new keyboard shortcut
NWM.prototype.addKey = function(keyobj, callback) {
  this.shortcuts.push({ key: keyobj.key, modifier: keyobj.modifier, callback: callback });
};

var windows = {}

// Start the window manager
NWM.prototype.start = function(callback) {
  var self = this;
  // Initialize event handlers, bind this in the functions to nwm
  var windows = {}
  this.on('addWindow', function (event) {
    var w = new Window(event, this.monitor)
   
    var current_monitor = 
    w.workspace = 
    w.monitor = this.monitor //s.current;

    if(current_monitor.focused_window == null) {
      current_monitor.focused_window = w.id;
    }
    // do not add floating windows
    if(w.isfloating
      // do not add windows that are fixed ( min_width = max_width and min_height = max_height)
      // We need the size info from updatesizehins to do this
      // || (window.width == current_monitor.width && window.height == current_monitor.height)
      ) {
      //better to ignore floaters when changing the layout, or something like that.
    }
    if(w.x > current_monitor.width || w.y > current_monitor.height) {
      w.move(1, 1);
    }
    windows[w.id] = w
  })
  this.on('addMonitor', function (event) {
    this.monitor = new Monitor(event, this)
    windows[this.monitor.id] = this.monitor
  })
  this.on('keyPress', function(event) {
    console.log('keyPress', event, String.fromCharCode(event.keysym));
    // find the matching callback and emit it
    this.shortcuts.forEach(function(shortcut) {
      if(event.keysym == shortcut.key && event.modifier == shortcut.modifier ) {
        shortcut.callback(event);
      };
    });
  })

  //assign listeners
  this.events.forEach(function(eventname) {
    wm.on(eventname, function(event) {
      //these events will bubble down
      if(event.id && windows[event.id])
        windows[event.id].emit(eventname, event)
      else
        self.emit(eventname, event)
    });
  });

  //redo keys next, so that keys may be grabbed at any time!
  var grab_keys = [];
  this.shortcuts.forEach(function(shortcut) {
    grab_keys.push( { key: shortcut.key, modifier: shortcut.modifier });
  });
  wm.keys(grab_keys);
  wm.start();
  if(callback) {
    callback();
  }
};

if (module == require.main) {
  console.log('Please run nwm via "node nwm-user-sample.js" (or some other custom config file).');
}

module.exports = NWM;
