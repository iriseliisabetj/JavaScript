var g=Object.defineProperty;var p=(c,e,t)=>e in c?g(c,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[e]=t;var a=(c,e,t)=>p(c,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();class f{constructor(e="human"){a(this,"boardState");a(this,"pieceCount");a(this,"currentPlayer");a(this,"gameMode");a(this,"phase");a(this,"highlightOrigin");a(this,"winner");this.boardState=this.createEmptyBoard(),this.pieceCount={X:0,O:0},this.currentPlayer="X",this.gameMode=e,this.phase="placing",this.highlightOrigin={x:1,y:1},this.winner=null}createEmptyBoard(){const e=[];for(let t=0;t<5;t++){const r=[null,null,null,null,null];e.push(r)}return e}get board(){return this.boardState}makeAMove(e,t){this.winner||this.boardState[e][t]===null&&this.pieceCount[this.currentPlayer]<4&&(this.boardState[e][t]=this.currentPlayer,this.pieceCount[this.currentPlayer]++,this.checkPhaseTransition(),this.checkForWin(),this.winner||(this.currentPlayer=this.currentPlayer==="X"?"O":"X"),this.gameMode==="ai"&&this.currentPlayer==="O"&&!this.winner&&this.makeAIMove())}makeAIMove(){if(!this.winner&&this.pieceCount.O<4){for(let e=0;e<5;e++)for(let t=0;t<5;t++)if(this.boardState[e][t]===null){this.boardState[e][t]="O",this.pieceCount.O++,this.checkPhaseTransition(),this.checkForWin(),this.winner||(this.currentPlayer="X");return}}}checkPhaseTransition(){this.pieceCount.X>=2&&this.pieceCount.O>=2&&(this.phase="actionMode")}placeAnotherPiece(e,t){this.winner||this.phase==="actionMode"&&this.currentPlayer&&this.pieceCount[this.currentPlayer]<4&&this.boardState[e][t]===null&&(this.boardState[e][t]=this.currentPlayer,this.pieceCount[this.currentPlayer]++,this.checkForWin(),this.winner||(this.currentPlayer=this.currentPlayer==="X"?"O":"X"))}moveGrid(e){if(this.winner)return;const{x:t,y:r}=this.highlightOrigin;switch(e){case"up":t>0&&this.highlightOrigin.x--;break;case"down":t<2&&this.highlightOrigin.x++;break;case"left":r>0&&this.highlightOrigin.y--;break;case"right":r<2&&this.highlightOrigin.y++;break;case"up-left":t>0&&r>0&&(this.highlightOrigin.x--,this.highlightOrigin.y--);break;case"up-right":t>0&&r<2&&(this.highlightOrigin.x--,this.highlightOrigin.y++);break;case"down-left":t<2&&r>0&&(this.highlightOrigin.x++,this.highlightOrigin.y--);break;case"down-right":t<2&&r<2&&(this.highlightOrigin.x++,this.highlightOrigin.y++);break}}movePiece(e,t,r,n){if(this.winner)return;this.boardState[e][t]===this.currentPlayer&&this.boardState[r][n]===null&&(this.boardState[e][t]=null,this.boardState[r][n]=this.currentPlayer,this.checkForWin(),this.winner||(this.currentPlayer=this.currentPlayer==="X"?"O":"X"))}checkForWin(){const{x:e,y:t}=this.highlightOrigin,r=[];for(let i=e;i<e+3;i++){let s=[];for(let h=t;h<t+3;h++)s.push(this.boardState[i][h]);r.push(s)}const n=this.checkSubGridForThree(r);n&&(this.winner=n)}checkSubGridForThree(e){for(let o=0;o<3;o++){const[l,d,m]=e[o];if(l&&l===d&&d===m)return l}for(let o=0;o<3;o++){const l=e[0][o],d=e[1][o],m=e[2][o];if(l&&l===d&&d===m)return l}const t=e[0][0],r=e[1][1],n=e[2][2];if(t&&t===r&&r===n)return t;const i=e[0][2],s=e[1][1],h=e[2][0];return i&&i===s&&s===h?i:null}resetGame(){this.boardState=this.createEmptyBoard(),this.pieceCount={X:0,O:0},this.currentPlayer="X",this.phase="placing",this.highlightOrigin={x:1,y:1},this.winner=null}doRandomActionInActionMode(){if(this.winner||this.currentPlayer!=="O")return;const e=[];switch(this.pieceCount.O<4&&e.push("placePiece"),e.push("moveGrid"),e.push("movePiece"),e[Math.floor(Math.random()*e.length)]){case"placePiece":this.tryPlaceAnotherPieceRandom();break;case"moveGrid":this.tryMoveGridRandom();break;case"movePiece":this.tryMovePieceRandom();break}}tryPlaceAnotherPieceRandom(){for(let e=0;e<5;e++)for(let t=0;t<5;t++)if(this.boardState[e][t]===null){this.boardState[e][t]="O",this.pieceCount.O++,this.checkForWin(),this.winner||(this.currentPlayer="X");return}}tryMoveGridRandom(){const e=["up","down","left","right","up-left","up-right","down-left","down-right"],t=e[Math.floor(Math.random()*e.length)];this.moveGrid(t),this.winner||(this.currentPlayer="X")}tryMovePieceRandom(){let e=[],t=[];for(let i=0;i<5;i++)for(let s=0;s<5;s++)this.boardState[i][s]==="O"?e.push([i,s]):this.boardState[i][s]===null&&t.push([i,s]);if(e.length===0||t.length===0)return;const r=e[Math.floor(Math.random()*e.length)],n=t[Math.floor(Math.random()*t.length)];this.boardState[r[0]][r[1]]=null,this.boardState[n[0]][n[1]]="O",this.checkForWin(),this.winner||(this.currentPlayer="X")}}function b(c,e,t){const r=document.createElement("div");r.classList.add("board");for(let n=0;n<5;n++)for(let i=0;i<5;i++){const s=document.createElement("div");s.classList.add("cell"),n>=e.x&&n<e.x+3&&i>=e.y&&i<e.y+3&&s.classList.add("highlight"),s.addEventListener("click",h=>{t(n,i,h)}),s.innerHTML=c[n][i]??"&nbsp;",r.appendChild(s)}return r}function u(c,e,t){const r=c.querySelectorAll(".cell");let n=0;for(let i=0;i<5;i++)for(let s=0;s<5;s++){const h=r[n],o=e[i][s];h.innerHTML=o??"&nbsp;",h.classList.remove("highlight"),i>=t.x&&i<t.x+3&&s>=t.y&&s<t.y+3&&h.classList.add("highlight"),n++}}class C{constructor(){a(this,"game");a(this,"boardElement");a(this,"subMode",null);a(this,"boardContainer");a(this,"gameContainer");a(this,"actionsContainer");a(this,"currentTurnText");a(this,"pieceCountText");a(this,"placePieceBtn");a(this,"moveGridBtn");a(this,"movePieceBtn");a(this,"gridArrowsContainer");a(this,"directions",[{dir:"up",label:"↑"},{dir:"down",label:"↓"},{dir:"left",label:"←"},{dir:"right",label:"→"},{dir:"up-left",label:"↖"},{dir:"up-right",label:"↗"},{dir:"down-left",label:"↙"},{dir:"down-right",label:"↘"}]);a(this,"selectedCell",null);a(this,"awaitingSecondClick",!1);this.boardContainer=document.createElement("div"),this.boardContainer.classList.add("board-container"),document.body.appendChild(this.boardContainer),this.gameContainer=document.createElement("div"),this.gameContainer.classList.add("game-container");const e=document.createElement("h1");e.innerHTML="TIC TAC TWO (TS)",this.gameContainer.appendChild(e);const t=document.createElement("div"),r=document.createElement("button");r.innerHTML="Human vs Human",r.addEventListener("click",()=>this.startGame("human"));const n=document.createElement("button");n.innerHTML="Human vs AI",n.addEventListener("click",()=>this.startGame("ai"));const i=document.createElement("button");i.innerHTML="Reset Game",i.addEventListener("click",()=>this.resetGame()),t.appendChild(r),t.appendChild(n),t.appendChild(i),this.gameContainer.appendChild(t);const s=document.createElement("div");s.classList.add("status-container"),this.currentTurnText=document.createElement("p"),this.pieceCountText=document.createElement("p"),s.appendChild(this.currentTurnText),s.appendChild(this.pieceCountText),this.gameContainer.appendChild(s),this.actionsContainer=document.createElement("div"),this.actionsContainer.style.display="none",this.gameContainer.appendChild(this.actionsContainer),this.placePieceBtn=document.createElement("button"),this.placePieceBtn.innerHTML="Place Another Piece",this.placePieceBtn.addEventListener("click",()=>this.activatePlacePieceMode()),this.moveGridBtn=document.createElement("button"),this.moveGridBtn.innerHTML="Move Grid",this.moveGridBtn.addEventListener("click",()=>this.activateMoveGridMode()),this.movePieceBtn=document.createElement("button"),this.movePieceBtn.innerHTML="Move a Piece",this.movePieceBtn.addEventListener("click",()=>this.activateMovePieceMode()),this.actionsContainer.appendChild(this.placePieceBtn),this.actionsContainer.appendChild(this.moveGridBtn),this.actionsContainer.appendChild(this.movePieceBtn),this.gridArrowsContainer=document.createElement("div"),this.gridArrowsContainer.style.display="none",this.actionsContainer.appendChild(this.gridArrowsContainer),this.directions.forEach(h=>{const o=document.createElement("button");o.innerHTML=h.label,o.addEventListener("click",()=>{this.game.moveGrid(h.dir),this.game.winner||(this.game.currentPlayer=this.game.currentPlayer==="X"?"O":"X"),this.subMode=null,this.updateActiveButtonStyles(),u(this.boardElement,this.game.board,this.game.highlightOrigin),this.checkActionMode(),this.updateStatus(),this.aiCheck()}),this.gridArrowsContainer.appendChild(o)}),document.body.insertBefore(this.gameContainer,this.boardContainer),this.startGame("human")}startGame(e){this.game=new f(e),this.boardContainer.innerHTML="",this.boardElement=b(this.game.board,this.game.highlightOrigin,(t,r)=>{this.cellUpdateFn(t,r)}),this.boardContainer.appendChild(this.boardElement),this.actionsContainer.style.display="none",this.subMode=null,this.updateActiveButtonStyles(),this.updateStatus()}cellUpdateFn(e,t){if(!this.game.winner){if(this.game.phase==="placing")this.game.makeAMove(e,t);else switch(this.subMode){case"placePiece":this.game.placeAnotherPiece(e,t),this.subMode=null;break;case"moveGrid":break;case"movePiece":this.handleMovePiece(e,t);break}u(this.boardElement,this.game.board,this.game.highlightOrigin),this.checkActionMode(),this.updateStatus(),this.updateActiveButtonStyles(),this.aiCheck()}}checkActionMode(){this.game.phase==="actionMode"&&(this.actionsContainer.style.display="block")}updateStatus(){if(this.game.winner){this.currentTurnText.textContent=`WINNER: ${this.game.winner} !!!`,this.pieceCountText.textContent="Game Over!";return}this.currentTurnText.textContent=`Current Turn: ${this.game.currentPlayer}`;const e=4-this.game.pieceCount.X,t=4-this.game.pieceCount.O;this.pieceCountText.textContent=`Remaining Pieces → X: ${e}, O: ${t}`}activatePlacePieceMode(){this.subMode="placePiece",this.updateActiveButtonStyles()}activateMoveGridMode(){this.subMode="moveGrid",this.updateActiveButtonStyles()}activateMovePieceMode(){this.subMode="movePiece",this.selectedCell=null,this.awaitingSecondClick=!1,this.updateActiveButtonStyles()}handleMovePiece(e,t){this.awaitingSecondClick?(this.selectedCell&&this.game.movePiece(this.selectedCell.x,this.selectedCell.y,e,t),this.awaitingSecondClick=!1,this.selectedCell=null,this.subMode=null):this.game.board[e][t]===this.game.currentPlayer&&(this.selectedCell={x:e,y:t},this.awaitingSecondClick=!0)}updateActiveButtonStyles(){this.placePieceBtn.classList.toggle("active",this.subMode==="placePiece"),this.moveGridBtn.classList.toggle("active",this.subMode==="moveGrid"),this.movePieceBtn.classList.toggle("active",this.subMode==="movePiece"),this.gridArrowsContainer.style.display=this.subMode==="moveGrid"?"block":"none"}resetGame(){this.game.resetGame(),u(this.boardElement,this.game.board,this.game.highlightOrigin),this.actionsContainer.style.display="none",this.subMode=null,this.updateActiveButtonStyles(),this.updateStatus()}aiCheck(){this.game.gameMode==="ai"&&this.game.currentPlayer==="O"&&!this.game.winner&&(this.game.phase==="placing"?this.game.makeAIMove():this.game.doRandomActionInActionMode(),u(this.boardElement,this.game.board,this.game.highlightOrigin),this.checkActionMode(),this.updateStatus())}}new C;
