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
