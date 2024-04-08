import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {

  }

  const handleNeutralClick = () => {

  }

  const handleBadClick = () => {

  }


  return (
    <div>
		<h1>give feedback</h1>
		<button onClick={handleGoodClick}>good</button>
		<button onClick={handleNeutralClick}>neutral</button>
		<button onClick={handleBadClick}>bad</button>
    </div>
  )
}

export default App