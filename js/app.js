import * as UI from "./ui.js";
import { GameBrain } from "./game.js";

let game;
let boardElement;
let subMode = null;

let selectedCell = null;
let awaitingSecondClick = false;
let gameStarted = false;
let timerInterval = null;
let startTime = null;
let elapsedTime = 0;

let boardContainer = document.createElement("div");
boardContainer.classList.add("board-container");
document.body.appendChild(boardContainer);

let gameContainer = document.createElement("div");
gameContainer.classList.add("game-container");

let h1 = document.createElement("h1");
h1.innerHTML = "TIC TAC TWO";
gameContainer.appendChild(h1);

let buttonContainer = document.createElement("div");

let humanVsHumanBtn = document.createElement("button");
humanVsHumanBtn.innerHTML = "Human vs Human";
humanVsHumanBtn.addEventListener("click", () => startGame("human"));

let humanVsAIBtn = document.createElement("button");
humanVsAIBtn.innerHTML = "Human vs AI";
humanVsAIBtn.addEventListener("click", () => startGame("ai"));

let resetBtn = document.createElement("button");
resetBtn.innerHTML = "Reset Game";
resetBtn.addEventListener("click", resetGame);

buttonContainer.appendChild(humanVsHumanBtn);
buttonContainer.appendChild(humanVsAIBtn);
buttonContainer.appendChild(resetBtn);
gameContainer.appendChild(buttonContainer);

let statusContainer = document.createElement("div");
statusContainer.classList.add("status-container");

let currentTurnText = document.createElement("p");
let pieceCountText = document.createElement("p");
let timerText = document.createElement("p");

statusContainer.appendChild(currentTurnText);
statusContainer.appendChild(pieceCountText);
statusContainer.appendChild(timerText);
gameContainer.appendChild(statusContainer);

let actionsContainer = document.createElement("div");
actionsContainer.style.display = "none";
gameContainer.appendChild(actionsContainer);

let placePieceBtn = document.createElement("button");
placePieceBtn.innerHTML = "Place Another Piece";
placePieceBtn.addEventListener("click", activatePlacePieceMode);

let moveGridBtn = document.createElement("button");
moveGridBtn.innerHTML = "Move Grid";
moveGridBtn.addEventListener("click", activateMoveGridMode);

let movePieceBtn = document.createElement("button");
movePieceBtn.innerHTML = "Move a Piece";
movePieceBtn.addEventListener("click", activateMovePieceMode);

actionsContainer.appendChild(placePieceBtn);
actionsContainer.appendChild(moveGridBtn);
actionsContainer.appendChild(movePieceBtn);

let gridArrowsContainer = document.createElement("div");
gridArrowsContainer.style.display = "none";
actionsContainer.appendChild(gridArrowsContainer);

const directions = [
  { dir: "up", label: "↑" },
  { dir: "down", label: "↓" },
  { dir: "left", label: "←" },
  { dir: "right", label: "→" },
  { dir: "up-left", label: "↖" },
  { dir: "up-right", label: "↗" },
  { dir: "down-left", label: "↙" },
  { dir: "down-right", label: "↘" },
];
directions.forEach(d => {
    let btn = document.createElement("button");
    btn.innerHTML = d.label;
    btn.addEventListener("click", () => {
        if (game.gameMode === "ai" && game.currentPlayer === "O") return;
        game.moveGrid(d.dir);

        subMode = null;
        updateActiveButtonStyles();

        UI.updateBoard(boardElement, game.board, game.highlightOrigin);

        checkActionMode();
        updateStatus();
    });
    gridArrowsContainer.appendChild(btn);
  });

document.body.appendChild(gameContainer);
document.body.appendChild(boardContainer);

function startGame(mode) {
    game = new GameBrain(mode);
    game.afterAIMove = () => {
     UI.updateBoard(boardElement, game.board, game.highlightOrigin);
     checkActionMode();
     updateStatus();
     updateActiveButtonStyles();
   };

    boardContainer.innerHTML = "";
    boardElement = UI.getInitialBoard(game.board, game.highlightOrigin, cellUpdateFn);
    boardContainer.appendChild(boardElement);

    subMode = null;
    actionsContainer.style.display = "none";
    updateActiveButtonStyles();
    updateStatus();
    resetTimer();
}

function cellUpdateFn(x, y, e) {
    if (game.gameMode === "ai" && game.currentPlayer === "O") return;

    if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }
    if (game.phase === "placing") {
        game.makeAMove(x, y);
    } else {
        switch (subMode) {
            case "placePiece":
                game.placeAnotherPiece(x, y);
                subMode = null;
                break;
            case "moveGrid":
                break;
            case "movePiece":
                handleMovePiece(x, y);
                break;
            default:
                break;
        }
    }

    UI.updateBoard(boardElement, game.board, game.highlightOrigin);
    checkActionMode();
    updateStatus();
    updateActiveButtonStyles();
}

function checkActionMode() {
    if (game.phase === "actionMode") {
        actionsContainer.style.display = "block";
    }
}

function updateStatus() {
    if (game.winner) {
        stopTimer();
        currentTurnText.textContent = `WINNER: ${game.winner} !!!`;
        pieceCountText.textContent = `Game Over!`;
        return;
    }

    currentTurnText.textContent = `Current Turn: ${game.currentPlayer}`;
    let remainingX = 4 - game.pieceCount["X"];
    let remainingO = 4 - game.pieceCount["O"];
    pieceCountText.textContent = `Remaining Pieces → X: ${remainingX}, O: ${remainingO}`;
}

function setSubMode(mode) {
    subMode = mode;
    updateActiveButtonStyles();
}

function handleMovePiece(x, y) {
    if (!awaitingSecondClick) {
        if (game.board[x][y] === game.currentPlayer) {
            selectedCell = { x, y };
            awaitingSecondClick = true;

            highlightSelectedCell(x, y);
        }
    } else {
        game.movePiece(selectedCell.x, selectedCell.y, x, y);

        awaitingSecondClick = false;
        selectedCell = null;
        subMode = null;
        removeCellHighlights();
    }
}

function highlightSelectedCell(x, y) {
    const index = x * 5 + y; 
    const cellElems = boardElement.querySelectorAll(".cell");
    cellElems[index].classList.add("active");
}

function removeCellHighlights() {
    const cellElems = boardElement.querySelectorAll(".cell");
    cellElems.forEach(cell => cell.classList.remove("active"));
}

function activatePlacePieceMode() {
    setSubMode("placePiece");
}

function activateMoveGridMode() {
    setSubMode("moveGrid");
}

function activateMovePieceMode() {
    setSubMode("movePiece");
    awaitingSecondClick = false;
    selectedCell = null;
}

function updateActiveButtonStyles() {
    placePieceBtn.classList.toggle("active", subMode === "placePiece");
    moveGridBtn.classList.toggle("active", subMode === "moveGrid");
    movePieceBtn.classList.toggle("active", subMode === "movePiece");

    if (subMode === "moveGrid") {
        gridArrowsContainer.style.display = "block";
    } else {
        gridArrowsContainer.style.display = "none";
    }
}

function resetGame() {
    game.resetGame();
    UI.updateBoard(boardElement, game.board, game.highlightOrigin);
    actionsContainer.style.display = "none";
    subMode = null;
    updateActiveButtonStyles();
    updateStatus();
    resetTimer();
}

startGame("human");

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    timerText.textContent = `Elapsed Time: ${formatTime(elapsedTime)}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  gameStarted = false;
  elapsedTime = 0;
  timerText.textContent = "Elapsed Time: 00:00";
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}