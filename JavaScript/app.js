'use strict';

// Global variables 
const sevenDaysPanel = document.querySelector('.seven_container');
const days = document.querySelectorAll('.day');
const hourForecastPanel = document.querySelector('.hourly_forecast');
const currentDate = document.querySelector('.date');
const menu = document.querySelector('.bottom_menu');

const sevenDaysBtn = document.querySelector('.seven_days');
const hourlyBtn = document.querySelector('.hours');
const slideBtns = document.querySelectorAll('.btn')

const blurLayer = document.querySelector('.blur_layer')
const dayInfoPanel = document.querySelector('.day_info_panel');
const singleDayPanel = document.querySelectorAll('.s_day');
const slideBtnsCon = document.querySelector('.slide_buttons');






// Set current date
const date = new Date();
const timeElapsed = Date.now();
const today = new Date(timeElapsed);
currentDate.textContent = today.toLocaleDateString();






// Bottom menu unfolding animation
const menuAnimation = () => {
    const searchBar = document.querySelector('.search');

    menu.style.transform = 'scale(1)';
    searchBar.style.borderRadius = '0';
}




// Seven days forecast 
const updateSingleDayInfo = (apiData) => {
    const ulDayInfo = document.querySelectorAll('.ul_single_day');

    for (const [index, day] of ulDayInfo.entries()) {
        day.children[0].textContent = apiData[index + 1].datetime.substr(5).replace('-', '.');
        day.children[1].children[0].src = `https://www.weatherbit.io/static/img/icons/${apiData[index + 1].weather.icon}.png`;
        day.children[2].textContent = apiData[index + 1].weather.description;
        day.children[3].textContent = `${apiData[index + 1].temp} ºC`;
        day.children[4].children[0].textContent = apiData[index + 1].clouds;
        day.children[5].children[0].textContent = apiData[index + 1].vis;
        day.children[6].children[0].textContent = apiData[index + 1].wind_cdir_full;
        day.children[7].children[0].textContent = apiData[index + 1].wind_spd;
        day.children[8].children[0].textContent = apiData[index + 1].pres;
        day.children[9].children[0].textContent = apiData[index + 1].low_temp;
        day.children[10].children[0].textContent = apiData[index + 1].high_temp;
        day.children[11].children[0].textContent = apiData[index + 1].snow_depth;
    }
}





const sevenDayForecast = async () => {
    const dayInfo = await getSevenDaysWeth();

    updateSingleDayInfo(dayInfo)

    for (const [index, day] of days.entries()) {
        day.children[0].textContent = dayInfo[index + 1].datetime.substr(5).replace('-', '.');
        day.children[1].src = `https://www.weatherbit.io/static/img/icons/${dayInfo[index + 1].weather.icon}.png`;
        day.children[2].children[0].textContent = dayInfo[index + 1].temp;
    }
}





// Seven days forecast cards animation
const cardsAnimation = () => {
    for (let i = 0; i < days.length; i++) {
        setTimeout(() => {
            days[i].style.transform = 'scale(1)';
        }, i * 300);
    }
}





// Hourly forecast in searched city
const makeHourlyIcons = dataAPI => {
    for (const hour of dataAPI) {
        const weatherCard = document.createElement('div');
        weatherCard.classList.add('weather_card');
        hourForecastPanel.append(weatherCard);

        const datetime = document.createElement('p');
        datetime.textContent = `${hour.datetime.substr(11)}:00`;

        const weatherIcon = document.createElement('img');
        weatherIcon.src = `https://www.weatherbit.io/static/img/icons/${hour.weather.icon}.png`;

        const weatherTemp = document.createElement('p');
        weatherTemp.classList.add('icon_temp');
        weatherTemp.textContent = `${hour.temp} ºC`;

        weatherCard.append(datetime, weatherIcon, weatherTemp);
    }
}





// Making slides 
const slideIn = (varImage, varInfo) => {
    const container = document.querySelector('.image_container');

    const cityImage = document.createElement('div');
    cityImage.style.backgroundImage = `url(${varImage})`;
    cityImage.classList.add('city_photo', 'slide_right');

    // Left panel
    const leftPanel = document.createElement('div');
    leftPanel.classList.add('city_info');

    const temp = document.createElement('p');
    temp.classList.add('temp');
    temp.textContent = `${varInfo.temp} ºC`;

    const weatherIcon = document.createElement('img');
    weatherIcon.classList.add('current_weather_icon');
    weatherIcon.src = `https://www.weatherbit.io/static/img/icons/${varInfo.weather.icon}.png`;

    const weatherDescr = document.createElement('p');
    weatherDescr.classList.add('weather_descr');
    weatherDescr.textContent = varInfo.weather.description;

    const conFlex = document.createElement('div');
    conFlex.classList.add('d_flex');

    const sunRise = document.createElement('p');
    sunRise.classList.add('sunrise');
    sunRise.textContent = `Sunrise: ${varInfo.sunrise}`;

    const sunSet = document.createElement('p');
    sunSet.classList.add('sunset');
    sunSet.textContent = `Sunset: ${varInfo.sunset}`;

    conFlex.append(sunRise, sunSet);

    leftPanel.append(temp, weatherIcon, weatherDescr, conFlex);

    // Right panel 
    const rightPanel = document.createElement('div');
    rightPanel.classList.add('city_name');

    const name = document.createElement('p');
    name.classList.add('ct_name');
    name.textContent = varInfo.city_name;
    rightPanel.append(name);

    // Append both panels to cityImage
    cityImage.append(leftPanel, rightPanel);

    container.append(cityImage);
    cityImage.classList.add('slide_in');
};







