import data from '../data/citylist.json';
/*
*Does the city(country) already exist in the saved list 
*/
export function isUnique(currentList, itemToCheck) {
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
/*
*Create nice time from unix timestamp
*/
export function calculateTimezone(adjustment) {
  adjustment = adjustment - 3600;
  const newdate = (adjustment > 0) ? new Date(Date.now() + adjustment*1000) : new Date(Date.now() - adjustment*1000);
  const day = convertNumberToDay(newdate.getDay());
  const minutes = (newdate.getMinutes() < 10) ? '0'+newdate.getMinutes() : newdate.getMinutes();
  const hours =  (newdate.getHours() < 10) ? '0' + newdate.getHours() : newdate.getHours();
  const meridian = (newdate.getHours() >= 12) ? 'pm' : 'am';
  const simpleTime = `${day}, ${hours}:${minutes}${meridian}`;
  return simpleTime;
}
/*
*Get string version of day
*/
export function convertNumberToDay(d) {
  const days = {
    '0': 'Sun',
    '1': 'Mon',
    '2': 'Tues',
    '3': 'Wed',
    '4': 'Thu',
    '5': 'Fri',
    '6': 'Sat'
  }
  return days[d];
}

export async function callAPI(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (err) {
    throw Error(err);
  }
}

export function matchInput(input) {
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
