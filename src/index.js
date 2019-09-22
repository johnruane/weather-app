import React from 'react';
import ReactDOM from 'react-dom';
import Weather from "./Weather.js";
import Summary from "./Summary.js";
import { 
  isUnique,
  calculateTimezone,
  callAPI
} from './helpers.js';
import './index.css';
import data from './citylist.json';

export default class WeatherApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      selectedCity: '',
      cityId: '',
      autoComplete: [],
      apiWeatherResponseObj: {},
      savedWeatherList: [],
      currentWeatherRequest: {},
      showWeather: false,
    };
  }

  componentDidMount() {
    document.querySelector(".input-form-input").focus();
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
        if (isUnique(matches, data[i])) {
          matches.push(data[i]);
        }
      }
    }

    return matches.sort(function(a,b) {
      return a.name.length - b.name.length;
    });
  }

  updateAutoComplete(list) {
    this.setState({autoComplete: list});
  }

  handleClick(event) {
    const selectedCity = event.currentTarget.innerText;
    this.setState({
      inputValue: selectedCity,
      selectedCity: selectedCity,
      cityId: event.currentTarget.id,
      autoComplete: []
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { cityId } = this.state;
    const URL = `http://api.openweathermap.org/data/2.5/weather?&units=metric&id=${cityId}&appid=1f2d551b407d5fe41b27a5e4bd5fd3ad`;
    let requestedWeather;
    try {
      requestedWeather = await callAPI(URL);
      let trimmedWeather = {
        id:  requestedWeather.id,
        city: this.state.selectedCity,
        temp: requestedWeather.main.temp,
        // tempMax: requestedWeather.main.temp_max,
        // tempMin: requestedWeather.main.temp_min,
        description: requestedWeather.weather[0].description,
        icon: requestedWeather.weather[0].icon,
        wind: requestedWeather.wind.speed,
        humidity: requestedWeather.main.humidity,
        timezone: requestedWeather.timezone,
        time: calculateTimezone(requestedWeather.timezone),
      }
      this.setState({
        apiWeatherResponseObj: trimmedWeather,
        showWeather: true,
      })
    } catch(err) {
      console.log(err);
    }
  }

  async getMinMaxTemp() {
    const { cityId } = this.state;
    const URL = `http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=1f2d551b407d5fe41b27a5e4bd5fd3ad`;
    let minMaxTemp;
    try {
      minMaxTemp = await callAPI(URL);
    } catch (err) {
      console.log(err);
    }
    console.log(minMaxTemp);
  }

  addWeather() {
    if (isUnique(this.state.savedWeatherList,this.state.apiWeatherResponseObj)) {
      this.setState({
        savedWeatherList: [this.state.apiWeatherResponseObj, ...this.state.savedWeatherList],
      })
    }
  }

  closeWeather() {
    this.setState({
      inputValue: '',
      showWeather: false,
    })
  }

  removeFromSavedList(event) {
    const id = parseInt(event.currentTarget.id);
    this.setState({
        savedWeatherList: this.state.savedWeatherList.filter((item) => item.id !== id),
    });
  }

  render() {
    const { showWeather, savedWeatherList } = this.state;
    const showSummary = savedWeatherList.length > 0;
    return (
      <div className="weather-container">
        <form className="input-form" onSubmit={(evt) => this.handleSubmit(evt)}>
          <div className="input-wrapper">
            <input  className="input-form-input" type="text" value={this.state.inputValue} onChange={(event) => this.handleChange(event)} />
            <button className="input-form-submit" type="submit" value="Submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23.822 20.88l-6.353-6.354c.93-1.465 1.467-3.2 1.467-5.059.001-5.219-4.247-9.467-9.468-9.467s-9.468 4.248-9.468 9.468c0 5.221 4.247 9.469 9.468 9.469 1.768 0 3.421-.487 4.839-1.333l6.396 6.396 3.119-3.12zm-20.294-11.412c0-3.273 2.665-5.938 5.939-5.938 3.275 0 5.94 2.664 5.94 5.938 0 3.275-2.665 5.939-5.94 5.939-3.274 0-5.939-2.664-5.939-5.939z"/></svg>
            </button>
            {
              this.state.autoComplete.length > 0 &&
              <div className="auto-complete-wrapper">
                <ul className="auto-complete-list">
                  {this.state.autoComplete.slice(0, -1).map((value) => {
                    return ([
                      <li className="auto-complete-list-item" key={value.id}>
                        <span className="auto-complete-span" id={value.id} 
                          onClick={(evt) => this.handleClick(evt)}>{value.name } ({value.country})
                        </span>
                      </li>
                    ])
                  })}
                </ul>
              </div>
            }
          </div>
        </form>
        { showWeather 
          ? <Weather requestedWeather={this.state.apiWeatherResponseObj} eventCloseWeather={() => this.closeWeather()} eventAddWeather={() => this.addWeather()} />
          : ( showSummary
            ? <Summary savedWeather={savedWeatherList} eventRemoveWeather={(event) => this.removeFromSavedList(event)}/>
            : null
          )
        }
      </div>
    );
  }
}

ReactDOM.render(<WeatherApp />, document.getElementById('root'));
