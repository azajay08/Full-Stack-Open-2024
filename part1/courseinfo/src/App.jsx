const Header = (props) => {
	return (
		<div>
			<h1>{props.course.name}</h1>
		</div>
	)
}

const Part = (props) => {
	return (
		<div>
			<p>{props.parts.name} {props.parts.exercises}</p>
		</div>
	)
}

const Content = (props) => {
	return (
		<div>
			<Part parts={props.parts[0]} />
			<Part parts={props.parts[1]} />
			<Part parts={props.parts[2]} />
		</div>
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
		  <Header course={course} />
		  <Content parts={course.parts} />
		  {/* <Total parts= {course} /> */}
		</div>
	  )
  }
  
  export default App