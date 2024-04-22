require('dotenv').config()

const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

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
	Person.find({}).then(person => {
		response.json(person)
	})
})


app.get('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id).then(person => {
		if (person) {
			response.json(person)
		}
		else {
			response.status(404).end()
		}
	})
})


app.delete('/api/persons/:id', (request, response) => {
	Person.findByIdAndDelete(request.params.id).then(() => {
		response.status(204).end()
	})
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/persons', (request, response) => {
	const body = request.body
  
	if (!body.name || !body.number) {
		return response.status(400).json({ 
			error: 'name or number missing' 
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	})
  
	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)


const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})