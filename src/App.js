import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import { Howl } from 'howler'
import { useEffect } from "react"

export default function App() {
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollCount, setRollCount] = React.useState(0)
    const [timer, setTimer] = React.useState(0)
    const [isActive, setIsActive] = React.useState(false)
    const [highScore, setHighScore] = React.useState(
        () => JSON.parse(localStorage.getItem("highScore")) || null
    )

    // // Sound Effects
    // const rollSound = new Howl({
    //     src: ['roll-sound.mp3']
    // })

    // const winSound = new Howl({
    //     src: ['win-sound.mp3']
    // })

    React.useEffect(() => {
        let interval
        if (isActive && !tenzies) {
            interval = setInterval(() => {
                setTimer(prevTime => prevTime + 1)
            }, 1000)
        } else if (tenzies) {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [isActive, tenzies])

    React.useEffect(() => {
        setIsActive(true)
    }, [])

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)

        if (allHeld && allSameValue) {
            setTenzies(true)
            // winSound.play()

            if (rollCount < highScore || highScore === null) {
                setHighScore(rollCount)
                localStorage.setItem("highScore", JSON.stringify(rollCount))
            }
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function rollDice() {
        if (!tenzies) {
            // rollSound.play()
            setRollCount(prevCount => prevCount + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? die : generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRollCount(0)
            setTimer(0)
        }
    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? { ...die, isHeld: !die.isHeld } : die
        }))
    }

    const diceElements = dice.map(die => (
        <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />
    ))

    return (
        <main className="main">
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <p>Time: {timer}s</p>
            <p>Rolls: {rollCount}</p>
            <p>Best Score: {highScore ? `${highScore} rolls` : "None yet"}</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button
                className="roll-dice"
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}
