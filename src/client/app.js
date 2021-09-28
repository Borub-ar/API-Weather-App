'use strict';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import axios from 'axios';

const currentDate = document.querySelector('.date');
const searchCity = document.querySelector('#search_input');
const errorMessage = document.querySelector('.error_message');
const sevenDaysPanel = document.querySelector('.seven_days_container');
const hourForecastPanel = document.querySelector('.hourly_forecast');
const menu = document.querySelector('.bottom_menu');
const sevenDaysBtn = document.querySelector('.seven_days_switch');
const hourlyBtn = document.querySelector('.hours_switch');
const notLetters = document.querySelectorAll('.not_letter');
///////
const blurLayer = document.querySelector('.blur_layer');
const slidesPanel = document.querySelector('.slides_panel');
const slides = document.querySelectorAll('.single_slide');
const slideBtnsBox = document.querySelector('.slide_buttons');
const slideBtns = document.querySelectorAll('.slide_btn');
const closeBtn = document.querySelector('.close_btn');



const APIkeys = new Map([
  ['weather', '6dab4492661c4890874829ab94d23fed'],
  ['background', 'hpthTi3lgM1vdtMHcfvAiW-hFUjaLHYCSAtG4y-Er-I'],
]);

export const getSevenDaysWeather = async () => {
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

export const getCurrentWeather = async () => {
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

export const getHourlyForecast = async () => {
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
    return res.data.data;
  } catch (err) {
    console.log(err);
  }
};

export const getBgImage = async () => {
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


















// Set current date
const date = new Date();
const timeElapsed = Date.now();
const today = new Date(timeElapsed);
currentDate.textContent = today.toLocaleDateString();

const expandMenu = () => {
  const searchBar = document.querySelector('.search_bar');
  menu.style.display = 'flex';
  menu.style.transform = 'scale(1)';
  searchBar.style.borderRadius = '0';
};

// Making slides
const makeSlide = (APICityPhoto, APICityInfo) => {
  const container = document.querySelector('.image_container');

  const html = `
    <div class="city_photo slide_right slide_in" style="background-image: url(${APICityPhoto})">
        <div class="city_info">
            <p class="temp">${APICityInfo.temp} ºC</p>
            <img class="current_weather_icon" src="https://www.weatherbit.io/static/img/icons/${APICityInfo.weather.icon}.png">
            <p class="weather_descr">${APICityInfo.weather.description}</p>
            <div class="d_flex">
                <p class="sunrise">Sunrise: ${APICityInfo.sunrise}</p>
                <p class="sunset">Sunrise: ${APICityInfo.sunset}</p>
            </div>
        </div>
        <div class="city_name">
            <p class="ct_name">${APICityInfo.city_name}</p>
        </div>
    </div>
    `;

  container.insertAdjacentHTML('beforeend', html);
};

const handleWeekForecast = APIData => {
  sevenDaysPanel.innerHTML = '';

  APIData.forEach((day, i) => {
    if (i === 0) return;
    const dateTimeData = day.datetime.substr(5).replace('-', '.');
    const dateTime = dateTimeData.startsWith(0) ? dateTimeData.substr(1) : dateTimeData;
    const imgSource = `https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`;

    const html = `
            <div class="day">
              <p>${dateTime}</p>
              <img src="${imgSource}" alt="Temperature Icon" />
              <p class="day_temp"><span>${day.temp}</span> ºC</p>
            </div>
      `;
    sevenDaysPanel.insertAdjacentHTML('beforeend', html);
  });
  showSevenDaysIcon();
};

const removeNotification = () => {
  notLetters.forEach(lett => {
    lett.style.opacity = '0';
  });
};

// Seven days forecast cards animation
const showSevenDaysIcon = () => {
  const days = document.querySelectorAll('.day');

  for (let i = 0; i < days.length; i++) {
    setTimeout(() => {
      days[i].style.transform = 'scale(1)';
    }, i * 300);
  }
};

// Hourly forecast in searched city
// const makeHourlyIcons = dataAPI => {
//   hourForecastPanel.innerHTML = '';
//   dataAPI.forEach(hour => {
//     const html = `
//         <div class="weather_card">
//             <p>${hour.datetime.substr(11)}:00</p>
//             <img src="https://www.weatherbit.io/static/img/icons/${hour.weather.icon}.png">
//             <p class="day_temp">${hour.temp} ºC</p>
//         </div>        
//         `;

//     hourForecastPanel.insertAdjacentHTML('beforeend', html);
//   });
// };



const showButtons = () => {
  sevenDaysBtn.style.transform = `scale(1)`;
  hourlyBtn.style.transform = `scale(1)`;
};

const pushSlidesLeft = () => {
  const slides = document.querySelectorAll('.city_photo');
  slides.forEach(slide => slide.classList.add('slide_out'));
};

const showErrorMessage = () => {
  errorMessage.classList.remove('hide_error');
  errorMessage.classList.add('show_error');
};

const hideErrorMessage = () => {
  errorMessage.classList.remove('show_error');
  errorMessage.classList.add('hide_error');
};

// Weather request
const makeRequest = async () => {
  if (!searchCity.value) return;

  const currentWeather = await getCurrentWeather();

  if (!currentWeather) return;

  removeNotification();
  hideErrorMessage();
  expandMenu();

  const backgroundPhoto = await getBgImage();
  // const hourlyForecast = await getHourlyForecast();
  const sevenForecast = await getSevenDaysWeather();

  handleWeekForecast(sevenForecast);
  updateDetaleInfo(sevenForecast);

  // makeHourlyIcons(hourlyForecast);
  showButtons();
  pushSlidesLeft();
  makeSlide(backgroundPhoto, currentWeather);

  searchCity.value = '';
  searchCity.blur();
};

window.addEventListener('keydown', e => {
  e.code === 'Enter' && makeRequest();
});

document.querySelector('.search_button').addEventListener('click', makeRequest);

// Toggle forecast type
sevenDaysBtn.addEventListener('click', () => {
  sevenDaysPanel.style.transform = 'translate(-50%)';
  hourForecastPanel.style.transform = 'translate(0, 100%)';
});

hourlyBtn.addEventListener('click', () => {
  sevenDaysPanel.style.transform = 'translate(-50%, 400%)';
  hourForecastPanel.style.transform = 'translate(0)';
});

























const positionSlides = () => {
  slides.forEach((slide, i) => (slide.style.left = `${i * 100}%`));
};

positionSlides();

const updateDetaleInfo = APIData => {
  slidesPanel.innerHTML = '';

  APIData.forEach((day, i) => {
    if (i === 0) return;
    const dateTime = day.datetime.substr(5).replace('-', '.');
    const weatherIcon = `https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`;

    const html = `
        <div class="single_slide">
          <ul class="single_slide_info">
            <li class="day_date">${dateTime}</li>
            <li><img src="${weatherIcon}" alt="weather icon" /></li>
            <li class="detale_weather">${day.weather.description}</li>
            <li class="slide_day_temp"><span>${day.temp}</span>ºC</li>
            <li>Cloud coverage: <span>${day.clouds}</span>%</li>
            <li>Visibility: <span>${day.vis}</span> km</li>
            <li>Wind direction: <span>${day.wind_cdir_full}</span></li>
            <li>Wind speed: <span>${day.wind_spd}</span> m/s</li>
            <li>Preasure: <span>${day.pres}</span> mb</li>
            <li>Min. temp: <span>${day.low_temp}</span> ºC</li>
            <li>Max. temp: <span>${day.high_temp}</span> ºC</li>
            <li>Snow deph: <span>${day.snow_depth}</span> mm</li>
          </ul>
        </div>
    `;

    slidesPanel.insertAdjacentHTML('beforeend', html);
  });
};

const showPanel = cardIndex => {
  blurLayer.style.display = 'block';
  blurLayer.style.backgroundColor = 'rgba(0, 0, 0, 0.342)';
  slidesPanel.style.width = '100%';
  slideBtnsBox.style.display = 'flex';

  for (const child of slidesPanel.children) {
    if (!child.classList.contains('close_btn')) {
      child.style.transition = `opacity .2s ease-in-out, transform 1s ease-in-out`;
    }
    child.style.opacity = 1;
  }

  // Moving to chosen day
  for (const slide of slides) {
    slide.classList.add('single_day');
    slide.style.transform = `translate(-${cardIndex * 100}%)`;
  }
};

const hidePanel = () => {
  for (const child of slidesPanel.children) {
    child.style.opacity = 0;
  }

  slidesPanel.style.width = '0';
  blurLayer.style.display = 'none';
  slideBtnsBox.style.display = 'none';
};

const moveSlide = slides => {
  slides.forEach(slide => {
    slide.style.transform = `translate(-${currentSlidePosition}%)`;
  });
};

const moveSlideLeft = () => {
  if (currentSlidePosition > -100) currentSlidePosition -= 100;
  if (currentSlidePosition === -100) currentSlidePosition = 600;

  moveSlide(slides);

  setActiveBtn(currentSlidePosition);
};

const moveSlideRight = () => {
  if (currentSlidePosition < 700) currentSlidePosition += 100;
  if (currentSlidePosition === 700) currentSlidePosition = 0;

  moveSlide(slides);

  setActiveBtn(currentSlidePosition);
};

let currentSlidePosition;

// Add event listener to seven days forecast cards / click = show Panel
// for (const [index, day] of days.entries()) {
//   day.addEventListener('click', () => {
//     showPanel(index);
//     currentSlidePosition = index * 100;

//     setActiveBtn(index * 100);
//   });
// }

// Single day slide animation #1
window.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft') moveSlideLeft();
  if (e.code === 'ArrowRight') moveSlideRight();
});

// Single day slide animation #2
slideBtnsBox.addEventListener('click', e => {
  if (e.target.classList.contains('slide_btn')) {
    slides.forEach(s => {
      s.style.transform = `translate(-${e.target.dataset.slide * 100}%)`;
      currentSlidePosition = e.target.dataset.slide * 100;
    });

    setActiveBtn(currentSlidePosition);
  }
});

const setActiveBtn = position => {
  slideBtns.forEach(btn => {
    btn.classList.remove('slide_btn_active');
  });

  slideBtns[position / 100].classList.add('slide_btn_active');
};

// Single day slide animation #3
const slideBtnLeft = document.querySelector('.slide_left_btn');
const slideBtnRight = document.querySelector('.slide_right_btn');

slideBtnLeft.addEventListener('click', moveSlideLeft);
slideBtnRight.addEventListener('click', moveSlideRight);

// hide information panel
closeBtn.addEventListener('click', hidePanel);
blurLayer.addEventListener('click', hidePanel);
window.addEventListener('keydown', e => {
  e.code === 'Escape' && hidePanel();
});







