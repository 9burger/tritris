class Grid {
    constructor(width, height) {
        this.w = width;
        this.h = height;
        /** @type {GridCell[][]]} */
        this.grid = [];
        for (let i = 0; i < this.h; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.w; j++) {
                this.grid[i].push(new GridCell());
            }
        }
    }

    clearLines() {
        let linesCleared = [];
        for (let row = 0; row < this.h; row++) {
            let full = true;
            for (let col = 0; col < this.w; col++) {
                if (!this.grid[row][col].isFull()) {
                    full = false;
                    break;
                }
            }
            if (full) {
                linesCleared.push(row);
            }
        }
        return linesCleared;
    }

    removeRightTri(row, col) {
        if (col < 0 || col >= this.w) return;
        this.grid[row][col].removeRightTri();
    }

    removeLeftTri(row, col) {
        if (col < 0 || col >= this.w) return;
        this.grid[row][col].removeLeftTri();
    }

    removeLine(row) {
        this.grid.splice(row, 1); //Remove the row
        this.grid.unshift([]); //Add a new row at the top
        for (let col = 0; col < this.w; col++) this.grid[0].push(new GridCell());
    }

    addPiece(piece) {
        for (let row = 0; row < piece.grid.length; row++) {
            for (let col = 0; col < piece.grid[0].length; col++) {
                let gridRow = row + piece.pos.y;
                let gridCol = col + piece.pos.x;
                this.grid[gridRow][gridCol].mergeCell(piece.grid[row][col]);
            }
        }
    }

    isValid(piece) {
        for (let row = 0; row < piece.grid.length; row++) {
            for (let col = 0; col < piece.grid[0].length; col++) {
                let gridRow = row + piece.pos.y;
                let gridCol = col + piece.pos.x;
                if (
                    this.grid[gridRow][gridCol].collides(piece.grid[row][col])
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    show(x, y, w, h, colors, paused, showGridLines) {
        const cellW = w / this.w;
        const cellH = h / this.h;

        if (!paused) {
            //Draws the triangles in the grid
            for (let i = 0; i < this.h; i++) {
                for (let j = 0; j < this.w; j++) {
                    this.grid[i][j].show(
                        x + j * cellW,
                        y + i * cellH,
                        cellW,
                        cellH,
                        colors
                    );
                }
            }
        }

        if (showGridLines) {
            //Draws the grid outline
            stroke(100);
            strokeWeight(2);
            //Vertical lines
            for (let i = 0; i <= this.w; i++)
                line(x + i * cellW, y, x + i * cellW, y + h);
            //Horizontal lines
            for (let j = 0; j <= this.h; j++)
                line(x, y + j * cellH, x + w, y + j * cellH);
        }
    }

    /**
     * @return {Grid}
     */
    copy() {
        let newGrid = new Grid(this.w, this.h);
        for (let i = 0; i < this.h; i++) {
            for (let j = 0; j < this.w; j++) {
                newGrid.grid[i][j] = this.grid[i][j].copy();
            }
        }
        return newGrid;
    }

    /**
     * @return {GridCell}
     */
    getCellFromMousePos(mouseX, mouseY, x, y, w, h) {
        let gY = (mouseX - x)/w*this.w;
        let gX = (mouseY - y)/h*this.h;
        return this.grid[parseInt(gX)][parseInt(gY)];
    }

    /**
     * @return {String}
     */
    export() {
        var s = this.w + ":" + this.h + ":";
        for (let v of this.grid) {
            for (let g of v) {
                s += g.export();
            }
        }
        return s;
    }
}

/**
 * 
 * @param {String} str 
 */
function importNewGrid(str) {
    let split = str.split(':');
    let grid = new Grid(parseInt(split[0]), parseInt(split[1]));
    if (split.length > 2){
        for (let i in split[2]) {
            grid.grid[parseInt(i/4.0/grid.w)][parseInt(i/4.0%grid.w)].setTriFromS(split[2][i], parseInt(i%4))
        }
    }
    return grid
}

//EOF