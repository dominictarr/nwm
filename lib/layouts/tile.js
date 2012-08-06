/**
 * Dwm's tiling a.k.a "Vertical Stack Tiling"
 *
 *  +----------+----------+ +----------+----------+
 *  |          |          | |          |          |
 *  |          |          | |          |          |
 *  |          |          | |          |          |
 *  |          |          | |          +----------+
 *  |          |          | |          |          |
 *  |          |          | |          |          |
 *  |          |          | |          |          |
 *  +---------------------+ +---------------------+
 *        2 windows               3 windows
 *
 *  +----------+----------+ +----------+----------+
 *  |          |          | |          |          |
 *  |          |          | |          +----------+
 *  |          +----------+ |          |          |
 *  |          |          | |          +----------+
 *  |          +----------+ |          |          |
 *  |          |          | |          +----------+
 *  |          |          | |          |          |
 *  +---------------------+ +---------------------+
 *        4 windows               5 windows
 */
function tile(workspace) {
  // the way DWM does it is to reserve half the screen for the first screen,
  // then split the other half among the rest of the screens
  var windows = workspace.visible();
  var screen = workspace
  var mainWin = workspace.getMainWindow();
  var length = workspace.children.length
  if(length == 1) {
    mainWin.move(screen.x, screen.y);
    mainWin.resize(screen.width, screen.height);
    return
  }
  // when main scale = 50, the divisor is 2
  var mainScaleFactor = (100 / workspace.getMainWindowScale() );
  var halfWidth = Math.floor(screen.width / mainScaleFactor);

  mainWin.move(screen.x, screen.y);
  mainWin.resize(halfWidth, screen.height);

  // remove from visible
  var rest = workspace.children.slice(1)
  var remainWidth = screen.width - halfWidth;
  var sliceHeight = Math.floor(screen.height / (rest.length) );
  rest.forEach(function(win, index) {
    win.move(screen.x + halfWidth, screen.y + index*sliceHeight);
    win.resize(remainWidth, sliceHeight);
  });

};

if (typeof module != 'undefined') {
  module.exports = tile;
}
