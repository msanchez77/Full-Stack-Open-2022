import { useDispatch, useSelector } from "react-redux";

import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotificationVote } from "../reducers/notificationReducer";

const Anecdote = ({anecdote, handleClick}) => {
  return (
    <li>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </li>
  )
}

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const dispatch = useDispatch()

	// Action Creator to dispatch multiple actions
	const voteDispatch = (id) => {
		dispatch(voteAnecdote(id))
		dispatch(setNotificationVote(id))
	}

  return (
    <ul>
      {anecdotes.map(anecdote =>
        <Anecdote 
          key={anecdote.id}
          anecdote={anecdote} 
          handleClick={() => voteDispatch(anecdote.id)}
        />
      )}
    </ul>
  )
}

export default AnecdoteList