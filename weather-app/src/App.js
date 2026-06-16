import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "753102857112dba27cdc3993074cbbef";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast(null);

    try {
      const trimmed = city.trim();
      const isZip = /^\d{5}$/.test(trimmed);
      const query = isZip ? `zip=${trimmed},us` : `q=${trimmed}`;

      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`,
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`,
        ),
      ]);
      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
    } catch (err) {
      setError("City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  return (
    <div className="app">
      <h1>Weather App</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter a city or zip code..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="current-weather">
          <h2>
            {weather.name}, {weather.sys?.country}
          </h2>
          <p className="description">{weather.weather?.[0]?.description}</p>
          <p className="temp">{Math.round(weather.main?.temp)}°F</p>
          <p>Feels like: {Math.round(weather.main?.feels_like)}°F</p>
          <p>Humidity: {weather.main?.humidity}%</p>
          <p>Wind Speed: {weather.wind?.speed} mph</p>
          <p>
            Sunrise:{" "}
            {new Date(weather.sys?.sunrise * 1000).toLocaleTimeString()}
          </p>
          <p>
            Sunset: {new Date(weather.sys?.sunset * 1000).toLocaleTimeString()}
          </p>
        </div>
      )}

      {forecast && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-grid">
            {forecast.list
              .filter((_, index) => index % 8 === 0)
              .map((item, index) => (
                <div className="forecast-card" key={index}>
                  <p className="forecast-day">
                    {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="forecast-desc">
                    {item.weather?.[0]?.description}
                  </p>
                  <p className="forecast-temp">
                    {Math.round(item.main?.temp)}°F
                  </p>
                  <p>Humidity: {item.main?.humidity}%</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
