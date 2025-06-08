import Stats from '../Stats'
import Countdown from '../Countdown'
import History from '../History'

export default function Dashboard(props) {
    return (
        <section id="dashboard">
            <Stats {...props} />
            <Countdown {...props} />
            <History {...props} />
        </section>
    )
}