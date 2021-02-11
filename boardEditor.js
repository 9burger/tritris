addEventListener('click', onclick)

/**
 * @param {MouseEvent} event 
 */
function onclick(event) {
    // determine game board position
    let gameWidth = min(width / 2, height / 2) - 2 * padding;
    let gameHeight = gameWidth * (game.h / game.w);
    if (gameHeight > height) {
        gameHeight = height - 2 * padding;
        gameWidth = gameHeight * (game.w / game.h);
    }
    const gameX = width / 2 - gameWidth / 2;
    const gameY = height / 2 - gameHeight / 2;

    // check that mouse is over gameboard
    if (event.clientX >= gameX && event.clientX <= gameX + gameWidth &&
        event.clientY >= gameY && event.clientY <= gameY + gameHeight) {
        if (gameState == 2) {
            let cell = game.grid.getCellFromMousePos(event.clientX, event.clientY, gameX, gameY, gameWidth, gameHeight);
            if (cell != null) {
                if (event.shiftKey) cell.prevCustomShape();
                else cell.nextCustomShape();
            }
            game.redraw = true;
        }
    }
}
