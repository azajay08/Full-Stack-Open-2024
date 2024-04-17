import Weather from './Weather'

const Language = ({language}) => <li>{language}</li>

const Country = ({country}) => {
	const languages = Object.keys(country.languages)
	return (
		<div>
			<h1>{country.name.common}</h1>
			<div>capital: {country.capital}</div>
			<div>area: {country.area}</div>
			<h3>languages:</h3>
			<ul>
				{languages.map(language =>
				<Language key={language} language={country.languages[language]}/>)}
			</ul>
			<img src={country.flags.png} alt='flag' height='200' width='250' />
			<Weather capital={country.capital}/>

		</div>
	)
} 

export default Country