/**
 * Bottom Stack Tiling (a.k.a. wide)
 *
 *  +----------+----------+ +----------+----------+
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  +---------------------+ +---------------------+
 *  |                     | |          |          |
 *  |                     | |          |          |
 *  |                     | |          |          |
 *  +---------------------+ +---------------------+
 *        2 windows               3 windows
 *
 *  +---------------------+ +---------------------+
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  +------+-------+------+ +----+-----+-----+----+
 *  |      |       |      | |    |     |     |    |
 *  |      |       |      | |    |     |     |    |
 *  |      |       |      | |    |     |     |    |
 *  +------+-------+------+ +----+-----+-----+----+
 *        4 windows               5 windows
 */
function wide(workspace) {
  // the way DWM does it is to reserve half the screen for the first screen,
  // then split the other half among the rest of the screens
  var windows = workspace.visible();
  var screen = workspace.monitor;
  var length = workspace.children.length;

  var main = workspace.getMainWindow()
  if(length == 1) {
    main.move(screen.x, screen.y);
    main.resize(screen.width, screen.height);
  } else {
    // when main scale = 50, the divisor is 2
    var mainScaleFactor = (100 / workspace.getMainWindowScale() );
    var halfHeight = Math.floor(screen.height / mainScaleFactor);
    main.move(screen.x, screen.y);
    main.resize(screen.width, halfHeight);
    // remove from visible
    
    var remainHeight = screen.height - halfHeight;
    var sliceWidth = Math.floor(screen.width / (length - 1));

    workspace.children.slice(1).forEach(function(win, index) {
      win.move(screen.x + index*sliceWidth, screen.y + halfHeight);
      win.resize(sliceWidth, remainHeight);
    });
  }
};

if (typeof module != 'undefined') {
  module.exports = wide;
}
