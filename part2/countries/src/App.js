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
	})

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

const CapitalWeather = ({capital}) => {

  const [weatherState, setWeatherState] = useState({})
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
		axios
			.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
			.then(response => {
        setWeatherState(response.data)
			})
	})

  if (Object.keys(weatherState).length !== 0) {
    return (
      <>
        <h2>Weather in {capital}</h2>
        <p>temperature {weatherState.main.temp} Celcius</p>
        <img src={`http://openweathermap.org/img/wn/${weatherState.weather[0].icon}@2x.png`} alt="weather icon" width={100} />
        <p>wind {weatherState.wind.speed} m/s</p>
      </>
    )
  } else {
    return <h2>Retrieving {capital} weather info...</h2>
  }

  
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
        <CapitalWeather capital={capital} />
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
  })

  const handleSearch = (event) => {

    let query = event.target.value // set Countries
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
