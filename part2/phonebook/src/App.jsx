import { useState, useEffect } from 'react'
import personServices from './services/persons'

const Header = ({text}) => <h2>{text}</h2>

const SubHeader = ({text}) => <h3>{text}</h3>

const Persons = ({people}) => <div>{people}</div>

const Button = ({type, text, handleChange}) => {
	return(
		<button type={type} onClick={handleChange}> {text}</button>
	)
}

const Filter = ({text, value, handleChange}) => {
	return (
		<div>
			{text} <input id="searchInput" value={value} onChange={handleChange}/>
		</div>
	)
}

const FormBox = ({text, inputName, value, handleChange}) => {
	return (
		<div>
			{text} <input id={inputName} value={value} onChange={handleChange}/>
		</div>
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
		personServices
		  .getAll()
		  .then(initialResponse => {
			setPersons(initialResponse)
		  })
	  }, [])

	const addContact = (event) => {
		event.preventDefault()
		const newPerson = {
			name: newName,
			number: newNumber
		}

		const existingContact = persons.find
		(props => props.name.toLowerCase() === newPerson.name.toLowerCase())
		
		const changedContact = { ...existingContact, number: newNumber }


		if (existingContact && existingContact.number === newPerson.number) {
			window.alert(`${newName} is already added to phonebook`)
		}
		else if (existingContact && existingContact.number !== newPerson.number) {
			if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
				personServices
				.update(existingContact.id, changedContact)
				.then(returnedPerson => {
					setPersons(persons.map(n => n.id !== existingContact.id? n : returnedPerson))
					setNewName('')
					setNewNumber('')
				})
			}
		}
		else {
			personServices
			.create(newPerson)
			.then(returnedPerson => {
				setPersons(persons.concat(returnedPerson))
				setNewName('')
				setNewNumber('')
			})
		}
	}

	const deletePerson = (id) => {
		const contact = persons.find(n => n.id === id)
		if(window.confirm(`Delete ${contact.name} ?`))
		{
			personServices
			.getDeletedPerson(id)
			setPersons(persons.filter(contact => contact.id !== id))
		}
	}
	
	const handleNewName = (event) => { setNewName(event.target.value) }
	
	const handleNewNumber = (event) => { setNewNumber(event.target.value)}
	
	const handleFilter = (event) => { setFilterName(event.target.value) }
	
	
	const Person = ({name, number, id}) => {
		return (
			<div>
				{name} {number}
				<Button type="submit" text='delete'
				handleChange={() => deletePerson(id)} />
			</div>
		)
	}

	const filteredPersons = persons.map
		(person => person.name.toLowerCase().includes(filterName.toLowerCase())) ?
		persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase())) :
		persons

	const people = filteredPersons.map(props =>
		<Person key={props.id} name={props.name} number={props.number} id={props.id}/>)


	return (
		<div>
		<Header text='Phonebook'/>
		<Filter text='filter shown with' value ={filterName} handleChange={handleFilter} />
		<SubHeader text='Add a new'/>
		<PersonForm onSubmit={addContact}
			newName={newName} newNumber={newNumber}
			handleNewName={handleNewName} handleNewNumber={handleNewNumber}/>
		<Header text='Numbers'/>
		<Persons people={people}/>
		</div>
	)
}

export default App