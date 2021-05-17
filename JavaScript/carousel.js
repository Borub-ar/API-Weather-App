// Positioning slides
for (const [index, slide] of slides.entries()) slide.style.left = `${index * 100}%`;



// Show / hide - single day information panel
const showPanel = (cardIndex) => {
    // const panel = document.querySelector('.day_info_panel');

    blurLayer.style.display = 'block';
    blurLayer.style.backgroundColor = 'rgba(0, 0, 0, 0.342)';
    slidesPanel.style.width = '100%';
    slideBtnsBox.style.display = 'flex';

    for (const child of slidesPanel.children) {
        child.style.opacity = 1;
        child.style.transition = `opacity .2s ease-in-out, transform 1s ease-in-out`;
    }

    // Moving to chosen day
    for (const slide of slides) {
        slide.classList.add('single_day');
        slide.style.transform = `translate(-${cardIndex * 100}%)`;
    }
}



const hidePanel = () => {
    // const panel = document.querySelector('.day_info_panel');

    for (const child of slidesPanel.children) {
        child.style.opacity = 0;
    }

    slidesPanel.style.width = '0';
    blurLayer.style.display = 'none';
    slideBtnsBox.style.display = 'none';
}



const moveSlideLeft = () => {
    if (currentSlidePosition > 0) currentSlidePosition -= 100;

    for (const slide of slides) {
        slide.style.transform = `translate(-${currentSlidePosition}%)`;
    }
}

const moveSlideRight = () => {
    if (currentSlidePosition < 600) currentSlidePosition += 100;

    for (const slide of slides) {
        slide.style.transform = `translate(-${currentSlidePosition}%)`;
    }
}



let currentSlidePosition;

// Add event listener to seven days forecast cards / click = show Panel
for (const [index, day] of days.entries()) {
    day.addEventListener('click', () => {
        showPanel(index);
        currentSlidePosition = index * 100;
    })
}



// Single day slide animation #1
window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') {
        moveSlideLeft();
    }

    if (e.code === 'ArrowRight') {
        moveSlideRight();
    }
})

// Single day slide animation #2
for (const [index, btn] of slideBtns.entries()) {
    btn.addEventListener('click', () => {
        for (const day of slides) {
            day.style.transform = `translate(-${index * 100}%)`;
            currentSlidePosition = index * 100;
        }
    })
}

// Single day slide animation #3 
const slideBtnLeft = document.querySelector('.slide_left_btn');
const slideBtnRight = document.querySelector('.slide_right_btn');

slideBtnLeft.addEventListener('click', () => {
    moveSlideLeft();
})

slideBtnRight.addEventListener('click', () => {
    moveSlideRight();
})



// hide pop up panel
const closeBtn = document.querySelector('.close_btn')

closeBtn.addEventListener('click', hidePanel)
blurLayer.addEventListener('click', hidePanel);
window.addEventListener('keydown', e => {
    e.code === 'Escape' && hidePanel();
})