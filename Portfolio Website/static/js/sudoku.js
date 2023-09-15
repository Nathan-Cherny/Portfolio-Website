function display2dList(list_){
    for(let row of list_){
        for(let col of row){
            process.stdout.write(" " + col)
        }
        console.log()
    }
}

function isIn(list_, num){
    for(let val of list_){
        if(val == num){
            return true
        }
    }
    return false
}

function randint(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randchoice(list_){
    return list_[Math.floor(Math.random() * list_.length)]
}

function getEmptyList(n=9){
    let list_ = []
    for(let i = 0; i < n; i++){
        list_.push(0)
    }
    return list_
}

function removeDuplicates(list_){
    return [... new Set(list_)]
}

class Board{
    constructor(difficulty = 27){
        this.difficulty = difficulty
        this.board = this.generateValidBoard()
        this.maskedBoard = this.maskBoard(this.board)
    }

    generateEmptyBoard(rows=9, cols=9){
        let board = []
        for(let i = 0; i < rows; i++){
            let row = []
            for(let j = 0; j < cols; j++){
                row.push(0)
            }
            board.push(row)
        }
        return board
    }

    breakBoardIntoSquares(board){ // breaking the board (2d list) into lists of each square (3x3) (becomes 3d)'
        /* algorithm here is to:

            essentially this algorithm can be looked at as doing two 2d iterations; we're going through each row and col of the
            squares and then for each square we just get the values inside which also happen to be in a 2d list

            so we need four variables:

            -squareRow: what row the square we're looking at is in
            -squareCol: what col the square we're looking at is in
            -innerSquareRow: what row the value inside of the square that we're looking at is in
            -innerSquareCol: what col the value inside of the square that we're looking at is in
        */

        let squareRow = 0
        let squareCol = 0
        let innerSquareRow = 0
        let innerSquareCol = 0
        
        const SQUARES = 9 // there will be 9 squares in total
        const SQUARESINROWCOL = Math.sqrt(SQUARES) // SQUARE root the amount of squares, it needs to be a square after all
        const VALUESINSQUARE = 9 // there will be 9 values in each square
        const VALUESINROWCOL = Math.sqrt(VALUESINSQUARE) // same logic with the square root

        // ideally, if i wanted to do something like change the dimensions of the sudoku board i would do some calculations
        // depending on parameters/the size of the board to change those constants, but my goal for this project is clean,
        // simple sudoku.

        let listOfSquares = [] // final list, will be 3d

        /*
        first dimension: the actual list itself
        second dimension: each row of squares
        third dimension: the squares itself (a list of the numbers in that square)
        */

        while(squareRow < SQUARESINROWCOL){ // row major to get all the squares
            let rowOfSquares = [] // getting the list of squares in this first row
            while(squareCol < SQUARESINROWCOL){ // going col

                innerSquareRow = 0 // getting the values from each square
                innerSquareCol = 0
                let currentSquare = []
                while(innerSquareRow < VALUESINROWCOL){ // row major through each square
                    while(innerSquareCol < VALUESINROWCOL){
                        let row = (squareRow * SQUARESINROWCOL) + innerSquareRow // times square row by 3 here to account for how many squares we've
                        let col = (squareCol * SQUARESINROWCOL) + innerSquareCol // already counted, same for col
                        currentSquare.push(board[row][col]) // the rest of this is just 2d list iteration shenanigans
                        innerSquareCol += 1
                    }
                    innerSquareRow += 1
                    innerSquareCol = 0
                }
                rowOfSquares.push(currentSquare)

                squareCol += 1
            }
            squareRow += 1
            squareCol = 0
            listOfSquares.push(rowOfSquares)
        }

        return listOfSquares

        /*
                yes, that is 4 nested while loops you are seeing. i know nested loops, especially while loops, are (to some)
                programming monstrosities.
                
                however within the context of this specific algorithm i believe it makes sense, given the way i look at 
                this algorithm.

                no one bats an eye when iterating through a 2d list with a nested while loop: one while loop for a row, another
                for a column.

                this algorithm is iterating through the board to get the squares just like any regular 2d list iteration.
                the exception is that instead of the values in that 2d list being ints or strings or whatever, its another 
                list that we also need to iterate through.
                
                to lock down the sense of the algorithm we're working with, i believe this way is the most intuitive and easily
                understandable.

        */

    }

    getSquare(board, row, col){ // using the list of squares we made in the function above
        row = Math.trunc(row / 3) // divide by 3 and truncate to get which square
        col = Math.trunc(col / 3)

        let brokenSquares = this.breakBoardIntoSquares(board)
        return brokenSquares[row][col]
    }

    getRow(board, row){ // for consistency
        return board[row]
    }

    getCol(board, col){ // bundle up simple code into a quick function
        let column = []
        for(let row of board){
            column.push(row[col])
        }
        return column
    }

    getInvalidNumbers(board, row, col){ // 3 helper functions above makes this easy
        /* this is an essential helper function for the answer key builder
        we get all the numbers from the unit's row column and square, concatenate them together
        then remove duplicate numbers
        what's remaining is every number that is in that units row column and square
        why we do this is because sudoku works by having a row column and square (each consisting of 9 total values) having all numbers 1-9
        but because there's a total of 9 the same rule can be expressed by saying that there can't be any duplicate numbers 1-9
        so if we get all the numbers from the units row column and square we know that the unit cannot be any of those numbers, and
        that'll be valid within sudoku's rules*/
        return removeDuplicates(this.getRow(board, row).concat(this.getCol(board, col)).concat(this.getSquare(board, row, col)))
    }

    getRandomValidNumber(invalidNumbers){ // another key helper function
        let validNumbers = []
        for(let i = 1; i <= 9; i++){ // go through 1-9
            if(!isIn(invalidNumbers, i)){ // if that number isn't there (so its valid) we throw it into the list of valid numbers
                validNumbers.push(i)
            }
        }
        return randchoice(validNumbers) // choose any number from the list of valid numbers
    }

    generateValidBoard(){ // this generates the answer key
        let board = this.generateEmptyBoard()

        let validNumberAttempts = 0 

        for(let row = 0; row < board.length; row++){ // row major, doing this process for every unit
            for(let col = 0; col < board[0].length; col++){
                let invalidNumbers = this.getInvalidNumbers(board, row, col) // get all the invalid numbers for the unit
                let validNumber = this.getRandomValidNumber(invalidNumbers) // throw that into the get valid number function, get a valid number
                if(!validNumber){board[row] = getEmptyList(9); col = -1} /* if the number is undefined that means that the invalidNumbers list 
                                                                            we gave this was [1-9]. this can happen because we're randomly picking
                                                                            numbers - the random number picked could be valid in that micro
                                                                            scenario but in the macro view point it could force the rest of the row
                                                                            to be invalid by taking away a number that could only work in that spot.
                                                                            to circumvent this we simply check if the number we got back is 
                                                                            undefined and then if it is, we try again, setting the row back to 
                                                                            default and the col to -1 (and then the for loop sets it back to 0)
                                                                            and it won't take that long to generate a valid board.*/
                else{board[row][col] = validNumber}
                validNumberAttempts++
                if(validNumberAttempts > 500){                              /* similarly, sometimes the way the board itself
                                                                               is constructed can lead to impossible unit
                                                                               placements. to circumvent this, we count how
                                                                               many times this loop has been done (basically
                                                                               how many times we have attempted to fill in
                                                                               a unit) and if its over some arbitrary amount,
                                                                               like 500, we recursively start over and return
                                                                               what works - similar to how we do it for each
                                                                               row, but starting the whole thing over for
                                                                               each row is redundant and would make this much
                                                                               longer.
                                                                            */
                    return this.generateValidBoard()
                }
            }
        }

        return board
    }

    getAllUnitLocations(board){
        let locations = {}
        for(let i = 0; i <= 9; i++){
            locations[i] = []
        }

        for(let row = 0; row < board.length; row++){
            for(let col = 0; col < board[0].length; col++){
                if(board[row][col] == ""){
                    board[row][col] = 0
                }
                locations[String(board[row][col])].push([row, col])
            }
        }

        return locations
    }

    maskBoard(board, difficulty=this.difficulty, mask=""){ // difficulty = how many are we gonna show
        let locations = this.getAllUnitLocations(board)
        let unitsToMask = (board.length * board[0].length) - difficulty
        let maskedBoard = JSON.parse(JSON.stringify(board))

        let i = 1
        while(unitsToMask > 0){
            let currentList = locations[String(i)]
            let randomUnit = randchoice(currentList)
            let randomUnitIndex = currentList.indexOf(randomUnit)

            maskedBoard[randomUnit[0]][randomUnit[1]] = mask

            currentList.splice(randomUnitIndex, 1)

            i++
            if(i == 10){
                i = 1
            }
            unitsToMask--
        }

        return maskedBoard
    }
}
