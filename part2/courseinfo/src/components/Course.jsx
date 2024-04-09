const Header = (props) => {
	return (
		<div>
			<h1>{props.course.name}</h1>
		</div>
	)
}

const Part = (props) => {
	console.log(props)
	return (
		<div>
			<p>{props.parts.name} {props.parts.exercises}</p>
		</div>
	)
}

const Content = (props) => {
	console.log(props)
	return (

		<div>
			{props.parts.map(part =>
			<Part key={part.id} parts={part} />
			)}
		</div>
	)
}

const Total = (props) => {
	console.log(props)
	const totalExercises = props.parts.reduce((total, part) => total + part.exercises, 0)
	return (
		<div>
			<b>total of {totalExercises} exercises</b>
		</div>
	)
}

const Course = (props) => {
	return (
		<div>
		  <Header course={props.course} />
		  <Content parts={props.course.parts} />
		  <Total parts={props.course.parts} />
		</div>
	)
}

export default Course;