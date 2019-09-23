

import React, { Component } from "react";

export default class Weather extends Component {
    render() {
        const { 
            requestedWeather, 
            eventCloseWeather, 
            eventAddWeather
        } = this.props;
        return (
            <>
                <div className="weather-display">
                    <span className="weather-close" onClick={() => eventCloseWeather()}/>
                    {/* <span className="weather-add" onClick={() => eventAddWeather()}/> */}
                    <p className="weather-place">
                        <span className="weather-city">{requestedWeather.city}</span>
                        <span className="weather-time">{requestedWeather.time}</span>
                    </p>
                    <span className={`weather-icon weather-descrition-icon weather-${requestedWeather.icon}`}></span>
                    <p className="weather-description">{requestedWeather.description}</p>
                    <p className="weather-temp">{(requestedWeather.temp).toFixed(0)}°C</p>
                    <p className="weather-wind-speed weather-icon-small">{(requestedWeather.wind).toFixed(1)}</p>
                    <p className="weather-humidity weather-icon-small">{requestedWeather.humidity}%</p>
                </div>
            </>
        )
    }
}