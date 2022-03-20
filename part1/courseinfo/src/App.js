const makeArray = (arr, elem) => {
  return arr.map(part => part[elem])
}

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  let names = makeArray(props.parts, "name")
  let exercises = makeArray(props.parts, "exercises")

  return (
    <div className="content">
      <Part name={names[0]} num={exercises[0]} />
      <Part name={names[1]} num={exercises[1]} />
      <Part name={names[2]} num={exercises[2]} />
    </div>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.name} {props.num}
    </p>
  )
}

const Total = (props) => {
  let exercises = makeArray(props.parts, "exercises")
  let sum = exercises.reduce((partial, a) => partial + a, 0)

  return(
    <>
      <p>Number of exercises {sum}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  
  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default App