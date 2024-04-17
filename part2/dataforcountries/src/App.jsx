import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryPreview = ({country}) => {
	return (
		<div>{country.name.common}</div>
	)
}

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
				<li key={language}> {country.languages[language]}</li>)}
			</ul>
			<img src={country.flags.png} alt='flag' height='200' width='250' />
		</div>
	)
}

const FilterPreview = ({result}) => {
	
	if (result.length > 10) {
		return (
			'Too many matches, specify another filter'
		)
	}
	else if(result.length === 1) {
		return (result.map(country => <Country key={country.name.common} country={country}/>))
	} else {
		return (result.map(country => <CountryPreview key={country.name.common} country={country}/>))
	}
}

const App = () => {
	const [country, setCountry] = useState('')
	const [result, setResult] = useState([])

	useEffect(() => {
		axios
			.get('https://studies.cs.helsinki.fi/restcountries/api/all')
			.then(response => {
				setResult(response.data)
			})
	}, [])

	const handleCountryChange = (event) => {
		setCountry(event.target.value)
	}

	const filteredCountries = result.map
	(c => c.name.common.toLowerCase().includes(country.toLowerCase())) ?
	result.filter(c => c.name.common.toLowerCase().includes(country.toLowerCase())) :
	result

	return (
		<div>
			<form>
				find countries <input value={country} onChange={handleCountryChange}/>
			</form>
			<div>
				<FilterPreview key={filteredCountries.id} result={filteredCountries} country={country} />
			</div>
		</div>
	)
}

export default App
