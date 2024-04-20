const morgan = require('morgan')
const express = require('express')
const app = express()

const maxContacts = 1000 // Big enough range for phonebook length purpose

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
morgan.token('body', (request) => JSON.stringify(request.body))

app.get('/info', (request, response) => {
	const date = new Date()
	response.send(
		`<p>Phonebook has info for ${persons.length} persons</p>
		<p>${date}</p>`
	)
})

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)
	if (person) {
	  response.json(person)
	} else {
	  response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)
  
	response.status(204).end()
})

const generateId = () => {
	let newId
	do {
		newId = Math.floor(Math.random() * maxContacts) + 1 // could use Number.MAX_SAFE_INTEGER for bigger range
	} 
	while (persons.some(person => person.id === newId))
	return newId
}

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/persons', (request, response) => {
	const body = request.body
  
	if (!body.name || !body.number) {
		return response.status(400).json({ 
			error: 'name or number missing' 
		})
	}

	if (persons.length > maxContacts - 1) {
		return response.status(400).json({ 
			error: 'Phonebook is full' 
		})
	}

	if (persons.find(props => 
		props.name.toLowerCase() === body.name.toLowerCase())) {
		return response.status(400).json({ 
			error: 'name must be unique' 
		})
	}
  
	const newPerson = {
		name: body.name,
		number: body.number,
		id: generateId(),
	}
  
	persons = persons.concat(newPerson)
  
	response.json(newPerson)
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})