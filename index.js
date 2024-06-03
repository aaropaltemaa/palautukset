require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))


app.use(express.static('dist'))

const cors = require('cors')

app.use(cors())

app.use((req, res, next) => {
    if (req.method === 'POST') {
        console.log(req.body)
    }
    next()
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message })
    } else if (error.code && error.code === 11000) {  
        return res.status(400).send({ error: 'duplicate key error' })
    } else if (error.name === 'DocumentNotFoundError') {
        return res.status(404).send({ error: 'document not found' })
    } else if (error.name === 'VersionError') {
        return res.status(409).send({ error: 'version conflict error' })
    } else if (error.name === 'OverwriteModelError') {
        return res.status(500).send({ error: 'model overwrite error' })
    } else if (error.name === 'MongooseServerSelectionError') {
        return res.status(500).send({ error: 'cannot connect to database' })
    }

    next(error)
  }

app.get('/', (req, res) => {
    res.status(204).send()
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    }).catch(error => next(error))
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
            .catch(error => next(error))
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
    Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


