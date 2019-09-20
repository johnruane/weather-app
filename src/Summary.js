import React, { Component } from "react";

export default class Summary extends Component {
    handleClose() {
        this.setState({
            apiWeatherResponseObj: [],
        })
    }

    removeFromSavedList(event) {
        const id = parseInt(event.currentTarget.id);
        this.setState({
            savedWeatherList: this.state.savedWeatherList.filter((item) => item.id !== id),
        });
    }

    render() {
        const { savedWeather } = this.props;
        return  (
                    <div className="saved-weather">
                        {savedWeather.map((value, index) => {
                            return ([
                                <div key={index} className="saved-weather-display">
                                <span className="saved-weather-close" id={value.id} onClick={(evt) => this.removeFromSavedList(evt)}/>
                                <p className={`saved-weather-icon saved-weather-description weather-${value.icon}`}>{value.description}</p>
                                <p className="saved-weather-temp">{(value.temp).toFixed(0)}°C</p>
                                <p className="saved-weather-icon saved-weather-wind-speed">{(value.wind).toFixed(0)}mph</p>
                                <p className="saved-weather-icon saved-weather-humidity">{value.humidity}%</p>
                                <p className="saved-weather-time">{value.city} - {value.time}</p>
                                </div>
                            ])
                        })}
                    </div>
                )
    }
}