import React, { useState } from "react";

function GuessNumber() {
  const generateNumber = () => Math.floor(Math.random() * 100) + 1;

  const [secretNumber, setSecretNumber] = useState(generateNumber());
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("Guess a number between 1 and 100");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const checkGuess = () => {
    const numberGuess = Number(guess);

    if (!numberGuess || numberGuess < 1 || numberGuess > 100) {
      setMessage("❌ Enter a number between 1 and 100");
      return;
    }

    setAttempts(attempts + 1);

    if (numberGuess === secretNumber) {
      setMessage("🎉 Correct! You guessed the number!");
      setGameOver(true);
    } 
    else if (numberGuess < secretNumber) {
      setMessage("📉 Too low!");
    } 
    else {
      setMessage("📈 Too high!");
    }

    setGuess("");
  };

  const resetGame = () => {
    setSecretNumber(generateNumber());
    setAttempts(0);
    setGuess("");
    setGameOver(false);
    setMessage("Game reset! Start guessing.");
  };

  return (
    <section className="game-section">
      <h2>Mini Game: Guess the Number 🎯</h2>

      <div className="game-box">

        <input
          type="number"
          value={guess}
          disabled={gameOver}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess"
        />

        <br />

        <button onClick={checkGuess} disabled={gameOver}>
          Guess
        </button>

        <p>{message}</p>

        <p>Attempts: {attempts}</p>

        <button onClick={resetGame}>
          Reset Game
        </button>

      </div>
    </section>
  );
}

export default GuessNumber;