var gameWon = false;
var winPoints = 512;
var stopGaming = false;

function resetGame() {
    gameWon = false;
    stopGaming = false;
    for (rowIndex = 0; rowIndex < 4; rowIndex++) {
        var row = document.getElementById(rowIndex);
        for (cellIndex = 0; cellIndex < 4; cellIndex++) {
            var cell = row.children[cellIndex];
            if (cell && cell.className) {
                cell.className = "";
            }
        }
    }

    generateDefaultItems();
}

function generateDefaultItems() {
    var randomRowIndex1 = Math.floor((Math.random() * 10) + 1) % 4;
    var randomCellIndex1 = Math.floor((Math.random() * 10) + 1) % 4;

    var randomRowIndex2, randomCellIndex2;
    var isDifferentCell = false;
    while (!isDifferentCell) {
        randomRowIndex2 = Math.floor((Math.random() * 10) + 1) % 4;
        randomCellIndex2 = Math.floor((Math.random() * 10) + 1) % 4;
        if(generateCellId(randomRowIndex1, randomCellIndex1) != generateCellId(randomRowIndex2, randomCellIndex2))
        {
            isDifferentCell = true;
        }
    }

    var Img4visible1 = Math.floor(Math.random() * 10) > 8;
    var Img4visible2 = Math.floor(Math.random() * 10) > 8;

    var firstRandomCell = document.getElementById(generateCellId(randomRowIndex1, randomCellIndex1));
    var secondRandomCell = document.getElementById(generateCellId(randomRowIndex2, randomCellIndex2));

    if (firstRandomCell) {
        firstRandomCell.className = Img4visible1 ? "Img4" : "Img2";
    }
    if (secondRandomCell) {
        secondRandomCell.className = Img4visible2 ? "Img4" : "Img2";
    }
}

function generateNewItem() {
    var emptyItemExists = false;
    var emptyItemCells = [];
    for (rowIndex = 0; rowIndex < 4; rowIndex++) {
        var row = document.getElementById(rowIndex);
        for (cellIndex = 0; cellIndex < 4; cellIndex++) {
            var cell = row.children[cellIndex];
            if (cell && !cell.className) {
                emptyItemExists = true;
                emptyItemCells.push(cell);
            }
        }
    }
    if (emptyItemExists) {
        var randomIndex = Math.floor((Math.random() * 20) + 1) % emptyItemCells.length;

        var Img4visible = Math.floor(Math.random() * 10) > 8;

        var randomItem = emptyItemCells[randomIndex];
        if (randomItem) {
            randomItem.className = Img4visible ? "Img4" : "Img2";
        }
    }
    else{
        showGameOver();
    }
}

function checkIfGameOver() {
    var emptyItemExists = false;
    for (rowIndex = 0; rowIndex < 4; rowIndex++) {
        var row = document.getElementById(rowIndex);
        for (cellIndex = 0; cellIndex < 4; cellIndex++) {
            var cell = row.children[cellIndex];
            if (cell && !cell.className) {
                emptyItemExists = true;
                break;
            }
        }
    }
    if (!emptyItemExists) {
        showGameOver();
    }
}

function gameSuccess(){
    alert('Congratulations!!! You have Won');
}

function showGameOver() {
    stopGaming = true;
    alert('Game Over');
}

function repaintGame(keyEvent) {
    if (keyEvent && !gameWon && !stopGaming) {
        //List of Key Codes
        /*
            37 - Left
            38- Up
            39 - Right
            40 - Down
        */
        var keyCode = keyEvent.keyCode;
        clearCustomFields();
        switch (keyCode) {
            case 37:
                processLeft();
                break;
            case 38:
                processUp();
                break;
            case 39:
                processRight();
                break;
            case 40:
                processDown();
                break;
        }
        //Check if the game is completed
        if (gameWon) {
            gameSuccess();
        }
    }
}

