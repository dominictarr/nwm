/**
 * Grid (a.k.a fair)
 *
 *  +----------+----------+ +----------+----------+
 *  |          |          | |          |          |
 *  |          |          | |          |          |
 *  |          |          | |          |          |
 *  |          |          | +----------+----------+
 *  |          |          | |                     |
 *  |          |          | |                     |
 *  |          |          | |                     |
 *  +---------------------+ +---------------------+
 *        2 windows               3 windows
 *
 *  +----------+----------+ +------+-------+------+
 *  |          |          | |      |       |      |
 *  |          |          | |      |       |      |
 *  |          |          | |      |       |      |
 *  +----------+----------+ +------+---+---+------+
 *  |          |          | |          |          |
 *  |          |          | |          |          |
 *  |          |          | |          |          |
 *  +---------------------+ +---------------------+
 *        4 windows               5 windows
 */

function grid(space) {

  var windows = space.visible();
  var l = space.children.length;

  var rows, cols;
  for(cols = 0; cols <= l/2; cols++) {
    if(cols * cols >= l) {
      break;
    }
  }
  rows = ((cols && (cols -1) * cols >= l) ? cols - 1 : cols);
  // cells
  var cellHeight = space.height / (rows ? rows : 1);
  var cellWidth = space.width / (cols ? cols : 1);

  space.children.forEach(function(win, index) {
    if(rows > 1 && index == (rows*cols) - cols
       && (l - index) <= ( l)
      ) {
      cellWidth = space.width / (l - index);
    }

    var newX = space.x + Math.floor(index % cols) * cellWidth;
    var newY = space.y + Math.floor(index / cols) * cellHeight;
    win.move(Math.floor(newX), Math.floor(newY));

    // adjust height/width of last row/col's windows
    var adjustHeight = ( (index >= cols * (rows -1) ) ?  space.height - cellHeight * rows : 0 );
    var adjustWidth = 0;
    if(rows > 1 && index == l-1 && (l - index) < (l % cols) ) {
      adjustWidth = space.width - cellWidth * (l % cols );
    } else {
      adjustWidth = ( ((index + 1) % cols == 0 ) ? space.width - cellWidth * cols : 0 );
    }

    win.resize(Math.floor(cellWidth+adjustWidth), Math.floor(cellHeight+adjustHeight) );
  });
}

if (typeof module != 'undefined') {
  module.exports = grid;
}
