import { useState, useEffect  } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Button = ({type, text}) => <button type={type}> {text}</button>

const Persons = ({people}) => {
	const peopleList = people.map
	(props => <Person key={props.id} name={props.name} number={props.number}/>)
	return (
		<div>
			{peopleList}
		</div>
	)
}

const Person = ({name, number}) => <div>{name} {number}</div>

const Header = ({text}) => <h2>{text}</h2>

const SubHeader = ({text}) => <h3>{text}</h3>

const Filter = ({text, value, handleChange}) => {
	return (
		<div>
			{text} <input id="searchInput" value={value} onChange={handleChange}/>
		</div>
	)
}

const FormBox = ({text, inputName, value, handleChange}) => {
	return (
		<div>{text} <input id={inputName} value={value} onChange={handleChange}/></div>
	)
}

const PersonForm = ({onSubmit, newName, newNumber, handleNewName, handleNewNumber}) => {
	return (
		<form onSubmit={onSubmit}>
			<FormBox text='name:' inputName='nameInput'
			 value={newName} handleChange={handleNewName}/>
			<FormBox text='number:' inputName='numberInput'
			 value={newNumber} handleChange={handleNewNumber}/>
			<Button type="submit" text='add'/>
		</form>
	)
}

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filterName, setFilterName] = useState('')

	useEffect(() => {
		personService
		  .getAll()
		  .then(initialResponse => {
			setPersons(initialResponse)
		  })
	  }, [])

	const addContact = (event) => {
		event.preventDefault()
		const newPerson = {
			name: newName,
			number: newNumber,
			// id: persons.length + 1,
		}

		const nameExists = persons.find
		(props => props.name.toLowerCase() === newPerson.name.toLowerCase())
		
		if (nameExists) {
			window.alert(`${newName} is already added to phonebook`)
		}
		else {
			personService
			.create(newPerson)
			.then(returnedPerson => {
				setPersons(persons.concat(returnedPerson))
				setNewName('')
				setNewNumber('')
			})
		}
	}
	
	const filteredPersons = persons.map
	(person => person.name.toLowerCase().includes(filterName.toLowerCase())) ?
	persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase())) :
	persons

	const handleNewName = (event) => { setNewName(event.target.value) }

	const handleNewNumber = (event) => { setNewNumber(event.target.value)}

	const handleFilter = (event) => { setFilterName(event.target.value) }
	

	return (
		<div>
		<Header text='Phonebook'/>
		<Filter text='filter shown with' value ={filterName} handleChange={handleFilter} />
		<SubHeader text='Add a new'/>
		<PersonForm onSubmit={addContact}
			newName={newName} newNumber={newNumber}
			handleNewName={handleNewName} handleNewNumber={handleNewNumber}/>
		<Header text='Numbers'/>
		<Persons people={filteredPersons}/>
		</div>
	)
}

export default App