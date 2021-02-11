
class GridCell {
    constructor(triangles, clr) {
        this.customShape = -1;
        if (triangles == undefined) {
            /** @type {Triangle[][]} */
            this.tris = [
                [null, null],
                [null, null],
            ];
        } else {
            /** @type {Triangle[][]} */
            this.tris = [];
            for (let row = 0; row < 2; row++) {
                this.tris.push([]);
                for (let col = 0; col < 2; col++) {
                    if (triangles[row][col] == 1) {
                        this.tris[row][col] = new Triangle(clr);
                    } else {
                        this.tris[row][col] = null;
                    }
                }
            }
        }
    }

    removeRightTri() {
        this.tris[0][1] = null;
        this.tris[1][1] = null;
        this.customShape = -1;
    }

    removeLeftTri() {
        this.tris[0][0] = null;
        this.tris[1][0] = null;
        this.customShape = -1;
    }

    isFull() {
        return (this.tris[0][0] !== null && this.tris[1][1] !== null) ||
            (this.tris[1][0] !== null && this.tris[0][1] !== null);
    }

    rotatedLeft() {
        let rotated = new GridCell();
        rotated.tris = [
            [this.tris[0][1], this.tris[1][1]],
            [this.tris[0][0], this.tris[1][0]],
        ];
        return rotated;
    }

    rotatedRight() {
        let rotated = new GridCell();
        rotated.tris = [
            [this.tris[1][0], this.tris[0][0]],
            [this.tris[1][1], this.tris[0][1]],
        ];
        return rotated;
    }

    addCell(cell) {
        for (let row = 0; row < this.tris.length; row++) {
            for (let col = 0; col < this.tris[0].length; col++) {
                if (cell.tris[row][col])
                    this.tris[row][col] = cell.tris[row][col];
            }
        }
        this.customShape = -1;
    }

    collides(other) {
        for (let row = 0; row < this.tris.length; row++) {
            for (let col = 0; col < this.tris[0].length; col++) {
                if (!this.tris[row][col]) continue;
                if (
                    other.tris[row][col] ||
                    other.tris[(row + 1) % 2][col] ||
                    other.tris[row][(col + 1) % 2]
                )
                    return true; //There is a collision
            }
        }
        return false;
    }

    show(x, y, w, h, colors) {
        // if (this.selected) {
        //     fill(color(100, 100, 255));
        //     rect(x, y, w, h)
        // }
        for (let row = 0; row < this.tris.length; row++) {
            for (let col = 0; col < this.tris[0].length; col++) {
                if (this.tris[row][col])
                    this.tris[row][col].show(x, y, w, h, row, col, colors);
            }
        }
    }

    nextCustomShape() {
        this.customShape++;
        if (this.customShape >= 6) this.customShape = 0;
        this.setCustomShape();
    }

    prevCustomShape() {
        if (this.customShape == -1) this.customShape = 5;
        this.customShape--;
        if (this.customShape <= -1) this.customShape = 5;
        this.setCustomShape();
    }

    setCustomShape() { // shit lazy arse shit but idc it works
        switch (this.customShape) {
            case 0: {
                this.tris = [
                    [null, null],
                    [null, new Triangle(6)],
                ];
                break;
            }
            case 1: {
                this.tris = [
                    [null, null],
                    [new Triangle(6), null],
                ];
                break;
            }
            case 2: {
                this.tris = [
                    [new Triangle(6), null],
                    [null, null],
                ];
                break;
            }
            case 3: {
                this.tris = [
                    [null, new Triangle(6)],
                    [null, null],
                ];
                break;
            }
            case 4: {
                this.tris = [
                    [null, new Triangle(6)],
                    [new Triangle(6), null],
                ];
                break;
            }
            case 5: {
                this.tris = [
                    [null, null],
                    [null, null],
                ];
                break;
            }
        }
    }

    /**
     * @return {GridCell}
     */
    copy() {
        let gridCell = new GridCell(undefined, 0);
        for (let row = 0; row < this.tris.length; row++) {
            for (let col = 0; col < this.tris[0].length; col++) {
                let tris = this.tris[row][col];
                if (tris == null) continue;
                gridCell.tris[row][col] = tris.copy();
            }
        }
        return gridCell;
    }

    /**
     * @return {String}
     */
    export() {
        return this.getSFromTri(0, 0) + this.getSFromTri(0, 1) + this.getSFromTri(1, 0) + this.getSFromTri(1, 1);
    }

    /**
     * @return {String}
     */
    getSFromTri(x, y) {
        let a = this.tris[x][y];
        if (a == null) return "-";
        return String(a.clr);
    }

    setTriFromS(s, i) {
        let x = parseInt(i / 2);
        let y = parseInt(i % 2);
        this.tris[x][y] = isNaN(s) ? null : new Triangle(parseInt(s));
    }
}

class Triangle {
    constructor(color) {
        this.color = color;
    }

    show(x, y, w, h, row, col, colors) {
        stroke(100);
        strokeWeight(2);
        fill(colors[this.color]);
        if (row == 0 && col == 0) {
            triangle(x, y, x + w, y, x, y + h);
        } else if (row == 0 && col == 1) {
            triangle(x, y, x + w, y, x + w, y + h);
        } else if (row == 1 && col == 0) {
            triangle(x, y, x, y + h, x + w, y + h);
        } else if (row == 1 && col == 1) {
            triangle(x, y + h, x + w, y, x + w, y + h);
        }
    }

    /**
     * @return {Triangle}
     */
    copy() {
        return new Triangle(this.color);
    }
}

//EOF