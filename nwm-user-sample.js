// modules
var NWM = require('./nwm.js'),
    XK = require('./lib/keysymdef.js'),
    Xh = require('./lib/x.js'),
    child_process = require('child_process'),
    con = require('./lib/console'),
    join = require('path').join,
    config = require('./lib/config')

// instantiate nwm and configure it
var nwm = new NWM();

// load layouts
// convinience functions for writing the keyboard shortcuts
function currentMonitor() {
  return nwm.monitor //s.get(nwm.monitors.current);
}

function moveToMonitor(window, currentMonitor, otherMonitorId) {
  return
  if (window) {
    window.monitor = otherMonitorId;
    // set the workspace to the current workspace on that monitor
    var otherMonitor = nwm.monitors.get(otherMonitorId);
    window.workspace = otherMonitor.workspaces.current;
    // rearrange both monitors
    currentMonitor.workspaces.get(currentMonitor.workspaces.current).rearrange();
    otherMonitor.workspaces.get(otherMonitor.workspaces.current).rearrange();
  }
}

function resizeWorkspace(increment) {
  var workspace = currentMonitor().currentWorkspace();
  workspace.setMainWindowScale(workspace.getMainWindowScale() + increment);
  workspace.rearrange();
}

// KEYBOARD SHORTCUTS
// Change the base modifier to your liking e.g. Xh.Mod4Mask if you just want to use the meta key without Ctrl
var baseModifier = Xh.Mod4Mask; // Win key

if ( process.env.DISPLAY && process.env.DISPLAY == ':1' ) {
  baseModifier = Xh.Mod4Mask|Xh.ControlMask; // Win + Ctrl
}

var keyboard_shortcuts = [
  {
    key: [1, 2, 3, 4, 5, 6, 7, 8, 9], // number keys are used to move between screens
    callback: function(event) {
      return //DISABLED
      currentMonitor().go(String.fromCharCode(event.keysym));
    }
  },
  {
    key: [1, 2, 3, 4, 5, 6, 7, 8, 9], // with shift, move windows between workspaces
    modifier: [ 'shift' ],
    callback: function(event) {
      return //DISABLED
      var monitor = currentMonitor();
      monitor.windowTo(monitor.focused_window, String.fromCharCode(event.keysym));
    }
  },
  {
    key: 'Return', // enter key launches xterm
    modifier: [ 'shift' ],
    callback: function(event) {
      child_process.exec(config.term_cmd, {env: process.env, cwd: __dirname });
    }
  },
  {
    key: 'c', // c key closes the current window
    modifier: [ 'shift' ],
    callback: function(event) {
      var monitor = currentMonitor();
      monitor.focused_window && monitor.focused_window.close()
//nwm.wm.killWindow(monitor.focused_window.id);
    }
  },
  {
    key: 'space', // space switches between layout modes
    callback: function(event) {
      var monitor = currentMonitor();
      monitor.layouts.push(monitor.layouts.shift())
      monitor.rearrange();
    }
  },
  {
    key: ['h', 'F10'], // shrink master area
    callback: function(event) {
      resizeWorkspace(-5);
    }
  },
  {
    key: ['l', 'F11'], // grow master area
    callback: function(event) {
      resizeWorkspace(+5);
    }
  },
  {
    key: 'Tab', // tab makes the current window the main window
    callback: function(event) {
      var monitor = currentMonitor();
      monitor.cycle() 
      //setMainWindow(monitor.focused_window)
      monitor.rearrange();
    }
  },
  {
    key: 'comma', // moving windows between monitors
    modifier: [ 'shift' ],
    callback: function(event) {
      return //DISABLED
      var monitor = currentMonitor();
      var window = nwm.windows.get(monitor.focused_window);
      if(window) { // empty if no windows
        moveToMonitor(window, monitor, nwm.monitors.next(window.monitor));
      }
    }
  },
  {
    key: 'period', // moving windows between monitors
    modifier: [ 'shift' ],
    callback: function(event) {
      return //DISABLED
      var monitor = currentMonitor();
      var window = nwm.windows.get(monitor.focused_window);
      if(window) { // empty if no windows
        moveToMonitor(window, monitor, nwm.monitors.prev(window.monitor));
      }
    }
  },
  {
    key: 'j', // moving focus
    callback: function() {
      return //DISABLED
      var monitor = currentMonitor();
      if(monitor.focused_window && nwm.windows.exists(monitor.focused_window)) {
        var previous = nwm.windows.prev(monitor.focused_window);
        var window = nwm.windows.get(previous);
        console.log('Current', monitor.focused_window, 'previous', window.id);
        monitor.focused_window = window.id;
        nwm.wm.focusWindow(window.id);
      }
    }
  },
  {
    key: 'k', // moving focus
    callback: function() {
      return //DISABLED
      var monitor = currentMonitor();
      if(monitor.focused_window && nwm.windows.exists(monitor.focused_window)) {
        var next = nwm.windows.next(monitor.focused_window);
        var window = nwm.windows.get(next);
        console.log('Current', monitor.focused_window, 'next', window.id);
        monitor.focused_window = window.id;
        nwm.wm.focusWindow(monitor.focused_window);
      }
    }
  },
  {
    key: 'q', // quit
    modifier: [ 'shift' ],
    callback: function() {
      process.exit();
    }
  },
  {
    key: 'Escape',
    callback: function () {
      console.log('opening console')
      //I managed to break this...
      //not sure what is wrong.
      //possibly env differences between xephyr and
      //logging in properly.
      var cp = child_process.spawn(
      'xterm',
      ['-e', join(__dirname, 'lib', 'console.js')], {
        env: process.env
      }) 
      cp.stdout.pipe(process.stdout, {end: false})
      cp.stderr.pipe(process.stderr, {end: false})

      cp.on('exit', function () {
        console.log('console closed')
      })
    },
  }
];

// take each of the keyboard shortcuts above and make add a key using nwm.addKey
keyboard_shortcuts.forEach(function(shortcut) {
  var callback = shortcut.callback;
  var modifier = baseModifier;
  // translate the modifier array to a X11 modifier
  if(shortcut.modifier) {
    (shortcut.modifier.indexOf('shift') > -1) && (modifier = modifier|Xh.ShiftMask);
    (shortcut.modifier.indexOf('ctrl') > -1) && (modifier = modifier|Xh.ControlMask);
  }
  // add shortcuts
  if(Array.isArray(shortcut.key)) {
    shortcut.key.forEach(function(key) {
      nwm.addKey({ key: XK[key], modifier: modifier }, callback);
    });
  } else {
    nwm.addKey({ key: XK[shortcut.key], modifier: modifier }, callback);
  }
});

// START
nwm.start(function() { });

con.createServer({nwm: nwm, XK: XK, Xh: Xh})
  .listen(config.console_port, function () {
    console.log('connect to nwm repl on:', config.console_port)
  })
