import { useState } from 'react'

const Button = (props) => {
	return (
		<button type={props.type} >{props.text}</button>
	)
}

const People = ({people}) => {
	const peopleList = people.map(props => <Person key={props.name} name={props.name} number={props.number}/>)
	return (
		<div>
			{peopleList}
		</div>
	)
}

const Person = (props) => {
	return (
		<div>{props.name} {props.number}</div>
	)
}

const App = () => {
	const [persons, setPersons] = useState([]) 
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')

	
	const addName = (event) => {
		event.preventDefault()
		const newPerson = {
			name: newName,
			// id: newName,
			number: newNumber,
		}

		const nameExists = persons.find(props => props.name.toLowerCase() === newPerson.name.toLowerCase())
		
		if (nameExists) {
			window.alert(`${newName} is already added to phonebook`)
		}
		else {
			setPersons(persons.concat(newPerson))
			setNewName('')
			setNewNumber('')
		}
	}
	
	const handleAdd = (event) => { setNewName(event.target.value) }

	const handleNumber = (event) => { setNewNumber(event.target.value)}

	return (
		<div>
		<h2>Phonebook</h2>
		<form onSubmit={addName}>
			<div>
				<div>name: <input id="nameInput" value={newName} onChange={handleAdd}/></div>
				<div>number: <input id='numberInput' value={newNumber} onChange={handleNumber}/></div>
			</div>
			<Button type="submit" text='add'/>
		</form>
		<h2>Numbers</h2>
		<People people={persons}/>
		</div>
	)
}

export default App