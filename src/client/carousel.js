const blurLayer = document.querySelector('.blur_layer');
const slidesPanel = document.querySelector('.slides_panel');
const slides = document.querySelectorAll('.single_slide');
const slideBtnsBox = document.querySelector('.slide_buttons');
const slideBtns = document.querySelectorAll('.slide_btn');
const closeBtn = document.querySelector('.close_btn');

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
