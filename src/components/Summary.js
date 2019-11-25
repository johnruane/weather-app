import React, { Component } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export default class Summary extends Component {
    handleClose() {
        this.setState({
            apiWeatherResponseObj: [],
        })
    }

    render() {
        const { savedWeather, eventRemoveWeather } = this.props;
        return  (
          <>
            {savedWeather.map((value) => {
                return ([
                    <div className="saved-weather-display">
                        <span className="saved-weather-close" id={value.id} onClick={(event) => eventRemoveWeather(event)}/>
                        <p className={`saved-weather-icon saved-weather-description weather-${value.icon}`}></p>
                        <p className="saved-weather-temp">{(value.temp).toFixed(0)}°C</p>
                        <p className="saved-weather-city">{value.city} - <span className="saved-weather-time">{value.time}</span></p>
                    </div>
                ])
            })}
          </>
        )
    }
}