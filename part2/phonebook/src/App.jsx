import { useState } from 'react'

const Button = ({type, text}) => {
	return (
		<button type={type} >{text}</button>
	)
}

const Persons = ({people}) => {
	const peopleList = people.map(props => <Person key={props.id} name={props.name} number={props.number}/>)
	return (
		<div>
			{peopleList}
		</div>
	)
}

const Person = ({name, number}) => {
	return (
		<div>{name} {number}</div>
	)
}

const Header = ({text}) => <h2>{text}</h2>

const Filter = ({text, value, handleChange}) => {
	return (
		<div>
			{text} <input id="searchInput" value={value} onChange={handleChange}/>
		</div>
	)
}

const PersonForm = (props) => {
	return (
		<form onSubmit={props.onSubmit}>
			<div>{props.name} <input id="nameInput" value={props.newName} onChange={props.handleNewName}/></div>
			<div>{props.number} <input id="numberInput" value={props.newNumber} onChange={props.handleNewNumber}/></div>
			<Button type="submit" text='add'/>
		</form>
	)
}

const App = () => {
	const [persons, setPersons] = useState([
		{ name: 'Arto Hellas', number: '040-123456', id: 1 },
		{ name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
		{ name: 'Dan Abramov', number: '12-43-234345', id: 3 },
		{ name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
	  ])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filterName, setFilterName] = useState('')

	
	const addContact = (event) => {
		event.preventDefault()
		const newPerson = {
			name: newName,
			number: newNumber,
			id: persons.length + 1,
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
	
	const filteredPersons = persons.map(person => person.name.toLowerCase().includes(filterName.toLowerCase())) ?
	persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase())) :
	persons

	const handleNewName = (event) => { setNewName(event.target.value) }

	const handleNewNumber = (event) => { setNewNumber(event.target.value)}

	const handleFilter = (event) => { setFilterName(event.target.value) }

	return (
		<div>
		<Header text='Phonebook'/>
		<Filter text='filter shown with' value ={filterName} handleChange={handleFilter} />
		<Header text='Add a new'/>
		<PersonForm onSubmit={addContact}
			name={'name:'}
			number={'number:'}
			newName={newName}
			newNumber={newNumber}
			handleNewName={handleNewName}
			handleNewNumber={handleNewNumber}/>
		<Header text='Numbers'/>
		<Persons people={filteredPersons}/>
		</div>
	)
}

export default App