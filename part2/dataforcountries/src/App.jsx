import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'

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
