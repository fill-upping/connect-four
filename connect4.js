class Grid {
    constructor(selector) {
        this.rows = 4;
        this.columns = 4;
        this.selector = selector;
        this.player = '';
        this.gameOver = false;
        this.createGrid();
    }

    createGrid() {
        const $board = $(this.selector);
        for (let row = 0; row < this.rows; row++) {
            const $row = $('<div>')
            .addClass('row');
            for (let col = 0; col < this.columns; col++) {
                const $col = $('<div>')
                    .addClass('col')
                    .attr('data-col', col)
                    .attr('data-row', row);
                $row.append($col);
            }
            $board.append($row);
        }
    }

    checkForWinner(row, col, player) {
        const that = this;
    
        function $getCell(i, j) {
          return $(`.col[data-row='${i}'][data-col='${j}']`);
        }
    
        function checkDirection(direction) {
          let total = 0;
          let i = parseInt(row) + parseInt(direction.i);
          let j = parseInt(col) + parseInt(direction.j);
          let $next = $getCell(i, j);
          while (i >= 0 &&
            i < that.rows &&
            j >= 0 &&
            j < that.columns &&
            $next.hasClass(player)
          ) {
            total++;
            i += direction.i;
            j += direction.j;
            $next = $getCell(i, j);
          }
          return total;
        }
    
        function checkWin(directionA, directionB) {
          const total = 1 +
            checkDirection(directionA) +
            checkDirection(directionB);
          if (total >= 4) {
            that.player = player
            that.gameOver = true;
            return true;
          } else {
            return null;
          }
        }
    
        function checkDiagonalBLtoTR() {
          return checkWin({i: 1, j: -1}, {i: 1, j: 1});
        }
    
        function checkDiagonalTLtoBR() {
          return checkWin({i: 1, j: 1}, {i: -1, j: -1});
        }
    
        function checkVerticals() {
          return checkWin({i: -1, j: 0}, {i: 1, j: 0});
        }
    
        function checkHorizontals() {
          return checkWin({i: 0, j: -1}, {i: 0, j: 1});
        }
    
        return checkVerticals() || 
          checkHorizontals() || 
          checkDiagonalBLtoTR() ||
          checkDiagonalTLtoBR();
      }
}