const slideOut = () => {
    const slides = document.querySelectorAll('.city_photo');
    for (const slide of slides) slide.classList.add('slide_out');
}









// Weather request 
const searchCity = document.querySelector('#search');
const searchBtn = document.querySelector('.search_button');

const makeRequest = async () => {
    if (search.value) {
        menu.style.display = 'flex';
        menuAnimation();

        const backgroundPhoto = await getBgImage();
        const cityInf = await getCurrentWeather();
        const hForecast = await getHourlyForecast();
        await sevenDayForecast();

        hourForecastPanel.innerHTML = '';
        makeHourlyIcons(hForecast);

        cardsAnimation();

        sevenDaysBtn.style.transform = `scale(1)`;
        hourlyBtn.style.transform = `scale(1)`;

        slideOut();
        slideIn(backgroundPhoto, cityInf);

        searchCity.value = '';
    }
}

window.addEventListener('keydown', e => {
    e.code === 'Enter' && makeRequest();
})

searchBtn.addEventListener('click', () => {
    makeRequest();
})










// Toggle forecast type
sevenDaysBtn.addEventListener('click', () => {
    sevenDaysPanel.style.transform = 'translate(-50%)';
    hourForecastPanel.style.transform = 'translate(0, 100%)';
})

hourlyBtn.addEventListener('click', () => {
    sevenDaysPanel.style.transform = 'translate(-50%, 400%)';
    hourForecastPanel.style.transform = 'translate(0)';
})




















// Show / hide - single day information panel
const showPanel = (cardIndex) => {
    blurLayer.style.display = 'block';
    blurLayer.style.backgroundColor = 'rgba(0, 0, 0, 0.342)';
    dayInfoPanel.style.width = '100%';
    slideBtnsCon.style.display = 'flex';

    // Moving to chosen day
    for (const singleDay of singleDayPanel) {
        singleDay.classList.add('single_day');
        singleDay.style.transform = `translate(-${cardIndex * 100}%)`;
    }
}


const hidePanel = () => {
    dayInfoPanel.style.width = '0';
    blurLayer.style.display = 'none';
    slideBtnsCon.style.display = 'none';
}

// Positioning slides
for (const [index, day] of singleDayPanel.entries()) day.style.left = `${index * 100}%`;


// Slide key left right moving
// Add click listener to seven days panel
// show panel

let currentSlidePosition;

for (const [index, day] of days.entries()) {
    day.addEventListener('click', () => {
        showPanel(index);
        currentSlidePosition = index * 100;
    })
}

// Single day slide animation #1
window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') {
        if (currentSlidePosition > 0) currentSlidePosition -= 100;

        for (const day of singleDayPanel) {
            day.style.transform = `translate(-${currentSlidePosition}%)`;
        }
    }

    if (e.code === 'ArrowRight') {
        if (currentSlidePosition < 600) currentSlidePosition += 100;

        for (const day of singleDayPanel) {
            day.style.transform = `translate(-${currentSlidePosition}%)`;
        }
    }
})

// Single day slide animation #2
for (const [index, btn] of slideBtns.entries()) {
    btn.addEventListener('click', () => {
        for (const day of singleDayPanel) {
            day.style.transform = `translate(-${index * 100}%)`;
            currentSlidePosition = index * 100;
        }
    })
}
// Single day slide animation #3 
const slideBtnLeft = document.querySelector('.slide_left_btn');
const slideBtnRight = document.querySelector('.slide_right_btn');

// To musi być zamienione w funkcje ponieważ się powtarza ze strzałkami
slideBtnLeft.addEventListener('click', () => {
    if (currentSlidePosition > 0) currentSlidePosition -= 100;

    for (const day of singleDayPanel) {
        day.style.transform = `translate(-${currentSlidePosition}%)`;
    }
})

slideBtnRight.addEventListener('click', () => {
    if (currentSlidePosition < 600) currentSlidePosition += 100;

    for (const day of singleDayPanel) {
        day.style.transform = `translate(-${currentSlidePosition}%)`;
    }
})




// hide pop up panel
blurLayer.addEventListener('click', hidePanel);
window.addEventListener('keydown', e => {
    e.code === 'Escape' && hidePanel();
})