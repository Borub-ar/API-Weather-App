// Aside menu toggle
const toggleBtn = document.querySelector('.toggle_btn');

toggleBtn.addEventListener('click', () => {
    const asideNav = document.querySelector('.aside_nav');
    asideNav.classList.toggle('aside_show');
});

// Current weather call 
window.addEventListener('keydown', async (e) => {
    if (e.code === 'Enter') {
        const inf = await currentWeather();
        console.log(inf.data.data[0]);
    };
});

const searchBtn = document.querySelector('.search_button')

searchBtn.addEventListener('click', async () => {
    const inf = await currentWeather();
    console.log(inf.data.data[0]);
});



const currentWeather = async () => {
    const searchCity = document.querySelector('#search').value;

    const config = { params: { city: searchCity, key: '4c1299c9ae164edd8cb6e247728e94af' } };
    const res = await axios.get('http://api.weatherbit.io/v2.0/current', config);

    return res
};





