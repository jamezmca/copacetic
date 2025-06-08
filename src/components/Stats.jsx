import { calcLevel, calculateAccuracy, calculateNewWords } from '../utils'
import ProgressBar from './ProgressBar'

export default function Stats(props) {
    const { name, day, attempts, PLAN } = props
    // const name = 'James'

    const currLvl = calcLevel(day)
    const flooredLvl = Math.floor(currLvl)
    const remainder = (currLvl - flooredLvl) * 100

    return (
        <div className="card stats-card">
            <div className="welcome-text">
                <h6>Welcome</h6>
                <h4 className="text-large">
                    {name}
                </h4>
            </div>

            <div className="stats-column">
                <div>
                    <p>Streak 🔥 </p>
                    <h4>{day - 1}</h4>
                </div>
                <div>
                    <p>Words seen</p>
                    <h4>{calculateNewWords(day - 1)}</h4>
                </div>
                <div>
                    <p>Accuracy (%)</p>
                    <h4>{(calculateAccuracy(attempts, day) * 100).toFixed(1)}</h4>
                </div>
            </div>

            <ProgressBar text={`lvl ${flooredLvl}`} remainder={remainder} />

        </div>
    )
}