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

// Kinescope Player Integration for Timecodes - Using postMessage API
let kinescopeIframe = null;
let currentVideoTime = 0;
let isPlayerReady = false;

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

// Send command to Kinescope player via postMessage
function sendPlayerCommand(action, value) {
    if (!kinescopeIframe || !kinescopeIframe.contentWindow) {
        console.error('Iframe not ready');
        return;
    }

    const message = {
        method: action,
        value: value
    };

    console.log('Sending command to player:', message);
    kinescopeIframe.contentWindow.postMessage(JSON.stringify(message), '*');
}

// Listen to messages from Kinescope player
function setupPlayerMessageListener() {
    window.addEventListener('message', (event) => {
        try {
            const data = JSON.parse(event.data);

            if (data.event === 'ready') {
                isPlayerReady = true;
                console.log('Player is ready!');
            }

            if (data.event === 'timeupdate' && data.data) {
                currentVideoTime = data.data.currentTime || 0;
                updateActiveTimecode(currentVideoTime);
            }
        } catch (e) {
            // Not a valid JSON message, ignore
        }
    });
}

// Initialize Kinescope player with postMessage API
function initKinescopePlayer() {
    // Get the iframe element by ID
    kinescopeIframe = document.getElementById('kinescope-player');

    if (!kinescopeIframe) {
        console.error('Kinescope iframe not found');
        return;
    }

    console.log('Kinescope iframe found, setting up...');

    // Setup message listener
    setupPlayerMessageListener();

    // Wait for iframe to load
    const checkReady = () => {
        if (kinescopeIframe.contentWindow) {
            console.log('Iframe loaded, requesting ready state...');
            // Request ready event
            sendPlayerCommand('addEventListener', 'ready');
            sendPlayerCommand('addEventListener', 'timeupdate');

            setTimeout(() => {
                isPlayerReady = true;
                console.log('Player assumed ready after timeout');
            }, 2000);
        }
    };

    if (kinescopeIframe.contentWindow) {
        setTimeout(checkReady, 1000);
    } else {
        kinescopeIframe.addEventListener('load', () => setTimeout(checkReady, 500));
    }

    // Add click handlers to timecode items
    const timecodeItems = document.querySelectorAll('.timecode-item');
    console.log(`Found ${timecodeItems.length} timecode items`);

    timecodeItems.forEach(item => {
        item.addEventListener('click', () => {
            const timecode = item.getAttribute('data-time');
            const seconds = timecodeToSeconds(timecode);

            console.log(`Clicking timecode: ${timecode} (${seconds} seconds)`);

            if (!isPlayerReady) {
                console.warn('Player might not be ready yet, trying anyway...');
            }

            // Seek to time
            sendPlayerCommand('seekTo', seconds);

            // Play video
            setTimeout(() => {
                sendPlayerCommand('play');
            }, 300);
        });
    });
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
    const videoContainer = document.getElementById('kinescope-player');
    if (videoContainer) {
        console.log('Found video container, initializing player with postMessage API...');
        initKinescopePlayer();
    } else {
        console.log('No video container found on this page');
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
