let board = ['','','', 
             '','','',
             '','',''];

let currentPlayer = 'X';
let gameEnded = false;

document.addEventListener("DOMContentLoaded", function() {

    initializePage();


// window.addEventListener("beforeunload", function(event) {
//     // Call your function here
//     sendPacket();
// });
});


function initializePage() {
    toggleVisibility();
    
    toggleButton();
}

function makeMove(index){
    if(board[index] == '' && !gameEnded){
        board[index] = currentPlayer;   
        updateBoard();
        swapPlayer();
        checkWinner();
    }
}

function updateBoard(){
    const cells = document.getElementsByClassName('cell');

    for (let i = 0; i < 9; i ++) {
        cells[i].textContent = board[i];
    }
}

function swapPlayer() {
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
}



function checkWinner() {
    for (let i = 0; i < 9; i += 3) {
        if (board[i] !== '' && board[i + 1] !== '' && board[i + 2] !== '' && board[i] == board[i + 1] && board[i] == board[i + 2]) {
            toggleVisibility();
            toggleButton();
            sendPacket();
            gameEnded = true; // Set game state to ended
            return;
        }
    }

    for (let i = 0; i < 3; i++) {
        if (board[i] !== '' && board[i + 3] !== '' && board[i + 6] !== '' && board[i] == board[i + 3] && board[i] == board[i + 6]) {
            toggleVisibility();
            toggleButton();
            sendPacket();
            gameEnded = true;
            return;
        }
    }

    if ((board[0] !== '' && board[4] !== '' && board[8] !== '' && board[0] == board[4] && board[0] == board[8]) ||
        (board[2] !== '' && board[4] !== '' && board[6] !== '' && board[2] == board[4] && board[2] == board[6])) {
        toggleVisibility();
        toggleButton();
        sendPacket();
        gameEnded = true;
        return;
    }

    if (!board.includes('')) {
        toggleVisibility('Tie');
        toggleButton();
        sendPacket();
        gameEnded = true;
    }
}


var playAgainButton = document.getElementById("play-again-button");
var alert1 = document.getElementById("alert1");
    function toggleVisibility(result) {
        if (result === 'Tie') {
            alert1.textContent = "It's a tie!";
        } else {
        var previousPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        alert1.textContent = previousPlayer + " won!";
        }
        alert1.style.display = (alert1.style.display === "none") ? "block" : "none";

    }
    function toggleButton(){
    playAgainButton.style.display = (playAgainButton.style.display === "none") ? "block" : "none";
    }


updateBoard();
//Annoying but need all of this to update the games Played section 
function sendPacket() {
    fetch('/updateGames', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // You can include any other data you want to send to the server
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function resetGame() {
    board = Array(9).fill('');

    currentPlayer = 'X';
    toggleVisibility();
    toggleButton();
    updateBoard();
    gameEnded = false;
}
