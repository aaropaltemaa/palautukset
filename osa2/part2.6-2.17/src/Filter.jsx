const Filter = ({ persons, showAll, regex, deletePersonOf }) => {
  const personsToShow = showAll
    ? persons
    : persons.filter(person => regex.test(person.name))

  return (
    <ul>
      {personsToShow.map(person =>
        <li className='person' key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePersonOf(person.id)}>delete</button>
        </li>
      )}
    </ul>
  )
}

export default Filter
