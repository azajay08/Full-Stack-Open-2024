import Country from "./Country"
import { useState } from 'react'

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

export default CountryPreview