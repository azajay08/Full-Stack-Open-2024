import { useState } from 'react'

const Button = (props) => {
	return (
		<button type={props.type} >{props.text}</button>
	)
}

const People = ({people}) => {
	const peopleList = people.map(props => <Person key={props.name} name={props.name}/>)
	return (
		<div>
			{peopleList}
		</div>
	)
}

const Person = (props) => {
	return (
		<div>{props.name}</div>
	)
}

const App = () => {
	const [persons, setPersons] = useState([
		{ name: 'Arto Hellas' }
	  ]) 
	const [newName, setNewName] = useState('')

	
	const addName = (event) => {
		event.preventDefault()
		const newPerson = {
			name: newName,
			id: newName,
			// number: newNumber,
		}
		setPersons(persons.concat(newPerson))
		setNewName('')
	}
	
	const handleAdd = (event) => { setNewName(event.target.value) }

	return (
		<div>
		<h2>Phonebook</h2>
		<form onSubmit={addName}>
			<div>
				name: <input id="nameInput" value={newName}
				onChange={handleAdd} />
			</div>
			<Button type="submit" text='add'/>
		</form>
		<h2>Numbers</h2>
		<People people={persons}/>
		</div>
	)
}

export default App