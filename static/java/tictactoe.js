let board = ['','','', 
             '','','',
             '','',''];

let currentPlayer = 'X';

document.addEventListener("DOMContentLoaded", function() {
   
    initializePage();
});

function initializePage() {
    toggleVisibility();
}

function makeMove(index){
    if(board[index] == '' ){
        board[index] = currentPlayer;   
        updateBoard();
        swapPlayer();
        checkWinner();
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

function checkWinner() {
    if ((board[2] !== '' && board[4] !== '' && board[6] !== '' && board[2] == board[4] && board[2] == board[6]) ||
        (board[0] !== '' && board[4] !== '' && board[8] !== '' && board[0] == board[4] && board[0] == board[8])) {
        toggleVisibility(); 
    } else {
        for (let i = 0; i < board.length; i++) {
            if ((board[i] !== '' && board[i + 1] !== '' && board[i + 2] !== '' && board[i] == board[i + 1] && board[i] == board[i + 2]) ||
                (board[i] !== '' && board[i + 3] !== '' && board[i + 6] !== '' && board[i] == board[i + 3] && board[i] == board[i + 6])) {
                toggleVisibility(); 
            }
        }
    }
}



var alert1 = document.getElementById("alert1");
    function toggleVisibility() {
        var previousPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        alert1.textContent = previousPlayer + " won!";
        alert1.style.display = (alert1.style.display === "none") ? "block" : "none";
    }

   
    


updateBoard();

