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
function wide(space) {
  // the way DWM does it is to reserve half the space for the first space,
  // then split the other half among the rest of the spaces
  var windows = space.visible();
  var length = space.children.length;
  var main = space.getMainWindow();

  if(length == 1) {
    main.move(space.x, space.y);
    main.resize(space.width, space.height);
  } else {
    // when main scale = 50, the divisor is 2
    var mainScaleFactor = (100 / space.getMainWindowScale() );
    var halfHeight = Math.floor(space.height / mainScaleFactor);
    main.move(space.x, space.y);
    main.resize(space.width, halfHeight);
    // remove from visible
    
    var remainHeight = space.height - halfHeight;
    var sliceWidth = Math.floor(space.width / (length - 1));

    space.children.slice(1).forEach(function(win, index) {
      win.move(space.x + index*sliceWidth, space.y + halfHeight);
      win.resize(sliceWidth, remainHeight);
    });
  }
};

if (typeof module != 'undefined') {
  module.exports = wide;
}
