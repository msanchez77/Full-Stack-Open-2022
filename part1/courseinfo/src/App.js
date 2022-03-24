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

const Statistics = ({type, count}) => {
  if (isNaN(count) || count === 0) {
    return <p>No feedback given</p>
  }

  let final = count;

  if (type === "average" || type === "positive") {
    final = roundNum(type, count);
  }

  return <p>{type} {final}</p>;
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

  const getTotal = () => good + neutral + bad
  const getAverage = () => (( (good*1) + (bad*-1) ) / getTotal())
  const getPositive = () => (good / getTotal()) * 100

  return (
    <div>
      <Header text="give feedback"></Header>
			<Button handleClick={() => increaseByOne("good")} text={"good"}></Button>
      <Button handleClick={() => increaseByOne("neutral")} text={"neutral"}></Button>
      <Button handleClick={() => increaseByOne("bad")} text={"bad"}></Button>
			<Header text="statistics"></Header>
      <Statistics type="good" count={good}></Statistics>
      <Statistics type="neutral" count={neutral}></Statistics>
      <Statistics type="bad" count={bad}></Statistics>
      <Statistics type="all" count={getTotal()}></Statistics>
      <Statistics type="average" count={getAverage()}></Statistics>
      <Statistics type="positive" count={getPositive()}></Statistics>
    </div>
  )
}

export default App