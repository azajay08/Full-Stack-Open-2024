import { useState } from 'react'

const StatisticLine = (props) => {
	return (
		<tr>
			<td>{props.text}</td>
			<td>{props.value}</td>
		</tr>
	)
}

const Statistics = (props) => {
	const total = props.good + props.neutral + props.bad
	const average = (props.good - props.bad) / total
	const positive = (props.good / total) * 100
	if (total === 0) {
		return (
			<div>
				No Feedback given
			</div>
		)
	}
	return (
		<table>
			<tbody>
				<StatisticLine text='good' value={props.good} />
				<StatisticLine text='neutral' value={props.neutral} />
				<StatisticLine text='bad' value={props.bad} />
				<StatisticLine text='all' value={total} />
				<StatisticLine text='average' value={average} />
				<StatisticLine text='positive' value={`${positive} %`}/>
			</tbody>
		</table>
	)
}

const Button = (props) => {
	return (
		<button onClick={props.handleClick} >{props.text}</button>
	)
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
	setGood(good + 1)
  }

  const handleNeutralClick = () => {
	setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
	setBad(bad + 1)
  }


  return (
    <div>
		<h1>give feedback</h1>
		<Button handleClick={handleGoodClick} text='good'/>
		<Button handleClick={handleNeutralClick} text='neutral'/>
		<Button handleClick={handleBadClick} text='bad'/>
		<h1>statistics</h1>
		<Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App