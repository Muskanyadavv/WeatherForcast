


import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState(null)
  const [location, setLocation] = useState('')

  const searchLocation = async (event) => {
    if (event.key === 'Enter') {
      try {
        // 1. Get lat/lon from city name
        const geoRes = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1`
        )

        if (!geoRes.data.results || geoRes.data.results.length === 0) {
          alert("City not found")
          return
        }

        const { latitude, longitude, name, country } = geoRes.data.results[0]

        // 2. Fetch weather data
        const weatherRes = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=auto&temperature_unit=fahrenheit&wind_speed_unit=mph`
        )

        setData({
          location: `${name}, ${country}`,
          ...weatherRes.data
        })

      } catch (error) {
        console.error(error)
      }

      setLocation('')
    }
  }

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyDown={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>

      {data && (
        <div className="container">
          <div className="top">
            <div className="location">
              <p>{data.location}</p>
            </div>
            <div className="temp">
              <h1>{data.current.temperature_2m}°F</h1>
            </div>
            <div className="description">
              <p>Feels like {data.current.apparent_temperature}°F</p>
            </div>
          </div>

          <div className="bottom">
            <div className="feels">
              <p className="bold">{data.current.apparent_temperature}°F</p>
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              <p className="bold">{data.current.relative_humidity_2m}%</p>
              <p>Humidity</p>
            </div>
            <div className="wind">
              <p className="bold">{data.current.wind_speed_10m} MPH</p>
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

