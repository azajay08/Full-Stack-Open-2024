import { useSelector, useDispatch } from 'react-redux'
import { addLikes } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    if (filter === '') {
      return anecdotes
    }

    return anecdotes.filter((anecdote) => {
      return anecdote.content.toLowerCase().includes(filter.toLowerCase())
    })
  })

  const vote = (id) => {
    console.log('vote', id)
    dispatch(addLikes(id))
  }

  return (
    [...anecdotes]
      .sort((a, b) => b.votes - a.votes)
      .map((anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))
  )
}

export default AnecdoteList