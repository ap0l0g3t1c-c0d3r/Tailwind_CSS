import { languages } from "./language.js";
import { useState } from "react";
import clsx from "clsx";
import { getFarewellText } from "./message.js";
import { randomWord } from "./message.js";

function App() {
  //State variables
  const [currentWord, setCurrentWord] = useState(() => randomWord())
  const [guessedLetters, setGuessedLetters] = useState([])  
  

  // derived states
  const wrongGuessCount = guessedLetters.filter((letter) => !currentWord.includes(letter)).length;
  const isGameWon = [...currentWord].every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastLetterIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  //static values
  const languageName = languages.map((lang, index) => {
    const isLanguageAlive = index < wrongGuessCount;
    const className = clsx("chip", isLanguageAlive && "lost")
  return(<span className={className} key={lang.name} 
    style={{backgroundColor:`${lang.backgroundColor}`, color: `${lang.color}`}}>{lang.name}</span>)})

  function addGuessedLetter(letter){
    // console.log(e.target.value)
     setGuessedLetters(prevGuessedLetters => 
      prevGuessedLetters.includes(letter) ? prevGuessedLetters : [...prevGuessedLetters, letter])
  }

    let letterElements = [...currentWord].map((letter,index) => {  
      const shouldRevealLetter = isGameOver || guessedLetters.includes(letter) 
      const missedLetterClassname = clsx(
        isGameLost && !guessedLetters.includes(letter) && "missed",
        guessedLetters.includes(letter) && currentWord.includes(letter) && "correct"
      ) 
      return(<span key={index} className={missedLetterClassname} >
                  { shouldRevealLetter ? letter.toUpperCase() : "" }
            </span>)})
    //or can use split method currentWord.split("")


  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const keyboard = [...alphabet].map((alpha) => { 
    const isGuessed = guessedLetters.includes(alpha);
    const isCorrect = isGuessed && currentWord.includes(alpha);
    const isWrong = isGuessed && !currentWord.includes(alpha);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })
    return(<button disabled={isGameOver} 
            onClick={()=> addGuessedLetter(alpha)} 
            key={alpha} aria-disabled={guessedLetters.includes(alpha)}
            aria-label={`Letter ${alpha}`}
            className={className}> {alpha.toUpperCase()}</button>) }) 

  const gameStatus = clsx("status", {
      won: isGameWon,
      lost: isGameLost,
      farewell: !isGameOver && isLastLetterIncorrect
  })

  function renderGameStatus(){
    if(!isGameOver && isLastLetterIncorrect){
        return (
          <p className="farewell">{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
        )    
    }
    if(isGameWon){
      return (
      <>
          <h2>You Win!</h2>
          <p>Well Done!</p>
        </> )

    }else if(isGameLost){
      return (
      <>
        <h2>You Lose!</h2>
        <p>Better Luck Next Time!</p>
      </>)
    }else{
      return null;
    }
  }

  function resetGame(){
    setCurrentWord(()=>randomWord())
    setGuessedLetters([]);
  }

  return (
    <>
      <main className='heading'>
        <header> 
          <h1>Assembly: Endgame</h1>
          <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly</p>
        </header>
        <section aria-live="polite" role="status" className={gameStatus}>
          { renderGameStatus() }
        </section>
        <section className="language-chips">
          {languageName}
        </section>
        <section className="word">
          {letterElements}
        </section>
        <section className="keyboard">
          {keyboard}
        </section>
        {isGameOver && <button className="newGameBtn" onClick={resetGame}> New Game </button>}
      </main>
    </>
  )
}

export default App
