// Aside menu toggle
const toggleBtn = document.querySelector('.toggle_btn');

toggleBtn.addEventListener('click', () => {
    const asideNav = document.querySelector('.aside_nav');
    asideNav.classList.toggle('aside_show');
});

// Current weather call 
const searchBtn = document.querySelector('.search_button')

searchBtn.addEventListener('click', async () => {
    const cityInf = await currentWeather();
    const bgPhoto = await bgImage();

    const mainTemp = document.querySelector('.current_temp');
    const cityName = document.querySelector('.main_city_name');
    const currIcon = document.querySelector('.current_weather_icon');
    const descr = document.querySelector('.weather_descr');
    const sunrise = document.querySelector('.sunrise_span');
    const sunset = document.querySelector('.sunset_span');
    const cityPhoto = document.querySelector('.city_photo')


    mainTemp.innerText = cityInf.temp;
    cityName.innerText = cityInf.city_name;
    currIcon.src = `https://www.weatherbit.io/static/img/icons/${cityInf.weather.icon}.png`
    descr.innerText = cityInf.weather.description;
    sunrise.innerText = cityInf.sunrise;
    sunset.innerText = cityInf.sunset;
    cityPhoto.style.backgroundImage = `url(${bgPhoto})`;
});

// Current weather in searched city function 
const currentWeather = async () => {
    const searchCity = document.querySelector('#search').value;

    const config = { params: { city: searchCity, key: '4c1299c9ae164edd8cb6e247728e94af' } };
    const res = await axios.get('http://api.weatherbit.io/v2.0/current', config);
    resData = res.data.data[0]
    return resData
};

// Current city background image function
const bgImage = async () => {
    const searchCity = document.querySelector('#search').value;

    const config = { params: { client_id: 'hpthTi3lgM1vdtMHcfvAiW-hFUjaLHYCSAtG4y-Er-I', query: searchCity } };
    const res = await axios.get('https://api.unsplash.com/search/photos', config);
    resData = res.data.results[0].urls.full;
    return resData
};





