import {useState, useEffect} from 'react'
import axios from 'axios'

import Filter from './components/Filter';
import Countries from './components/Countries';

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  // Initialize countries
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearch = (event) => {

    let query = event.target.value

    // set Countries
    let curr = countries.filter((country) => {
      let s = query.toLowerCase()
      let r = country.name.common.toLowerCase()

      return r.includes(s)
    })

    setSearch(query)
    setResults(curr)
  }

  return (
    <>
      <Filter value={search} handleSearch={handleSearch} />

      <Countries query={search} results={results}/>
    </>
  );
}


export default App;
