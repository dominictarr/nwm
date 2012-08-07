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
function tile(space) {
  // the way DWM does it is to reserve half the space for the first space,
  // then split the other half among the rest of the spaces
  var windows = space.visible();
  var mainWin = space.getMainWindow();
  var length = space.children.length
  if(length == 1) {
    mainWin.move(space.x, space.y);
    mainWin.resize(space.width, space.height);
    return
  }
  // when main scale = 50, the divisor is 2
  var mainScaleFactor = (100 / space.getMainWindowScale() );
  var halfWidth = Math.floor(space.width / mainScaleFactor);

  mainWin.move(space.x, space.y);
  mainWin.resize(halfWidth, space.height);

  // remove from visible
  var rest = space.children.slice(1)
  var remainWidth = space.width - halfWidth;
  var sliceHeight = Math.floor(space.height / (rest.length) );
  rest.forEach(function(win, index) {
    win.move(space.x + halfWidth, space.y + index*sliceHeight);
    win.resize(remainWidth, sliceHeight);
  });

};

if (typeof module != 'undefined') {
  module.exports = tile;
}
