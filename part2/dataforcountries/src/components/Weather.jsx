import axios from 'axios'
import { useState, useEffect } from 'react'

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

export default Weather