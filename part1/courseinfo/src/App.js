import { useState } from 'react'

const Header = ({text}) => {
	return <h1>{text}</h1>
}

const Button = (props) => (
	<button onClick={props.handleClick}>
		{props.text}
	</button>
)

const Statistics = ({type, count}) => (
	<p>{type} {count}</p>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

	const increaseByOne = (newVal) => setGood(newVal)

  return (
    <div>
      <Header text="give feedback"></Header>
			<Button handleClick={() => increaseByOne(1000)} text={"good"}></Button>
			<Statistics type="good" count={good}></Statistics>
    </div>
  )
}

export default App