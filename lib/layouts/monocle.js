/**
 * Monocle (a.k.a. fullscreen)
 *
 *  +---------------------+ +---------------------+
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  +---------------------+ +---------------------+
 *        2 windows               3 windows
 *
 *  +---------------------+ +---------------------+
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  +---------------------+ +---------------------+
 *        4 windows               5 windows
 */

function monocle(space){
  var windows = space.visible();
  // make sure that the main window is visible, always!
  var mainWin = space.getMainWindow();
  if(!mainWin)
    return console.log("NO MAIN WINDOW") 
  mainWin.move(space.x, space.y);
  mainWin.resize(space.width, space.height);
  mainWin.raise()
}

if (typeof module != 'undefined') {
  module.exports = monocle;
}
