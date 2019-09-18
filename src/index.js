import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import data from './citylist.json';

export default class WeatherApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      selection: '',
      selectionId: '',
      autoComplete: [],
      apiWeatherResponseObj: {},
      savedWeatherList: [],
    };
  }

  handleChange(event) {
    this.setState({inputValue: event.target.value});
    if (event.target.value.length > 2) {
      this.updateAutoComplete(this.matchInput(event.target.value));
    } else {
      this.setState({autoComplete: []});
    }
  }

  matchInput(input) {
    const matches = [];
    for (var i in data) {
      let cityName = data[i].name;
      if (cityName.toLowerCase().indexOf(input.toLowerCase()) === 0) {
        if (this.isUnique(matches, data[i])) {
          matches.push(data[i]);
        }
      }
    }

    return matches.sort(function(a,b) {
      return a.name.length - b.name.length;
    });
  }

  isUnique(currentList, itemToCheck) {
    if (currentList.length === 0) {
      return true;
    }
    for (let i=0; i<currentList.length; i++) {
      if (currentList[i].name === itemToCheck.name && currentList[i].country === itemToCheck.country) {
        return false;
      } 
    }
    return true;
  }

  updateAutoComplete(list) {
    this.setState({autoComplete: list});
  }

  handleClick(event) {
    const selection = event.currentTarget.innerText;
    this.setState({
      inputValue: selection,
      selection: selection,
      selectionId: event.currentTarget.id,
      autoComplete: []
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { selectionId } = this.state;
    let requestedWeather = await this.getWeather(selectionId);
    let trimmedWeather = {
      id:  requestedWeather.id,
      city: this.state.selection,
      temp: requestedWeather.main.temp,
      description: requestedWeather.weather[0].description,
      icon: requestedWeather.weather[0].icon,
      wind: requestedWeather.wind.speed,
      humidity: requestedWeather.main.humidity,
      timezone: requestedWeather.timezone,
      time: this.calculateTimezone(requestedWeather.timezone),
    }
    this.setState({
      apiWeatherResponseObj: trimmedWeather,
    })
    this.saveWeather();
  }

  calculateTimezone(adjustment) {
    adjustment = adjustment - 3600;
    const newdate = (adjustment > 0) ? new Date(Date.now() + adjustment*1000) : new Date(Date.now() - adjustment*1000);
    const simpleTime = `${newdate.getHours()}:${newdate.getMinutes()}`;
    return simpleTime;
  }

  saveWeather() {
    this.setState({
      savedWeatherList: [this.state.apiWeatherResponseObj, ...this.state.savedWeatherList],
    })
  }

  handleClose() {
    this.setState({
      apiWeatherResponseObj: [],
    })
  }

  async getWeather(id) {
    const API_CALL = `http://api.openweathermap.org/data/2.5/weather?&units=metric&id=${id}&appid=1f2d551b407d5fe41b27a5e4bd5fd3ad`;
    const response = await fetch(API_CALL);
    const data = await response.json();
    console.log(data);
    return data;
  }

  isEmpty(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
  }

  removeFromSavedList(event) {
    const id = parseInt(event.currentTarget.id);
    this.setState({
      savedWeatherList: this.state.savedWeatherList.filter((item) => item.id !== id),
    });
  }

  render() {
    return (
      <div className="weather-container">
        <form className="input-form" onSubmit={(evt) => this.handleSubmit(evt)}>
          <div className="input-wrapper">
            <input  className="input-form-input" type="text" value={this.state.inputValue} onChange={(evt) => this.handleChange(evt)} />
            <button className="input-form-submit" type="submit" value="Submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23.822 20.88l-6.353-6.354c.93-1.465 1.467-3.2 1.467-5.059.001-5.219-4.247-9.467-9.468-9.467s-9.468 4.248-9.468 9.468c0 5.221 4.247 9.469 9.468 9.469 1.768 0 3.421-.487 4.839-1.333l6.396 6.396 3.119-3.12zm-20.294-11.412c0-3.273 2.665-5.938 5.939-5.938 3.275 0 5.94 2.664 5.94 5.938 0 3.275-2.665 5.939-5.94 5.939-3.274 0-5.939-2.664-5.939-5.939z"/></svg>
            </button>
            {
              this.state.autoComplete.length > 0 &&
              <div className="test">
                <ul className="auto-complete-list">
                  {this.state.autoComplete.slice(0, -1).map((value) => {
                    return ([
                      <li className="auto-complete-list-item" key={value.id}>
                        <span className="auto-complete-span" id={value.id} 
                          onClick={(evt) => this.handleClick(evt)}>{value.name } - {value.country}
                        </span>
                      </li>
                    ])
                  })}
                </ul>
              </div>
            }
          </div>
        </form>
          {
            this.state.savedWeatherList.length > 0 &&
              <div className="saved-weather">
                {this.state.savedWeatherList.map((value, index) => {
                  return ([
                    <div key={index} className="saved-weather-display">
                      <p className="saved-weather-city">{value.city}</p>
                      <span className="close" id={value.id} onClick={(evt) => this.removeFromSavedList(evt)}/>
                      <p className={`saved-weather-icon saved-weather-description weather-${value.icon}`}>{value.description}</p>
                      <p className="saved-weather-temp">{(value.temp).toFixed(0)}°C</p>
                      <p className="saved-weather-icon saved-weather-wind-speed">{(value.wind).toFixed(0)}mph</p>
                      <p className="saved-weather-icon saved-weather-humidity">{value.humidity}%</p>
                      <p className="saved-weather-time">{value.time}+{(value.timezone-3600)/60/60}</p>
                    </div>
                  ])
                })}
              </div>
          }
      </div>
    );
  }
}

ReactDOM.render(<WeatherApp />, document.getElementById('root'));
