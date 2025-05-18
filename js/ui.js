export function getInitialBoard(boardState, highlightOrigin, cellUpdateFn) {
  const boardElement = document.createElement("div");
  boardElement.classList.add("board");

  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (
        x >= highlightOrigin.x &&
        x < highlightOrigin.x + 3 &&
        y >= highlightOrigin.y &&
        y < highlightOrigin.y + 3
      ) {
        cell.classList.add("highlight");
      }

      cell.addEventListener("click", (event) => {
        cellUpdateFn(x, y, event);
      });

      cell.innerHTML = boardState[x][y] || "&nbsp;";
      boardElement.appendChild(cell);
    }
  }

  return boardElement;
}

export function updateBoard(boardElement, boardState, highlightOrigin) {
  const cells = boardElement.querySelectorAll(".cell");
  let i = 0;
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      cells[i].innerHTML = boardState[x][y] || "&nbsp;";
      cells[i].classList.toggle(
        "highlight",
        x >= highlightOrigin.x &&
          x < highlightOrigin.x + 3 &&
          y >= highlightOrigin.y &&
          y < highlightOrigin.y + 3
      );
      i++;
    }
  }
}
