import { useDispatch } from 'react-redux'
import { createAnecodote } from '../reducers/anecdoteReducer'

const NewAnecdote = (props) => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
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

export default NewAnecdote