function processLeft() {
    var cellChanged = false;
    for (rowIndex = 0; rowIndex < 4; rowIndex++) {
        var row = document.getElementById(rowIndex);
        if (checkNonEmptyRow(row)) {
            var allSimilarCells = false;
            allSimilarCells = checkNonEmptySimilarRowCells(row);
            for (cellIndex = 3; cellIndex >= 0; cellIndex--) {
                var cell = row.children[cellIndex];
                var prevCellIndex = ((cellIndex - 1) >= 0) ? (cellIndex - 1) : 0;

                if (prevCellIndex != cellIndex) {
                    var prevCell = row.children[prevCellIndex];
                    if (cell.className && (cell.className == prevCell.className)) {
                        //First check for similar previous items also - not just the adjacent
                        var skipAddition = false;

                        var neighborCell = (prevCellIndex - 1 >= 0) ? row.children[prevCellIndex - 1] : null;
                        if (neighborCell && neighborCell.className == prevCell.className) {
                            skipAddition = true;
                        }

                        //If all items in the row are same
                        if (allSimilarCells) {
                            skipAddition = false;
                            allSimilarCells = false;
                        }

                        //If the cells have already been added, then add again
                        if (cell.isAdded || prevCell.isAdded) {
                            skipAddition = true;
                        }

                        if (!skipAddition) {
                            addCells(cell, prevCell);
                            cellChanged = true;
                        }
                    }
                    else if (prevCell.className == "" && cell.className != "") {
                        moveCells(cell, prevCell);
                        cellChanged = true;
                    }
                }
            }
            adjustTableLeft(row);
        }
    }
    if (cellChanged) {
        generateNewItem();
    }
    else {
        checkIfGameOver();
    }
}

function processRight() {
    var cellChanged = false;
    for (rowIndex = 0; rowIndex < 4; rowIndex++) {
        var row = document.getElementById(rowIndex);
        if (checkNonEmptyRow(row)) {
            var allSimilarCells = false;
            allSimilarCells = checkNonEmptySimilarRowCells(row);
            for (cellIndex = 0; cellIndex < 4; cellIndex++) {
                var cell = row.children[cellIndex];
                var nextCellIndex = ((cellIndex + 1) < 4) ? (cellIndex + 1) : 3;

                if (nextCellIndex != cellIndex) {
                    var nextCell = row.children[nextCellIndex];
                    if (cell.className && (cell.className == nextCell.className)) {
                        //First check for similar previous items also - not just the adjacent
                        var skipAddition = false;

                        var neighborCell = (nextCellIndex + 1 < 4) ? row.children[nextCellIndex + 1] : null;
                        if (neighborCell && neighborCell.className == nextCell.className) {
                            skipAddition = true;
                        }

                        //If all items in the row are same
                        if (allSimilarCells) {
                            skipAddition = false;
                            allSimilarCells = false;
                        }

                        //If the cells have already been added, then add again
                        if (cell.isAdded || nextCell.isAdded) {
                            skipAddition = true;
                        }

                        if (!skipAddition) {
                            addCells(cell, nextCell);
                            cellChanged = true;
                        }
                    }
                    else if (nextCell.className == "" && cell.className != "") {
                        moveCells(cell, nextCell);
                        cellChanged = true;
                    }
                }
            }
            adjustTableRight(row);
        }
    }
    if (cellChanged) {
        generateNewItem();
    }
    else {
        checkIfGameOver();
    }
}

function processUp() {
    var cellChanged = false;
    var tableColumns = organizeTableIntoColumns();
    for (columnIndex = 0 ; columnIndex < 4; columnIndex++) {
        var column = tableColumns[columnIndex];
        if (checkNonEmptyColumn(column)) {
            var allSimilarCells = false;
            allSimilarCells = checkNonEmptySimilarColumnCells(column);
            for (cellIndex = 3; cellIndex >= 0; cellIndex--) {
                var cell = column[cellIndex];
                var prevCellIndex = ((cellIndex - 1) >= 0) ? (cellIndex - 1) : 0;

                if (prevCellIndex != cellIndex) {
                    var prevCell = column[prevCellIndex];
                    if (cell.className && (cell.className == prevCell.className)) {
                        //First check for similar previous items also - not just the adjacent
                        var skipAddition = false;

                        var neighborCell = (prevCellIndex - 1 >= 0) ? column[prevCellIndex - 1] : null;
                        if (neighborCell && neighborCell.className == prevCell.className) {
                            skipAddition = true;
                        }

                        //If all items in the column are same
                        if (allSimilarCells) {
                            skipAddition = false;
                            allSimilarCells = false;
                        }

                        //If the cells have already been added, then add again
                        if (cell.isAdded || prevCell.isAdded) {
                            skipAddition = true;
                        }

                        if (!skipAddition) {
                            addCells(cell, prevCell);
                            cellChanged = true;
                        }
                    }
                    else if (prevCell.className == "" && cell.className != "") {
                        moveCells(cell, prevCell);
                        cellChanged = true;
                    }
                }
            }
            adjustTableUp(column);
        }
    }
    if (cellChanged) {
        generateNewItem();
    }
    else {
        checkIfGameOver();
    }
}

