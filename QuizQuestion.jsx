import he from "he"
import React from "react"
import { clsx } from "clsx"

export default function QuizQestion({trivia, addSelectedAnswer, isGameOver}) {
    const [selected, setSelected] = React.useState(null)
    
    const buttons = trivia.shuffledAnswers.map((answer, index) => {
        
        return (
            <button 
                className={clsx(
                    selected === answer && "selected",
                    isGameOver && (answer === trivia.correct_answer ? "correct" : "incorrect")
                )}

                key={index + he.decode(answer)}
                onClick={() => {
                        if (isGameOver)
                            return;
                        addSelectedAnswer({ 
                            id: trivia.id,
                            answer: answer
                        })
                        setSelected(answer)
                    }}
            >{he.decode(answer)}</button>
        )
    })

    return (
        <>
            <h2>{he.decode(trivia.question)}</h2>
            <div className="botton-row">
                {buttons}
            </div>
            <div className="line" />
        </>
    )
}