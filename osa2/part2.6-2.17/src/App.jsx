import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './Filter'
import FilterButton from './FilterButton'
import PersonForm from './PersonForm'
import OperationSuccess from './components/OperationSuccess'
import OperationFail from './components/OperationFail'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [addMessage, setAddMessage] = useState(null)
  const [addErrorMessage, setAddErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then(setPersons)
  }, [])

  const handleNotification = (message, type = 'success') => {
    if (type === 'success') {
      setAddMessage(message)
      setTimeout(() => setAddMessage(null), 5000)
    } else if (type === 'fail') {
      setAddErrorMessage(message)
      setTimeout(() => setAddErrorMessage(null), 5000)
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }
    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(persons.map((person) => (person.id !== existingPerson.id ? person : returnedPerson)))
            setNewName('')
            setNewNumber('')
            handleNotification(`Updated ${existingPerson.name}'s phone number`)
          })
          .catch((error) => {
            handleNotification(`Information of '${existingPerson.name}' was already deleted from server`, 'fail')
            setPersons(persons.filter((p) => p.id !== existingPerson.id))
          })
      }
    } else {
      personService.create(personObject)
        .then((returnedPerson) => {
          setPersons([...persons, returnedPerson])
          setNewName('')
          setNewNumber('')
          handleNotification(`Added ${returnedPerson.name}`)
        })
        .catch(console.error)
    }
  }

  const deletePersonOf = (id) => {
    const person = persons.find((p) => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id))
          handleNotification(`Deleted ${person.name}`)
        })
        .catch((error) => {
          console.error(error)
          setPersons(persons.filter((p) => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <OperationSuccess message={addMessage} />
      <OperationFail message={addErrorMessage} />
      <FilterButton handleShowAllToggle={() => setShowAll(!showAll)} showAll={showAll} />
      <h2>add a new contact</h2>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={(e) => setNewName(e.target.value)} 
        handleNumberChange={(e) => setNewNumber(e.target.value)} 
      />
      <h2>Numbers</h2>
      <Filter
        persons={persons}
        showAll={showAll} 
        regex={/^[A-Z]/} 
        deletePersonOf={deletePersonOf}
      />
    </div>
  )
}

export default App
