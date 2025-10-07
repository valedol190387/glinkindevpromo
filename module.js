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

// Kinescope Player Integration for Timecodes
let kinescopePlayer = null;
let currentVideoTime = 0;

// Load Kinescope API script
function loadKinescopeAPI() {
    return new Promise((resolve, reject) => {
        if (window.Kinescope) {
            resolve(window.Kinescope);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://player.kinescope.io/latest/iframe.player.js';
        script.async = true;

        script.onload = () => {
            const checkAPI = setInterval(() => {
                if (window.Kinescope) {
                    clearInterval(checkAPI);
                    resolve(window.Kinescope);
                }
            }, 100);
        };

        script.onerror = () => {
            reject(new Error('Failed to load Kinescope API'));
        };

        document.head.appendChild(script);
    });
}

// Convert timecode string to seconds
function timecodeToSeconds(timecode) {
    const parts = timecode.split(':');
    if (parts.length === 2) {
        // MM:SS
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
        // HH:MM:SS
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return 0;
}

// Initialize Kinescope player
async function initKinescopePlayer() {
    try {
        const Kinescope = await loadKinescopeAPI();

        // Get the iframe element
        const iframe = document.querySelector('.video-container iframe');
        if (!iframe) return;

        // Create player instance from existing iframe
        kinescopePlayer = await Kinescope.IframePlayer.create(iframe);

        // Listen to time updates
        kinescopePlayer.on('timeupdate', (event) => {
            currentVideoTime = event.data.currentTime || 0;
            updateActiveTimecode(currentVideoTime);
        });

        // Add click handlers to timecode items
        const timecodeItems = document.querySelectorAll('.timecode-item');
        timecodeItems.forEach(item => {
            item.addEventListener('click', () => {
                const timecode = item.getAttribute('data-time');
                const seconds = timecodeToSeconds(timecode);

                if (kinescopePlayer) {
                    kinescopePlayer.seekTo(seconds);
                    kinescopePlayer.play();
                }
            });
        });

    } catch (error) {
        console.error('Error initializing Kinescope player:', error);
    }
}

// Update active timecode based on current video time
function updateActiveTimecode(currentTime) {
    const timecodeItems = document.querySelectorAll('.timecode-item');
    let activeItem = null;

    timecodeItems.forEach(item => {
        const timecode = item.getAttribute('data-time');
        const timeInSeconds = timecodeToSeconds(timecode);

        item.classList.remove('active');

        // Check if current time is within this timecode range
        if (currentTime >= timeInSeconds) {
            activeItem = item;
        }
    });

    // Highlight the active timecode
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Initialize player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only init if we're on a page with video
    const videoContainer = document.querySelector('.video-container iframe');
    if (videoContainer) {
        initKinescopePlayer();
    }
});

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
