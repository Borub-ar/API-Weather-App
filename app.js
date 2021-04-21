// Aside menu toggle
const toggleBtn = document.querySelector('.toggle_btn');

toggleBtn.addEventListener('click', () => {
    const asideNav = document.querySelector('.aside_nav');
    asideNav.classList.toggle('aside_show');
});