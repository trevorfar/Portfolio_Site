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
        checkWinner();
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

function checkWinner(){
     if ((board[2] !== '' && board[4] !== '' && board[6] !== '' && board[2] == board[4] && board[2] == board[6])){
        alert("HELLO");
    }
    else if ((board[0] !== '' && board[4] !== '' && board[8] !== '' && board[0] == board[4] && board[0] == board[8])){
        alert("HELLO");
    }
    else{
        for(let i = 0; i < board.length; i ++){ 
            if ((board[i] !== '' && board[i+1] !== '' && board[i+2] !== '' && board[i] == board[i+1] && board[i] == board[i+2])){
                alert("HELLO");
            }  
            else if ((board[i] !== '' && board[i+3] !== '' && board[i+6] !== '' && board[i] == board[i+3] && board[i] == board[i+6])){
                alert("HELLO");
            }
            
            
    }
}
}

function updateDisplay() {
    document.getElementById('display').value = board;
}
updateBoard();

