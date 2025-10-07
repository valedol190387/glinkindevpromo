// Get module index from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const moduleIndex = parseInt(urlParams.get('module')) || 0;

// Module data (same as in script.js)
const moduleData = [
    {
        number: 1,
        title: 'Селезёнка',
        subtitle: 'Мать всех органов'
    },
    {
        number: 2,
        title: 'Желудок',
        subtitle: 'Ворота энергии'
    },
    {
        number: 3,
        title: 'Печень',
        subtitle: 'Главный фильтр и дирижёр гормонов'
    },
    {
        number: 4,
        title: 'Желчный пузырь',
        subtitle: 'Поток и движение'
    },
    {
        number: 5,
        title: 'Поджелудочная',
        subtitle: 'Баланс сахара и энергии'
    },
    {
        number: 6,
        title: 'Кишечник',
        subtitle: 'Вторая вселенная внутри нас'
    }
];

// Update page content based on module
const module = moduleData[moduleIndex];
if (module) {
    document.getElementById('moduleTitle').textContent = module.title;
    document.getElementById('moduleName').textContent = `Модуль №${module.number}: ${module.title}`;
}

// For now, all modules show the same content (mock data)
// In the future, you can customize content per module

// Bottom Navigation
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const page = item.getAttribute('data-page');

        // Update active state
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Navigate to page
        switch(page) {
            case 'index':
                window.location.href = 'index.html';
                break;
            case 'calendar':
                window.location.href = 'calendar.html';
                break;
            case 'bonuses':
                window.location.href = 'bonuses.html';
                break;
            case 'products':
                window.location.href = 'products.html';
                break;
            case 'profile':
                window.location.href = 'profile.html';
                break;
        }
    });
});
