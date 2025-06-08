import Layout from "./components/layouts/Layout"
import Welcome from "./components/layouts/Welcome"
import Dashboard from './components/layouts/Dashboard'
import Challenge from './components/layouts/Challenge'
import { useState, useEffect } from "react"

import WORDS from './utils/VOCAB.json'

import { countdownIn24Hours, getWordByIndex, PLAN } from './utils'

function App() {
  const [selectedPage, setSelectedPage] = useState(0)
  // const selectedPage = 2 // zero is for welcome, 1 is for dashboard, 2 is for challenge
  const [name, setName] = useState('')
  const [day, setDay] = useState(1)
  const [datetime, setDatetime] = useState(null)
  const [history, setHistory] = useState({})
  const [attempts, setAttempts] = useState(0)


  const daysWords = PLAN[day].map((idx) => {
    return getWordByIndex(WORDS, idx).word
  })

  console.log(daysWords)

  function handleChangePage(pageIndex) {
    setSelectedPage(pageIndex)
  }

  function handleCreateAccount() {
    if (!name) { return }
    localStorage.setItem('username', name)
    handleChangePage(1)
  }

  function handleCompleteDay() {
    const newDay = day + 1
    const newDatetime = Date.now()
    setDay(newDay)
    setDatetime(newDatetime)

    localStorage.setItem('day', JSON.stringify({
      day: newDay,
      datetime: newDatetime
    }))
    setSelectedPage(1)
  }

  function handleIncrementAttempts() {
    // take the current attempt number, and add one and save it to local storage
    const newRecord = attempts + 1
    localStorage.setItem('attempts', newRecord)
    setAttempts(newRecord)
  }

  useEffect(() => {
    // this callback function is triggered on page load
    if (!localStorage) { return } // if we don't yet have access to the database, then exit the callback function

    if (localStorage.getItem('username')) {
      // if we find the item (so get item returns something), then we enter the if block
      setName(localStorage.getItem('username'))

      // we have a name, so we can skip to the dashboard
      setSelectedPage(1)
    }

    if (localStorage.getItem('attempts')) {
      // then wefound attempts
      setAttempts(parseInt(localStorage.getItem('attempts')))
    }

    if (localStorage.getItem('history')) {
      setHistory(JSON.parse(localStorage.getItem('history')))
    }

    if (localStorage.getItem('day')) {
      const { day: d, datetime: dt } = JSON.parse(localStorage.getItem('day'))
      setDatetime(dt)
      setDay(d)

      if (d > 1 && dt) {
        const diff = countdownIn24Hours(dt)
        if (diff < 0) {
          console.log('Failed challenge')
          let newHistory = { ...history }
          const timestamp = new Date(dt)
          const formattedTimestamp = timestamp.toString().split(' ').slice(1, 4).join(' ')
          newHistory[formattedTimestamp] = d
          setHistory(newHistory)
          setDay(1)
          setDatetime(null)
          setAttempts(0)

          localStorage.setItem('attempts', 0)
          localStorage.setItem('history', JSON.stringify(newHistory))
          localStorage.setItem('day', JSON.stringify({ day: 1, datetime: null }))
        }
      }
    }


  }, [])

  const pages = {
    0: <Welcome handleCreateAccount={handleCreateAccount} username="hello world" name={name} setName={setName} />,
    1: <Dashboard history={history} name={name} attempts={attempts} PLAN={PLAN} day={day} handleChangePage={handleChangePage} daysWords={daysWords} datetime={datetime} />,
    2: <Challenge day={day} daysWords={daysWords} handleChangePage={handleChangePage} handleIncrementAttempts={handleIncrementAttempts} handleCompleteDay={handleCompleteDay} PLAN={PLAN} />
  }

  return (
    <Layout>
      {pages[selectedPage]}
    </Layout>
  )
}

export default App
