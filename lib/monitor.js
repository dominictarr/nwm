
var Collection = require('./collection.js');
var Panel = require('./panel')
var inherits = require('util').inherits

inherits(Monitor, Panel)

function Monitor (monitor, nwm) {
  Panel.call(this, monitor, null)
  this.nwm = nwm;
  this.id = monitor.id;
  // Screen dimensions
  this.main_window = null;
  this.main_window_scale = 50;
  this.width = monitor.width;
  //hard coded margin for my broken screen
  this.height = monitor.height - 170;
  this.x = monitor.x;
  this.y = monitor.y;
  //fool layouts that this is a workspace
  this.monitor = this
  // List of window ids
  this.window_ids = [];
  this.layout = 'grid'
  // List of workspaces
  this.on('removeWindow', function (event) {
    console.log('REMOVE WINDOW')
    this.remove(event.source)
    this.rearrange()
  })
  //MOVE THIS TO SOME PLACE UNCOUPLED TO MONITOR
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
    //when we mouse into a window make it the
    //focused window.
    this.focused_window = event.source
  })

  //NEXT REMOVE WORKSPACES.
  //STRIP IT BACK DOWN AND CLEANUP WITH MY NEW PATTERN.
  //THEN CAN PUT STUFF LIKE WORKSPACES BACK IN IN A CLEAN WAY.
  this.workspaces = new Collection(nwm, 'workspace', 1);
  var self = this;
  this.workspaces.lazyInit = function(id) {
    return
    console.log('Lazy init workspace', id);
    // Use the current workspace, or if that does not exist, the default values
    var layout_names = Object.keys(self.nwm.layouts);
    if(self.workspaces.exists(self.workspaces.current)) {
      return new Workspace(self.nwm, id, current.layout || layout_names[0], self);
    } else {
      return new Workspace(self.nwm, id, layout_names[0], self);
    }
  };
  // Currently focused window
  this.focused_window = null;

  function inExactIndexOf(arr, needle) {
    var index = -1;
    arr.some(function(item, inx) {
      if(item == needle) {
        index = inx;
        return true;
      }
      return false;
    });
    return index;
  };

  // Listen to events
  var self = this;
  nwm.on('add window', function(window) {
    //throw new Error('STRANG EVENT NAME')
    console.log('#############################################')
    console.log('Monitor add window', window.id);
    if(window.monitor == self.id) {
      self.window_ids.push(window.id);
      // Set the new window as the main window for this workspace so new windows get the primary working area
      self.mainWindow = window.id
//      self.workspaces.get(self.workspaces.current).mainWindow = window.id;
    }
    Object.keys(self.workspaces.items).forEach(function(ws_id) {
      self.workspaces.get(ws_id).rearrange();
    });
  });
  nwm.on('change window monitor', function(window_id, from_id, to_id) {
    if(from_id == self.id) {
      // pop from window_ids
      var index = inExactIndexOf(self.window_ids, window_id);
      if(index != -1) {
        self.window_ids.splice(index, 1);
      }
      // if the window was focused, then pick another window to focus
      if(self.focused_window == window_id) {
        console.log('Take largest', self.window_ids);
        self.focused_window = Math.max.apply(Math, self.window_ids);
      }
      self.rearange()
//      self.workspaces.get(self.workspaces.current).rearrange();
    }
    if(to_id == self.id) {
      // push to window_ids
      self.window_ids.push(window_id);
    self.rearrange()
    //  self.workspaces.get(self.workspaces.current).rearrange();
    }
  });
  nwm.on('remove window', function(id) {
    console.log('Monitor remove window', id);
    var index = inExactIndexOf(self.window_ids, id);
    if(index != -1) {
      self.window_ids.splice(index, 1);
    }
    self.rearrange()
//    self.workspaces.get(self.workspaces.current).rearrange();
  });
  // move items to a remaining monitor if a monitor is removed
  nwm.on('before remove monitor', function(id) {
    return
    if(id == self.id) {
      // get a remaining monitor
      var remaining_id = nwm.monitors.next(self.id);
      var remaining = nwm.monitors.get(remaining_id);
      // get all the windows on this monitor
      self.window_ids.forEach(function(wid){
        var window = nwm.windows.get(wid);
        window.monitor = remaining_id;
        window.workspace = remaining.workspaces.current;
      });
      nwm.monitors.current = remaining;
      self.rearrange()
      //remaining.workspaces.get(remaining.workspaces.current).rearrange();
    }
  });
};

Monitor.prototype.getCurrentWorkspace = function () {
  return this
}
Monitor.prototype.getMainWindow = function () {
  return this.children[0]
}

//just rotate the windows
Monitor.prototype.cycle = function () {
  this.children.push(this.children.shift())
}

Monitor.prototype.setMainWindow = function (id) {
  if('object' === typeof id)
    id = id.id

  var m = (function () {
    for (var k in this.children)
      if(this.children[k].id == id)
        return this.children.splice(k, 1)
  })();
  console.log('SET MAIN WIN', m)
  m && this.children.unshift(m)
}

Monitor.prototype.visible = function () {
  return this.children.filter(function (e) {
    return e.visible
  })
}

Monitor.prototype.rearrange = function() {
  var callback = this.nwm.layouts[this.layout];
  callback(this);
};

// Window access
Monitor.prototype.filter = function(filtercb) {
  var self = this;
  var results = {};
  this.window_ids.forEach(function(id){
    var window = self.nwm.windows.get(id);
    // If a filter callback is not set, then take all items
    if(!filtercb) {
      results[window.id] = window;
    } else if (filtercb(window)) {
      results[window.id] = window;
    }
  });
  return results;
};

// Switch to another workspace
Monitor.prototype.go = function(workspace_id) {
  return  //DISABLED
  var windows = this.filter();
  var window_ids = Object.keys(windows);
  window_ids.forEach(function(window_id) {
    var window = windows[window_id];
    if(window.workspace != workspace_id) {
      window.hide();
    } else {
      window.show();
    }
  });
  var monitor = this;
  if(workspace_id != monitor.workspaces.current) {
    monitor.workspaces.current = workspace_id;
  }
  // always rearrange
  monitor.workspaces.get(monitor.workspaces.current).rearrange();
};

// Move a window to a different workspace
Monitor.prototype.windowTo = function(id, workspace_id) {
  return  //DISABLED
  if(this.nwm.windows.exists(id)) {
    var window = this.nwm.windows.get(id);
    var old_workspace = window.workspace;
    window.workspace = workspace_id;
    if(workspace_id == this.workspaces.current) {
      window.show();
    }
    if(old_workspace == this.workspaces.current && old_workspace != workspace_id) {
      window.hide();
    }
    if(workspace_id == this.workspaces.current || old_workspace == this.workspaces.current) {
      this.workspaces.get(this.workspaces.current).rearrange();
    }
  }
};

Monitor.prototype.inside = function(x, y) {
  return (x >= this.x && x < this.x+this.width
          && y >= this.y && y < this.y+this.height);
};

Monitor.prototype.currentWorkspace = function() {
  return this.workspaces.get(this.workspaces.current);
};

Monitor.prototype.currentWindow = function() {
  if(this.focused_window && this.nwm.windows.exists(this.focused_window)) {
    return this.nwm.windows.get(this.focused_window);
  }
  return false;
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
