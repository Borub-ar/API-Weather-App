const getSevenDaysWeather = async () => {
    try {
        const config = {
            params: {
                key: '4c1299c9ae164edd8cb6e247728e94af',
                days: 8,
                city: searchCity.value
            }
        }
        const apiURL = 'https://api.weatherbit.io/v2.0/forecast/daily';
        const res = await axios.get(apiURL, config);
        return res.data.data;

    } catch (err) {
        console.log(err);
    }
}


const getCurrentWeather = async () => {
    try {
        const config = {
            params: {
                city: searchCity.value,
                key: '4c1299c9ae164edd8cb6e247728e94af'
            }
        }
        const apiURL = 'https://api.weatherbit.io/v2.0/current';
        const res = await axios.get(apiURL, config);
        const resData = res.data.data[0];
        return resData;

    } catch (err) {
        console.log(err);

        errorMessage.style.transform = 'translate(-50%, -30%)'
        errorMessage.style.opacity = '1'
    }
}


const getBgImage = async () => {
    try {
        const config = {
            params: {
                client_id: 'hpthTi3lgM1vdtMHcfvAiW-hFUjaLHYCSAtG4y-Er-I',
                query: searchCity.value,
                per_page: 1
            }
        }
        const apiURL = 'https://api.unsplash.com/search/photos';
        const res = await axios.get(apiURL, config);
        const resData = res.data.results[0].urls.regular;

        return resData;
    } catch {
        const rand = Math.floor(Math.random() * 5) + 1;
        return `img/rand0${rand}.jpg`;
    }
}


const getHourlyForecast = async () => {
    try {
        const config = {
            params: {
                key: '4c1299c9ae164edd8cb6e247728e94af',
                city: searchCity.value,
                hours: 12
            }
        }
        const apiURL = 'https://api.weatherbit.io/v2.0/forecast/hourly';
        const res = await axios.get(apiURL, config);
        return res.data.data;

    } catch (err) {
        console.log(err);
    }
}