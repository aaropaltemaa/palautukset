import { useState, useEffect } from 'react'
import axios from 'axios'
import Criteria from './Criteria'
import ShowButton from './ShowButton'

const App = () => {
  const [value, setValue] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    console.log('fetching all countries...')
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        console.log('response data:', response.data)
        setAllCountries(response.data)
      })
      .catch(error => {
        console.error("There was an error fetching the countries data:", error)
        setAllCountries([])
      })
  }, [])



  const handleChange = (event) => {
    const inputValue = event.target.value
    setValue(inputValue)
    
    const filtered = allCountries.filter(country =>
      typeof country.name === 'object' && 
      country.name.common.toLowerCase().includes(inputValue.toLowerCase())
    )
    setFilteredCountries(filtered)
  }


  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        find countries <input value={value} onChange={handleChange} />
      </form>
      <Criteria countries={filteredCountries} />
    </div>
  )
}

export default App
