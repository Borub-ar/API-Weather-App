const blurLayer = document.querySelector('.blur_layer');
const slidesPanel = document.querySelector('.slides_panel');
const slides = document.querySelectorAll('.single_slide');
const slideBtnsBox = document.querySelector('.slide_buttons');
const slideBtns = document.querySelectorAll('.slide_btn');
const closeBtn = document.querySelector('.close_btn');


// Positioning slides
const positionSlides = () => {
  slides.forEach((slide, i) => (slide.style.left = `${i * 100}%`));
};

positionSlides();

// Update slides informations
const updateDetaleInfo = apiData => {
  const slideInfo = document.querySelectorAll('.single_slide_info');

  slideInfo.forEach((day, i) => {
    day.children[0].textContent = apiData[i + 1].datetime.substr(5).replace('-', '.');
    day.children[1].children[0].src = `https://www.weatherbit.io/static/img/icons/${apiData[i + 1].weather.icon}.png`;
    day.children[2].textContent = apiData[i + 1].weather.description;
    day.children[3].textContent = `${apiData[i + 1].temp} ºC`;
    day.children[4].children[0].textContent = apiData[i + 1].clouds;
    day.children[5].children[0].textContent = apiData[i + 1].vis;
    day.children[6].children[0].textContent = apiData[i + 1].wind_cdir_full;
    day.children[7].children[0].textContent = apiData[i + 1].wind_spd;
    day.children[8].children[0].textContent = apiData[i + 1].pres;
    day.children[9].children[0].textContent = apiData[i + 1].low_temp;
    day.children[10].children[0].textContent = apiData[i + 1].high_temp;
    day.children[11].children[0].textContent = apiData[i + 1].snow_depth;
  });
};

// Show / hide - single day information panel
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
for (const [index, day] of days.entries()) {
  day.addEventListener('click', () => {
    showPanel(index);
    currentSlidePosition = index * 100;

    setActiveBtn(index * 100);
  });
}

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
