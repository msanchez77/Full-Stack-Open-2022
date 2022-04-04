import React from 'react'

const CountryName = ({name}) => <p>{name}</p>
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

export default Countries