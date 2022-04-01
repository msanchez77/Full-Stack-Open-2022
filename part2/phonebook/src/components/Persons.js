import React from "react";

const Person = (props) => <p>{props.name} {props.number}</p>

const Persons = (props) => {
  let persons = props.persons

  return (
    <>
      {persons.map(person =>
        <Person key={person.name} name={person.name} number={person.number} />
      )}
    </>
  )
}

export default Persons