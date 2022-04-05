import {useState, useEffect, React} from 'react'
import axios from 'axios'

import Filter from './components/Filter';

const CountryName = ({name}) => {

	const [singleCountryState, setSingleCountryState] = useState([])
	const [show, setShow] = useState(false)

	useEffect(() => {
		axios
			.get(`https://restcountries.com/v3.1/name/${name}`)
			.then(response => {
				setSingleCountryState(response.data)
			})
	}, [])

	return (
		<div style={{marginTop: "10px", marginBottom: "10px"}}>
			<span>{name}</span>
			<button onClick={() => setShow(!show)}>
				{show ? 'hide' : 'show'}
			</button>
			{show ?
				<CountryInfo 
					name={singleCountryState[0].name.common}
					capital={singleCountryState[0].capital}
					area={singleCountryState[0].area}
					languages={singleCountryState[0].languages}
					flag={singleCountryState[0].flags.png} 
				/>
				: <></>
			}
		</div>
	)
}
const CountryListItem = (props) => <li>{props.item}</li>

const CountryInfo = (props) => {

  let langs = Object.keys(props.languages).map((lang) => props.languages[lang])
  return (
    <div>
      <h1>{props.name.common}</h1>
      <p>capital {props.capital}</p>
      <p>area {props.area}</p>
      <br/>
      <h3>languages:</h3>
      <ul>
        {langs.map(lang =>
          <CountryListItem key={lang} item={lang} />
        )}
      </ul>
      <br/>
      <img src={props.flag} alt={"country flag"} width={200} height={"auto"}/>
    </div>
  )
}

const Countries = (props) => {
  
  if (props.results.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (props.results.length < 1) {
    return <p>No matches, specify another filter</p>
  } else if (props.results.length === 1) {
    let { name, capital, area, languages, flags } = props.results[0]
    return (
      <>
        <CountryInfo name={name} capital={capital} area={area} languages={languages} flag={flags.png}/>
      </>
    )
  } else {
    return (
      <>
        {props.results.map(country => 
          <CountryName key={country.cca3} name={country.name.common} />
        )}
      </>
    )
  }

}

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
