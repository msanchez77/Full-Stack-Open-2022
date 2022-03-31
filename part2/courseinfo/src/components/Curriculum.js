import React from 'react'

const SubHeader = ({ course }) => <h3>{course}</h3>

const Total = ({ sum }) => <strong>Total of {sum} exercises</strong>

const Part = ({ part }) =>
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </>
  )
}

const Course = ({ course }) => {
  let sum = course.parts
    .map(part => part['exercises'])
    .reduce((sum, part) => {
      return sum + part
    }, 0)

  return (
    <>
      <SubHeader course={course.name} />
      <Content parts={course.parts} />
      <Total sum={sum} />
    </>
  )
}

const Curriculum = ({ courses }) => {
  return (
    <>
      {courses.map(course => 
        <Course key={course.id} course={course}/>
      )}
    </>
  )
}

export default Curriculum