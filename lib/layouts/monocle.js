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

function monocle(workspace){
  var windows = workspace.visible();
  var screen = workspace
  // make sure that the main window is visible, always!
  var mainWin = workspace.getMainWindow();
  if(!mainWin)
    return console.log("NO MAIN WINDOW") 
  mainWin.move(screen.x, screen.y);
  mainWin.resize(screen.width, screen.height);
  mainWin.raise()
}

if (typeof module != 'undefined') {
  module.exports = monocle;
}
