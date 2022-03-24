import { useState } from 'react'

const Header = ({text}) => (
	<h1>{text}</h1>
)

const Button = (props) => (
	<button onClick={props.handleClick}>
		{props.text}
	</button>
)

const roundNum = (type, num) => {
  let rounded = num.toFixed(2);
  if (type === "positive") {
    rounded += '%';
  }
  return rounded;
}

const StatisticLine = ({text, value}) => {

  if (text === "average" || text === "positive") {
    value = roundNum(text, value);
  }

  return (
    <tr>
      <td>{text}</td> <td>{value}</td>
    </tr>
  )

}

const Statistics = ({stats}) => {
  if (stats["all"] === 0) {
    return <p>No feedback given</p>
  } else {

    const {good, neutral, bad, all, average, positive} = stats

    return(
      <table>
        <StatisticLine text="good" value ={good} />
        <StatisticLine text="neutral" value ={neutral} />
        <StatisticLine text="bad" value ={bad} />
        <StatisticLine text="all" value ={all} />
        <StatisticLine text="average" value ={average} />
        <StatisticLine text="positive" value ={positive} />
      </table>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

	const increaseByOne = (type) => {
    if (type === "good") {
      setGood(good + 1)
    } else if (type === "neutral") {
      setNeutral(neutral + 1)
    } else {
      setBad(bad + 1)
    }
  }

  const getAll = () => good + neutral + bad
  const getAverage = () => (( (good*1) + (bad*-1) ) / getAll())
  const getPositive = () => (good / getAll()) * 100

  const stats = {
    good: good,
    neutral: neutral,
    bad: bad,
    all: getAll(),
    average: getAverage(),
    positive: getPositive()
  }

  return (
    <div>
      <Header text="give feedback"></Header>
			<Button handleClick={() => increaseByOne("good")} text={"good"}></Button>
      <Button handleClick={() => increaseByOne("neutral")} text={"neutral"}></Button>
      <Button handleClick={() => increaseByOne("bad")} text={"bad"}></Button>
			<Header text="statistics"></Header>
      <Statistics stats={stats}></Statistics>
    </div>
  )
}

export default App