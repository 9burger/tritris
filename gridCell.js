
class GridCell {
    constructor(leftTriangle, rightTriangle, angle) {
        this.customShape = -1;
        this.leftTriangle = leftTriangle;
        this.rightTriangle = rightTriangle;

        // internal angle of the cell. 0 = /, 1 = \
        if (angle === 0 || angle === 1) {
            this.angle = angle;
        }
        else {
            this.angle = 0;
        }
        // if (triangles == undefined) {
        //     /** @type {Triangle[][]} */
        //     this.tris = [
        //         [null, null],
        //         [null, null],
        //     ];
        // } else {
        //     /** @type {Triangle[][]} */
        //     this.tris = [];
        //     for (let row = 0; row < 2; row++) {
        //         this.tris.push([]);
        //         for (let col = 0; col < 2; col++) {
        //             if (triangles[row][col] == 1) {
        //                 this.tris[row][col] = new Triangle(color);
        //             } else {
        //                 this.tris[row][col] = null;
        //             }
        //         }
        //     }
        // }
    }


    static cellFromTris(triangles, clr) {	
        if (triangles == undefined) {	
            return new GridCell();
        }

        let cell = new GridCell();
        if (triangles[0][1] === 1 || triangles[1][0] === 1) {
            cell.angle = 1;
        }
        
        if (triangles[0][0] === 1 || triangles[1][0] === 1) {
            cell.leftTriangle = clr;
        }
        if (triangles[0][1] === 1 || triangles[1][1] === 1) {
            cell.rightTriangle = clr;
        }

        return cell;
    }

    removeRightTri() {
        this.rightTriangle = null;
        this.customShape = -1;
    }

    removeLeftTri() {
        this.leftTriangle = null;
        this.customShape = -1;
    }

    isFull() {
        return (this.leftTriangle != null && this.rightTriangle != null);
    }

    isEmpty() {
        return (this.leftTriangle == null && this.rightTriangle == null);
    }

    rotatedLeft() {
        // rotation always flips internal angle, counter-clockwise rotation requires swapping triangles if rotating from angle 1 (\) to angle 0 (/)
        let rotated = null;
        if (this.angle === 0) {
            rotated = new GridCell(this.leftTriangle, this.rightTriangle, (1 - this.angle))
        }
        else {
            // pass triangles in reverse order to swap them
            rotated = new GridCell(this.rightTriangle, this.leftTriangle, (1 - this.angle))
        }
        return rotated;
    }

    rotatedRight() {
        // clockwise rotation requires swapping triangles if rotating from angle 0 (/) to angle 1 (\)
        let rotated = null;
        if (this.angle === 1) {
            rotated = new GridCell(this.leftTriangle, this.rightTriangle, (1 - this.angle))
        }
        else {
            // pass triangles in reverse order to swap them
            rotated = new GridCell(this.rightTriangle, this.leftTriangle, (1 - this.angle))
        }
        return rotated;
    }

    /**
     * @param {GridCell} cell 
     */
    mergeCell(cell) {
        if (this.collides(cell)) {
            return false;
        }
        if (cell.isEmpty()) {
            return true;
        }

        if (this.isEmpty()) {
            this.angle = cell.angle;
            this.leftTriangle = cell.leftTriangle;
            this.rightTriangle = cell.rightTriangle;
        }
        else {
            // angles should already match after collides call
            if (this.leftTriangle == null) {
                this.leftTriangle = cell.leftTriangle;
            }
            if (this.rightTriangle == null) {
                this.rightTriangle = cell.rightTriangle;
            }
        }
        this.customShape = -1;
        return true;
    }

    /**
     * @param {GridCell} other 
     */
    collides(other) {
        if (this.isEmpty() || other.isEmpty()) {
            // if either cell is empty, they can't collide
            return false;
        }
        else if (this.isFull() || other.isFull()) {
            // if neither cell is empty and either cell is full, they always collide
            return true;
        }
        else if (this.angle !== other.angle) {
            // if neither cell is empty and the internal angles don't match, they always collide
            return true;
        }
        else if ((this.leftTriangle != null && other.leftTriangle != null) || (this.rightTriangle != null && other.rightTriangle != null)) {
            // if triangles overlap, they collide
            return true;
        }
        
        return false;
    }

    show(x, y, w, h, colors) {
        stroke(100);
        strokeWeight(2);

        console.log(colors);
        console.log(this.leftTriangle);
        console.log(this.rightTriangle);
        let leftColor = colors[this.leftTriangle];
        let rightColor = colors[this.rightTriangle];

        if (this.leftTriangle != null) {
            console.log(leftColor);
            fill(leftColor);
            if (this.angle === 0) {
                // upper left triangle
                triangle(x, y, x + w, y, x, y + h);
            } else {
                // lower left triangle
                triangle(x, y, x, y + h, x + w, y + h);
            }
        }
        if (this.rightTriangle != null) {
            console.log(rightColor);
            fill(rightColor);
            if (this.angle === 0) {
                // lower right triangle
                triangle(x, y + h, x + w, y, x + w, y + h);
            } else {
                // upper right triangle
                triangle(x, y, x + w, y, x + w, y + h);
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
        // let gridCell = new GridCell(undefined, 0);
        // for (let row = 0; row < this.tris.length; row++) {
        //     for (let col = 0; col < this.tris[0].length; col++) {
        //         let tris = this.tris[row][col];
        //         if (tris == null) continue;
        //         gridCell.tris[row][col] = tris.copy();
        //     }
        // }
        // return gridCell;
        return new GridCell(this.leftTriangle, this.rightTriangle, this.angle);
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
        return String(a.color);
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