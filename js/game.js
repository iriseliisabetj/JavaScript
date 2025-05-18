export class GameBrain {
    #board = Array(5).fill(null).map(() => Array(5).fill(null));
    pieceCount = { X: 0, O: 0 };
    currentPlayer = "X";
    gameMode = "human";
    phase = "placing";
    highlightOrigin = { x: 1, y: 1 };
    winner = null;
    afterAIMove = null;

    constructor(mode = "human") {
        this.gameMode = mode;
    }

    makeAMove(x, y) {
        if (this.winner) return;
        if (this.#board[x][y] === null && this.pieceCount[this.currentPlayer] < 4) {
            this.#board[x][y] = this.currentPlayer;
            this.pieceCount[this.currentPlayer]++;
            this.checkPhaseTransition();
            this.checkForWin();
            if (!this.winner) this.switchPlayerAndMaybeAI();
        }
    }

    placeAnotherPiece(x, y) {
        if (this.winner) return;
        if (this.phase === "actionMode" && this.pieceCount[this.currentPlayer] < 4) {
            if (this.#board[x][y] === null) {
                this.#board[x][y] = this.currentPlayer;
                this.pieceCount[this.currentPlayer]++;
                this.checkForWin();
                if (!this.winner) this.switchPlayerAndMaybeAI();
            }
        }
    }

    movePiece(fromX, fromY, toX, toY) {
        if (this.winner) return;
        if (this.#board[fromX][fromY] === this.currentPlayer && this.#board[toX][toY] === null) {
            this.#board[fromX][fromY] = null;
            this.#board[toX][toY] = this.currentPlayer;
            this.checkForWin();
            if (!this.winner) this.switchPlayerAndMaybeAI();
        }
    }

    moveGrid(direction) {
        if (this.winner) return;
        let { x, y } = this.highlightOrigin;
        switch (direction) {
            case "up": if (x > 0) this.highlightOrigin.x--; break;
            case "down": if (x < 2) this.highlightOrigin.x++; break;
            case "left": if (y > 0) this.highlightOrigin.y--; break;
            case "right": if (y < 2) this.highlightOrigin.y++; break;
            case "up-left": if (x > 0 && y > 0){this.highlightOrigin.x--;this.highlightOrigin.y--;} break;
            case "up-right": if (x > 0 && y < 2){this.highlightOrigin.x--;this.highlightOrigin.y++;} break;
            case "down-left": if (x < 2 && y > 0){this.highlightOrigin.x++;this.highlightOrigin.y--;} break;
            case "down-right": if (x < 2 && y < 2){this.highlightOrigin.x++;this.highlightOrigin.y++;} break;
        }
        this.checkForWin();
        if (!this.winner) this.switchPlayerAndMaybeAI();
    }

    switchPlayerAndMaybeAI() {
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
        if (this.gameMode === "ai" && this.currentPlayer === "O" && !this.winner) {
            setTimeout(() => {
            this.makeAIMove();
            this.afterAIMove?.();
        }, 2000);
        }
    }

    makeAIMove() {
        if (this.winner) return;
        const enemy = "X", me = "O";
        const canPlace = this.pieceCount["O"] < 4;

        if (this.phase === "placing" && canPlace) {
            const target =
              this.findWinningMove(me) ||
              this.findWinningMove(enemy) ||
              this.randomEmpty();
            if (target) return this.applyAIMove(target);
        }

        const win = this.findWinningMove(me);
        if (win && canPlace) return this.applyAIMove(win);

        const block = this.findWinningMove(enemy);
        if (block && canPlace) return this.applyAIMove(block);

        if (this.phase === "actionMode") {
            if (this.moveAIPiece()) return;
            if (this.shiftGridForAdvantage()) return;
        }

        if (canPlace) {
            const rand = this.randomEmpty();
            if (rand) this.applyAIMove(rand);
        }
    }

    randomEmpty() {
        const out=[];
        for(let i=0; i<5; i++) for(let j=0; j<5; j++)
            if(this.#board[i][j] === null) out.push({x:i,y:j});
        return out.length?out[Math.floor(Math.random()*out.length)]:null;
    }

    applyAIMove({ x, y }) {
        if (this.pieceCount["O"] >= 4) return;

        this.#board[x][y] = "O";
        if (this.pieceCount["O"] < 4) {
            this.pieceCount["O"]++;
        }
        this.checkPhaseTransition();
        this.checkForWin();
        this.currentPlayer = "X";
        this.afterAIMove?.();
    }

    findWinningMove(player) {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.#board[i][j] === null) {
                    this.#board[i][j] = player;
                    this.checkForWin();
                    if (this.winner === player) {
                        this.#board[i][j] = null;
                        this.winner = null;
                        return { x: i, y: j };
                    }
                    this.#board[i][j] = null;
                }
            }
        }
        return null;
    }

    moveAIPiece() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.#board[i][j] === "O") {
                    const shifts = [
                        { x:i-1,y:j },{ x:i+1,y:j },{ x:i,y:j-1 },{ x:i,y:j+1 },
                        { x:i-1,y:j-1 },{ x:i-1,y:j+1 },{ x:i+1,y:j-1 },{ x:i+1,y:j+1 }
                    ];
                    for (let m of shifts) {
                        if (m.x >= 0 && m.x < 5 && m.y >= 0 && m.y < 5 && this.#board[m.x][m.y] === null) {
                            this.#board[i][j] = null;
                            this.#board[m.x][m.y] = "O";
                            this.checkForWin();
                            this.currentPlayer = "X";
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    shiftGridForAdvantage() {
        const dirs = ["up","down","left","right","up-left","up-right","down-left","down-right"];
        for (let d of dirs) {
            const prev = { ...this.highlightOrigin }, prevWinner = this.winner;
            this.moveGrid(d);
            if (this.winner === "O") {
                this.currentPlayer = "X";
                return true;
            }
            this.highlightOrigin = prev;
            this.winner = prevWinner;
        }
        return false;
    }

    checkPhaseTransition() {
        if (this.phase === "placing" && this.pieceCount["X"] >= 2 && this.pieceCount["O"] >= 2) {
            this.phase = "actionMode";
        }
    }

    checkForWin() {
        const { x: ox, y: oy } = this.highlightOrigin;
        if (ox+3>5 || oy+3>5) return;
        const sub = [];
        for (let i = ox; i < ox+3; i++) {
            const row = [];
            for (let j = oy; j < oy+3; j++) row.push(this.#board[i][j]);
            sub.push(row);
        }
        this.winner = this.checkSubGridForThree(sub) || this.winner;
    }

    checkSubGridForThree(s) {
        for (let r=0; r<3; r++){
            const [a,b,c] = s[r];
            if(a && a === b && b === c) return a;
        }
        for (let c=0; c<3; c++){
            const a = s[0][c], b = s[1][c], d = s[2][c];
            if(a && a === b && b === d) return a;
        }
        if(s[0][0] && s[0][0] === s[1][1] && s[1][1] === s[2][2]) return s[0][0];
        if(s[0][2] && s[0][2] === s[1][1] && s[1][1] === s[2][0]) return s[0][2];
        return null;
    }

    get board() {
        return this.#board;
    }

    resetGame() {
        this.#board = Array(5).fill(null).map(() => Array(5).fill(null));
        this.pieceCount = { X:0, O:0 };
        this.currentPlayer = "X";
        this.phase = "placing";
        this.highlightOrigin = { x:1, y:1 };
        this.winner = null;
    }
}
