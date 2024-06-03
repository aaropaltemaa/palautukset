const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://apaltemaa:${password}@personcluster.ygllpta.mongodb.net/personApp`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(results => {
        console.log('Phonebook:')
        results.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    }).catch(error => {
        console.error('Error saving person:', error)
        mongoose.connection.close()
    })
}
