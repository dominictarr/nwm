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

function grid(workspace) {

  console.log('GRID GRID GRID', workspace.children.length)
  var windows = workspace.visible();
  var screen = workspace
  var l = workspace.children.length;

  var rows, cols;
  for(cols = 0; cols <= l/2; cols++) {
    if(cols * cols >= l) {
      break;
    }
  }
  rows = ((cols && (cols -1) * cols >= l) ? cols - 1 : cols);
//  console.log('rows, cols', rows, cols);
  // cells
  var cellHeight = screen.height / (rows ? rows : 1);
  var cellWidth = screen.width / (cols ? cols : 1);

//  console.log('Cell dimensions', cellWidth, cellHeight);
  // order the windows so that the main window is the first window in the grid
  // and the others are in numeric order (with wraparound)
/*  var mainId = workspace.mainWindow;
  var mainPos = window_ids.indexOf(''+mainId);
  mainPos = (mainPos == -1 ? window_ids.indexOf(mainId) : mainPos);
  var ordered = window_ids.slice(mainPos).concat(window_ids.slice(0, mainPos));*/
  workspace.children.forEach(function(win, index) {
    if(rows > 1 && index == (rows*cols) - cols
       && (l - index) <= ( l)
      ) {
      cellWidth = screen.width / (l - index);
    }

    var newX = screen.x + Math.floor(index % cols) * cellWidth;
    var newY = screen.y + Math.floor(index / cols) * cellHeight;
    win.move(Math.floor(newX), Math.floor(newY));

    // adjust height/width of last row/col's windows
    var adjustHeight = ( (index >= cols * (rows -1) ) ?  screen.height - cellHeight * rows : 0 );
    var adjustWidth = 0;
    if(rows > 1 && index == l-1 && (l - index) < (l % cols) ) {
      adjustWidth = screen.width - cellWidth * (l % cols );
    } else {
      adjustWidth = ( ((index + 1) % cols == 0 ) ? screen.width - cellWidth * cols : 0 );
    }

    win.resize(Math.floor(cellWidth+adjustWidth), Math.floor(cellHeight+adjustHeight) );
  });
}

if (typeof module != 'undefined') {
  module.exports = grid;
}
