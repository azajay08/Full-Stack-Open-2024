import { useState, useEffect } from 'react'
import axios from 'axios'

const Language = ({language}) => <li>{language}</li>

const Weather = ({capital}) => {
	const[forecast, setForecast] = useState(null)
	const api_key = import.meta.env.VITE_API_KEY

	useEffect(() => {
		axios
			.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
			.then(response => {
				console.log(response.data)
				setForecast(response.data)
			})
	}, [])
	
	return ( forecast === null ? null :
		<div>
			<h2>Weather in {capital}</h2>
			<div>{`tempertaure ${(forecast.main.temp).toFixed(2)} Celcius`}</div>
			<img alt="weather icon" src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} />
			<div>{`wind ${forecast.wind.speed} m/s`}</div>
		</div>
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
				<Language key={language} language={country.languages[language]}/>)}
			</ul>
			<img src={country.flags.png} alt='flag' height='200' width='250' />
			<Weather capital={country.capital}/>

		</div>
	)
}

const CountryPreview = ({country}) => {
	const [showButton, setShowButton] = useState(false)

	const handleClick= () => {
		setShowButton(!showButton)
	}

	return (
		<div>
			{country.name.common} <button onClick={handleClick}>{showButton === false ? 'show': 'hide'}</button>
			{showButton === true && <Country key={country.name.common} country={country} />}	
		</div>
	)
	
} 

const Filter = ({result, searchInput}) => {
	if (!searchInput) {
		return
	}
	if (searchInput && result.length > 10) {
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
				find countries <input id="SearchInput" value={country} onChange={handleCountryChange}/>
			</form>
			<div>
				<Filter key={filteredCountries.id} result={filteredCountries}
				 searchInput={country.length > 0 ? true : false} />
			</div>
		</div>
	)
}

export default App
