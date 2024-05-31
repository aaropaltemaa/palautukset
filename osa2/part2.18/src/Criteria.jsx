import ShowButton from "./ShowButton"
import { useState, useEffect } from 'react'

const Criteria = ({ countries }) => {
  const [showOneCountry, setShowOneCountry] = useState({})

  const handleShowOneToggle = countryCode => {
    setShowOneCountry(prevState => ({
      ...prevState,
      [countryCode]: !prevState[countryCode]
    }))
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter.</p>
  }

  if (countries.length > 1 && countries.length <= 10) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.alpha3Code}>
            {country.name.common} 
            <ShowButton 
              handleShowOneToggle={() => handleShowOneToggle(country.alpha3Code)}
              showOneCountry={showOneCountry[country.alpha3Code]}
            />
          </li>
        ))}
      </ul>
    )
  }

  if (countries.length === 1) {
    const country = countries[0]
    const languageNames = Object.values(country.languages);
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h3>Languages:</h3>
        <ul>
          {languageNames.map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flag} alt={`Flag of ${country.name.common}`} width="100" />
      </div>
    )
  }

  return null
}

export default Criteria
