let board = ['','','', 
             '','','',
             '','',''];


//CURRENTLY, PUTTING 3 in MAKE MOVE DOESNT MAKE THE THIRD CELL TURN INTO X DONT KNOW WHY START HERE 


let currentPlayer = 'X';

function makeMove(index){
    if(board[index] == '' ){
        board[index] = currentPlayer;   
        updateBoard();
        swapPlayer();
        // checkWinner();
        updateDisplay();
    }
}

function updateBoard(){
    const cells = document.getElementsByClassName('cell');

    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = board[i];
    }
}

function swapPlayer() {
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
}


function updateDisplay() {
    document.getElementById('display').value = board;
}
updateBoard();

