import React from "react"
import QuizQestion from "./QuizQuestion"

/**
 * Project planning:
 * 
 * Confetti
 * Better transition when play again button is clicked
 * Also, investigate why it seems to fail load data sometimes
 * Redeploy
 * Loading screen
 */

export default function Quizzical() {
    const [triviaData, setTriviaData] = React.useState({})
    const [isGameStarted, setIsGameStarted] = React.useState(false)
    const [isGameOver, setIsGameOver] = React.useState(false)
    const [selectedAnswers, setSelectedAnswers] = React.useState([])
    const [newGameTrigger, setNewGameTrigger] = React.useState(0);

    
    console.log("Rendered")
    
    const countOfCorrectAnswers = selectedAnswers
        .filter(x => triviaData.find(trivia => trivia.id === x.id && trivia.correct_answer === x.answer) != null).length
    const isReadyToCheck = selectedAnswers.length === triviaData.length
    console.log("COUNT OF CORRECT " + countOfCorrectAnswers)
    
    
   // console.log(triviaData)
    
    React.useEffect(() => {
        console.log("Loading trivia data")
        fetch("https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple")
            .then(result => result.json())
            .then(result => result.results.map((x, index) => ({
                ... x,
                id: index + 1,
                shuffledAnswers: [... x.incorrect_answers, x.correct_answer]
                    .sort(() => Math.random() - 0.5)
            })))
            .then(result => setTriviaData(result))
    }, [newGameTrigger])
    
    function checkAnswers() {
        if (!isReadyToCheck)
            return;
        setIsGameOver(true);
    }
    
    function addSelectedAnswer(newAnswer) {
        setSelectedAnswers(prevSelectedAnswers => {
            const newAnswers = [... prevSelectedAnswers.filter(x => x.id !== newAnswer.id)]
            newAnswers.push(newAnswer);
            return newAnswers;
        })    
    }
    
    function playAgain() {
        setIsGameOver(false)
        setSelectedAnswers([])
        setNewGameTrigger(prev => prev + 1)
    }
    
    return (
        <>
        <img src="/top-right.png" className="corner top-right" />
        <img src="/bottom-left.png" className="corner bottom-left" />

        <main>
            {!isGameStarted && 
            <section className="start-game-screen">
                <h2>Quizzical</h2>
                <p>Press the button to have a time of your life! 😂</p>
                <button onClick={ () => setIsGameStarted(true)}>Start quiz</button>
            </section>}
            {isGameStarted && 
            <section className="quiz">
                { triviaData.map(trivia =>
                    <QuizQestion 
                        key={trivia.id}
                        trivia={trivia}
                        addSelectedAnswer={addSelectedAnswer}
                        isGameOver={isGameOver}
                    />)
                } 
                {!isGameOver && <div className="check-answers-container">
                    <button className="check-answers-button" onClick={checkAnswers}>Check answers</button>
                </div>}
                {isGameOver && <div className="play-again-container">
                    <span>You scored {countOfCorrectAnswers}/{triviaData.length}</span>
                    <button className="play-again-button" onClick={playAgain}>Play again</button>
                </div>}
            </section>
            }
        </main>
        </>
    )
}
