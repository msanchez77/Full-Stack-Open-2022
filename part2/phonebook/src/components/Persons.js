import personService from '../services/persons'

const Person = (props) => {

	return (
		<>
			<span>{props.name} {props.number}</span>
			<button 
				onClick={() => personService.remove(props.name, props.id, props.persons, props.setPersons)}
				style={{marginLeft: "10px"}}
			>
				delete
			</button>
		</>
	)
}

const Persons = ({persons, setPersons}) => {

	if (persons.length === 0) {return}

	return (
		<>
			{persons.map(person =>
				<div style={{marginTop: "10px", marginBottom: "10px"}} key={person.id}>
					<Person key={person.id} name={person.name} number={person.number} persons={persons} setPersons={setPersons} id={person.id} />
				</div>
			)}
		</>
	)
}

export default Persons