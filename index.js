const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { generateId } = require('./utils')
const app = express()

let persons = [
    {
        id: 1,
        name: "Alice Johnson",
        number: "+1-555-123-4567"
    },
    {
        id: 2,
        name: "Bob Smith",
        number: "+1-555-987-6543"
    },
    {
        id: 3,
        name: "Charlie Brown",
        number: "+1-555-678-1234"
    },
    {
        id: 4,
        name: "Diana Prince",
        number: "+1-555-876-5432"
    }
]

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

app.use(function(req, res, next) {
    if (req.method === 'POST') {
        console.log(req.body)
    }
    next()
})


app.get('/', (req, res) => {
    console.log('moro')
    res.status(204).send()
  })


app.post('/api/persons', (req, res) => {
    const body = req.body
    const existingPerson = persons.find((person) => person.name === body.name)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if (existingPerson) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(persons),
        name: body.name,
        number: body.number
    }

    console.log(body)
    persons = persons.concat(person)
    res.json(person)
    
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const time = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
              <p>${time}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
