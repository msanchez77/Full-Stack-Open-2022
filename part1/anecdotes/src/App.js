import { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const MostPopular = ({anecdotes, votes}) => {
  let current_votes = Object.values(votes);
  let max_votes = Math.max.apply(null, current_votes);
  let max_anecdote = current_votes.indexOf(max_votes);

  return <p>{anecdotes[max_anecdote]}</p>
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
   
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  });

  const getRandNumber = (end) => Math.floor(Math.random() * end);

  const setRandAnecdote = (range) => {
    const rand = getRandNumber(range);
    setSelected(rand);
  }

  const vote = () => {
    const copy = { ...votes };
    copy[selected] += 1;
    setVotes(copy);
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button handleClick={() => vote()} text={"vote"}/>
      <Button handleClick={() => setRandAnecdote(anecdotes.length)} text={"next anecdote"}/>

      <h1>Anecdote with most votes</h1>
      <MostPopular anecdotes={anecdotes} votes={votes}/>
    </div>
    
  )
}

export default App