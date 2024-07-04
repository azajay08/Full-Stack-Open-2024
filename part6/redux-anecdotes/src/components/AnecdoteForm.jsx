import { useDispatch } from 'react-redux'
import { createAnecodote } from '../reducers/anecdoteReducer'

const AnecdoteForm = (props) => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecodote(content))
  }

  return (
    <form onSubmit={addAnecdote}>
      <div>
        <input name="anecdote"/>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm