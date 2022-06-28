import { useDispatch, useSelector } from "react-redux";

import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotificationVote, clearNotification } from "../reducers/notificationReducer";

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
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    const unFiltered = state.anecdotes
    const filteredList = unFiltered.filter(a => {
      const cased = a.content.toLowerCase()
      return cased.includes(state.filter)
    })

    return filteredList
  })


	// Action Creator to dispatch multiple actions
	const voteDispatch = ({id, content}) => {
		dispatch(voteAnecdote(id))
		dispatch(setNotificationVote(content))
    setTimeout(() => 
      dispatch(clearNotification())
    , 5000)
	}

  return (
    <ul>
      {anecdotes.map(anecdote =>
        <Anecdote 
          key={anecdote.id}
          anecdote={anecdote} 
          handleClick={() => voteDispatch(anecdote)}
        />
      )}
    </ul>
  )
}

export default AnecdoteList