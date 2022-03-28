const List = ({collection}) => {
	let html = ''

	collection.forEach(element => {
		html.concat(element.name)
	});

	console.log(html);
	return <p>{html}</p>
}

const App = () => {
  
	let animals = [
		{ name: 'Fido', species: 'dog' },
		{ name: 'Caro', species: 'dog' },
		{ name: 'Ursula', species: 'cat' },
		{ name: 'Jimmy', species: 'fish' },
	]

	let isDog = (animal) => animal.species === 'dog'

	let dogs = animals.filter(isDog)
	// 'reject' is another HOF

	debugger

  return (
    <div>
      <List collection={dogs}/>
    </div>
  )
}

export default App


