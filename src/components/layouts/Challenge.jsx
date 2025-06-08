import { useState } from "react"
import ProgressBar from "../ProgressBar"
import { isEncountered, shuffle } from "../../utils"
import DEFINITIONS from '../../utils/VOCAB.json'

export default function Challenge(props) {
    const { day, daysWords, handleChangePage, handleIncrementAttempts, handleCompleteDay, PLAN } = props

    const [wordIndex, setWordIndex] = useState(0)
    const [inputVal, setInputVal] = useState('')
    const [showDefintion, setShowDefinition] = useState(false)
    const [listToLearn, setListToLearn] = useState([
        ...daysWords,
        ...shuffle(daysWords),
        ...shuffle(daysWords),
        ...shuffle(daysWords),
    ])

    const word = listToLearn[wordIndex]
    const isNewWord = showDefintion || (!isEncountered(day, word) && wordIndex < daysWords.length)
    const defintion = DEFINITIONS[word]

    function giveUp() {
        setListToLearn([...listToLearn, word])
        setShowDefinition(true)
    }

    return (
        <section id="challenge">
            <h1>{word}</h1>
            {isNewWord && (<p>{defintion}</p>)}
            <div className="helper">
                <div>
                    {/* CONTAINS ALL THE ERROR CORRECTIOB VISUAL BARS */}
                    {[...Array(defintion.length).keys()]
                        .map((char, elementIdx) => {
                            // determine whether or not the user has typed the character they think is correct, and show red or blue depending on whether or not it's acutally correct
                            const styleToApply = inputVal.length < char + 1 ?
                                '' :
                                inputVal.split('')[elementIdx].toLowerCase() == defintion.split('')[elementIdx].toLowerCase() ? 'correct' : 'incorrect'

                            return (
                                <div className={' ' + styleToApply} key={elementIdx}></div>
                            )
                        })}
                </div>
                <input value={inputVal} onChange={(e) => {
                    // if a user has entered the correct number of characters, we need to do a few things
                    // 1. if the entry is correct, we needd to increment attempts and move them on to the next word
                    // 2. if the entry is incorrect we need to increment attempts, and also if they
                    if (e.target.value.length == defintion.length && e.target.value.length > inputVal.length) {
                        // compare words
                        handleIncrementAttempts()

                        if (e.target.value.toLowerCase() == defintion.toLowerCase()) {
                            // then the user has the correct input
                            if (wordIndex >= listToLearn.length - 1) {
                                handleCompleteDay()
                                return
                            }
                            setWordIndex(wordIndex + 1)
                            setShowDefinition(false)
                            setInputVal('')
                            return
                            // check if finished all the words, then end the day, otherwise go to next word
                        }

                    }

                    setInputVal(e.target.value)
                }} type="text" placeholder="Enter the defintion..." />
            </div>

            <div className="challenge-btns">
                <button onClick={() => {
                    handleChangePage(1)
                }} className="card-button-secondary">
                    <h6>Quit</h6>
                </button>
                <button onClick={giveUp} className="card-button-primary">
                    <h6>I forgot</h6>
                </button>
            </div>
            <ProgressBar remainder={wordIndex * 100 / listToLearn.length} text={`${wordIndex} / ${listToLearn.length}`} />
        </section>
    )
}