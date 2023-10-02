import React, { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [historySquare, setHistorySquare] = useState([-1]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const [isAsc, setIsAsc] = useState(true);
  const changeButtonDesc = isAsc ? 'ASC' : 'DESC';

  function handlePlay(idx, nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextCurrentMove = nextHistory.length - 1;
    const nextHistorySquare = [...historySquare.slice(0, currentMove + 1), idx];
    setHistory(nextHistory);
    setCurrentMove(nextCurrentMove);
    setHistorySquare(nextHistorySquare)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  function changeOrder() {
    setIsAsc(!isAsc);
  }

  const moves = history.map((squares, move) => {
    let desc;
    let line;
    let moveInfo;
    moveInfo = move + ' ' + (move ? '(' + Math.trunc(historySquare[move] / 3) + ', ' + (historySquare[move] % 3) + ')' : '');
    if (move === currentMove) {
      desc = 'You are at move #' + moveInfo;
      line = <div>{desc}</div>;
    } else {
      desc = move ? 'Go to move #' + moveInfo : 'Go to game start';
      line = <button onClick={() => jumpTo(move)}>{desc}</button>;
    }
    return (
      <li key={move}>
        {line}
      </li>
    )
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board currentMove={currentMove} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button onClick={changeOrder}>{changeButtonDesc}</button>
        <ol>{isAsc ? moves : moves.reverse()}</ol>
      </div>
    </div>
  )
}

function Board({ currentMove, xIsNext, squares, onPlay }) {
  const maxRow = 3;
  const maxCol = 3;

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(i, nextSquares);
  }

  const winner = calculateWinner(squares)
  let status;
  if (winner) {
    status = 'Winner: ' + winner.winner;
  } else if (currentMove === 9) {
    status = 'Draw';
  } else {
    status = 'NextPlayer: ' + (xIsNext ? 'X' : 'O');
  }

  function renderMatrix() {
    const rows = []
    for (let i = 0; i < maxRow; i++) {
      const row = [];
      for (let j = 0; j < maxCol; j++) {
        let idx = i * maxRow + j;
        let color = (winner && winner.winnerSquares.includes(idx)) ? 'yellow' : '#fff';
        row.push(
          <Square color={color} value={squares[idx]} onSquareClick={() => handleClick(idx)}/>
        )
      }
      rows.push(
        <div className="board-row">{row}</div>
      )
    }
    return rows;
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div>{renderMatrix()}</div>
    </div>
  );
}

function Square({ value, color, onSquareClick }) {
  return (
    <button style={{ background: color }} className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return {
        winner: squares[a],
        winnerSquares: lines[i]
      };
    }
  }
  return null;
}