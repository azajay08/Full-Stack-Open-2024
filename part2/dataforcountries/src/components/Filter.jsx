import Country from './Country'
import CountryPreview from './CountryPreview'


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

export default Filter