function processDown() {
    var cellChanged = false;
    var tableColumns = organizeTableIntoColumns();
    for (columnIndex = 0 ; columnIndex < 4; columnIndex++) {
        var column = tableColumns[columnIndex];
        if (checkNonEmptyColumn(column)) {
            var allSimilarCells = false;
            allSimilarCells = checkNonEmptySimilarColumnCells(column);
            for (cellIndex = 0; cellIndex < 4; cellIndex++) {
                var cell = column[cellIndex];
                var nextCellIndex = ((cellIndex + 1) < 4) ? (cellIndex + 1) : 3;

                if (nextCellIndex != cellIndex) {
                    var nextCell = column[nextCellIndex];
                    if (cell.className && (cell.className == nextCell.className)) {
                        //First check for similar previous items also - not just the adjacent
                        var skipAddition = false;

                        var neighborCell = (nextCellIndex + 1 < 4) ? column[nextCellIndex + 1] : null;
                        if (neighborCell && neighborCell.className == nextCell.className) {
                            skipAddition = true;
                        }

                        //If all items in the column are same
                        if (allSimilarCells) {
                            skipAddition = false;
                            allSimilarCells = false;
                        }

                        //If the cells have already been added, then add again
                        if (cell.isAdded || nextCell.isAdded) {
                            skipAddition = true;
                        }

                        if (!skipAddition) {
                            addCells(cell, nextCell);
                            cellChanged = true;
                        }
                    }
                    else if (nextCell.className == "" && cell.className != "") {
                        moveCells(cell, nextCell);
                        cellChanged = true;
                    }
                }
            }
            adjustTableDown(column);
        }
    }
    if (cellChanged) {
        generateNewItem();
    }
    else {
        checkIfGameOver();
    }
}

function adjustTableLeft(row) {
    if (checkNonEmptyRow(row)) {
        for (cellIndex = 0; cellIndex < 4; cellIndex++) {
            var cell = row.children[cellIndex];
            if (cell && !cell.className) {
                var nonEmptyCell;
                for (j = cellIndex + 1; j < 4; j++) {
                    var nextCell = row.children[j];
                    if (nextCell && nextCell.className) {
                        nonEmptyCell = nextCell;
                        break;
                    }
                }
                if (nonEmptyCell) {
                    moveCells(nonEmptyCell, cell);
                }
            }
        }
    }
}

function adjustTableRight(row) {
    if (checkNonEmptyRow(row)) {
        for (cellIndex = 3; cellIndex >= 0; cellIndex--) {
            var cell = row.children[cellIndex];
            if (cell && !cell.className) {
                var nonEmptyCell;
                for (j = cellIndex - 1; j >= 0; j--) {
                    var nextCell = row.children[j];
                    if (nextCell && nextCell.className) {
                        nonEmptyCell = nextCell;
                        break;
                    }
                }
                if (nonEmptyCell) {
                    moveCells(nonEmptyCell, cell);
                }
            }
        }
    }
}

