const APIkeys = new Map([
  ['weather', '6dab4492661c4890874829ab94d23fed'],
  ['background', 'hpthTi3lgM1vdtMHcfvAiW-hFUjaLHYCSAtG4y-Er-I'],
]);

const getSevenDaysWeather = async () => {
  try {
    const config = {
      params: {
        key: APIkeys.get('weather'),
        days: 8,
        city: searchCity.value,
      },
    };
    const apiURL = 'https://api.weatherbit.io/v2.0/forecast/daily';
    const res = await axios.get(apiURL, config);
    return res.data.data;
  } catch (err) {
    console.log(err);
  }
};

const getCurrentWeather = async () => {
  try {
    const config = {
      params: {
        city: searchCity.value,
        key: APIkeys.get('weather'),
      },
    };
    const apiURL = 'https://api.weatherbit.io/v2.0/current';
    const res = await axios.get(apiURL, config);
    const resData = res.data.data[0];
    return resData;
  } catch (err) {
    console.log(err);
    showErrorMessage();
  }
};

const getHourlyForecast = async () => {
  try {
    const config = {
      params: {
        city: searchCity.value,
        key: APIkeys.get('weather'),
        hours: 12,
      },
    };
    const apiURL = 'https://api.weatherbit.io/v2.0/forecast/hourly';
    const res = await axios.get(apiURL, config);
    console.log(res.data.data);
    // return res.data.data;
  } catch (err) {
    console.log(err);
  }
};

const getBgImage = async () => {
  try {
    const config = {
      params: {
        client_id: APIkeys.get('background'),
        query: searchCity.value,
        per_page: 1,
      },
    };
    const apiURL = 'https://api.unsplash.com/search/photos';
    const res = await axios.get(apiURL, config);
    const resData = res.data.results[0].urls.regular;

    return resData;
  } catch {
    const rand = Math.floor(Math.random() * 5) + 1;
    return `img/rand0${rand}.jpg`;
  }
};
