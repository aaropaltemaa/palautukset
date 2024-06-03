require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

let persons = [

]

app.use((req, res, next) => {
    if (req.method === 'POST') {
        console.log(req.body)
    }
    next()
})

app.get('/', (req, res) => {
    res.status(204).send()
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    Person.findOne({ name: body.name }).then(existingPerson => {
        if (existingPerson) {
            return res.status(400).json({ error: 'name must be unique' })
        } else {
            const person = new Person({
                name: body.name,
                number: body.number,
            })

            person.save().then(savedPerson => {
                res.json(savedPerson)
            })
        }
    })
})

app.get('/info', (req, res) => {
    Person.countDocuments({}).then(count => {
        const time = new Date()
        res.send(`<p>Phonebook has info for ${count} people</p><p>${time}</p>`)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = Number(req.params.id)
        persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