function adjustTableUp(column) {
    if (checkNonEmptyColumn(column)) {
        for (cellIndex = 0; cellIndex < 4; cellIndex++) {
            var cell = column[cellIndex];
            if (cell && !cell.className) {
                var nonEmptyCell;
                for (j = cellIndex + 1; j < 4; j++) {
                    var nextCell = column[j];
                    if (nextCell && nextCell.className) {
                        nonEmptyCell = nextCell;
                        break;
                    }
                }
                if (nonEmptyCell) {
                    moveCells(nonEmptyCell, cell);
                }
            }
        }
    }
}

function adjustTableDown(column) {
    if (checkNonEmptyColumn(column)) {
        for (cellIndex = 3; cellIndex >= 0; cellIndex--) {
            var cell = column[cellIndex];
            if (cell && !cell.className) {
                var nonEmptyCell;
                for (j = cellIndex - 1; j >= 0; j--) {
                    var nextCell = column[j];
                    if (nextCell && nextCell.className) {
                        nonEmptyCell = nextCell;
                        break;
                    }
                }
                if (nonEmptyCell) {
                    moveCells(nonEmptyCell, cell);
                }
            }
        }
    }
}

function moveCells(sourceCell, destCell) {
    destCell.className = sourceCell.className;
    sourceCell.className = "";
}

function addCells(sourceCell, destCell) {
    destCell.className = incrementClassName(sourceCell.className);
    markCellAsAdded(destCell);
    sourceCell.className = "";
}

function markCellAsAdded(cell) {
    cell.isAdded = true;
}

function clearCustomFields() {
    for (rowIndex = 0; rowIndex < 4; rowIndex++) {
        var row = document.getElementById(rowIndex);
        for (cellIndex = 0; cellIndex < 4; cellIndex++) {
            var cell = row.children[cellIndex];
            if (cell) {
                cell.isAdded = false;
            }
        }
    }
}

function generateCellId(rowIndex, cellIndex) {
    return rowIndex + "_" + cellIndex;
}

function incrementClassName(className) {
    var imageNumber = parseInt(className.replace('Img', ''))
    var newImageNumber = (imageNumber * 2);
    if (newImageNumber == winPoints) {
        gameWon = true;
    }
    var newClassName = 'Img' + newImageNumber;

    return newClassName;
}

function organizeTableIntoColumns() {
    var tablecolumns = [];
    var columnCells = [];

    for (cellIndex = 0 ; cellIndex < 4; cellIndex++) {
        columnCells = [];
        for (rowIndex = 0; rowIndex < 4; rowIndex++) {
            columnCells.push(document.getElementById(generateCellId(rowIndex, cellIndex)));
        }
        tablecolumns.push(columnCells);
    }

    return tablecolumns;
}

function checkNonEmptyRow(row) {
    var isNonEmptyRow = false;
    for (cellIndex = 0; cellIndex < 4; cellIndex++) {
        var cell = row.children[cellIndex];
        if (cell && cell.className) {
            isNonEmptyRow = true;
            break;
        }
    }

    return isNonEmptyRow;
}

function checkNonEmptyColumn(column) {
    var isNonEmptyColumn = false;
    for (cellIndex = 0; cellIndex < 4; cellIndex++) {
        var cell = column[cellIndex];
        if (cell && cell.className) {
            isNonEmptyColumn = true;
            break;
        }
    }

    return isNonEmptyColumn;
}

function checkNonEmptySimilarRowCells(row) {
    var hasSimilarItems = true;
    var className;

    for (cellIndex = 0; cellIndex < 4; cellIndex++) {
        var cell = row.children[cellIndex];
        if (cell && cell.className) {
            if (!className) {
                className = cell.className;
            }
            if (className != cell.className) {
                hasSimilarItems = false;
                break;
            }
        }
        else {
            hasSimilarItems = false;
            break;
        }
    }

    return hasSimilarItems;
}

function checkNonEmptySimilarColumnCells(column) {
    var hasSimilarItems = true;
    var className;

    for (cellIndex = 0; cellIndex < 4; cellIndex++) {
        var cell = column[cellIndex];
        if (cell && cell.className) {
            if (!className) {
                className = cell.className;
            }
            if (className != cell.className) {
                hasSimilarItems = false;
                break;
            }
        }
        else {
            hasSimilarItems = false;
            break;
        }
    }

    return hasSimilarItems;
}