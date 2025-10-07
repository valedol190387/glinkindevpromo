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

// Video URL for the module
const VIDEO_URL = "https://kinescope.io/4yRzZsxobzqBeUc711ZPun";

// Load Kinescope API script
let kinescopePromise = null;

function loadKinescopeScript() {
    if (kinescopePromise) return kinescopePromise;

    kinescopePromise = new Promise((resolve, reject) => {
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
            kinescopePromise = null;
            reject(new Error('Failed to load Kinescope script'));
        };

        document.head.appendChild(script);
    });

    return kinescopePromise;
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

// Initialize Kinescope player - connect to existing iframe
async function initKinescopePlayer() {
    try {
        console.log('Loading Kinescope script...');
        const Kinescope = await loadKinescopeScript();
        console.log('Kinescope script loaded successfully');

        // Get the existing iframe
        const iframe = document.getElementById('kinescope-player');
        if (!iframe || !iframe.src) {
            console.error('Iframe not found or has no src');
            return;
        }

        console.log('Connecting to existing iframe with src:', iframe.src);

        // Wait for iframe to load
        await new Promise(resolve => {
            if (iframe.contentWindow) {
                setTimeout(resolve, 1500);
            } else {
                iframe.addEventListener('load', () => setTimeout(resolve, 1000));
            }
        });

        // Connect to existing iframe player
        kinescopePlayer = await Kinescope.IframePlayer.create(iframe);

        console.log('Player connected successfully:', kinescopePlayer);

        // Listen to time updates
        kinescopePlayer.on('timeupdate', (event) => {
            if (event && event.data) {
                currentVideoTime = event.data.currentTime || 0;
                updateActiveTimecode(currentVideoTime);
            }
        });

        kinescopePlayer.on('ready', () => {
            console.log('Player is ready!');
        });

        kinescopePlayer.on('error', (error) => {
            console.error('Player error:', error);
        });

        // Add click handlers to timecode items
        const timecodeItems = document.querySelectorAll('.timecode-item');
        console.log(`Found ${timecodeItems.length} timecode items`);

        timecodeItems.forEach(item => {
            item.addEventListener('click', () => {
                const timecode = item.getAttribute('data-time');
                const seconds = timecodeToSeconds(timecode);

                console.log(`Seeking to: ${timecode} (${seconds} seconds)`);

                if (kinescopePlayer) {
                    kinescopePlayer.seekTo(seconds);
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

// Kinescope Fullscreen handler via postMessage (like colleague's code)
window.addEventListener('message', (event) => {
    if (event.data.type && event.data.type === 'KINESCOPE_PLAYER_FULLSCREEN_CHANGE') {
        const frames = document.getElementsByTagName('iframe');

        for (let i = 0; i < frames.length; i++) {
            if (frames[i].contentWindow === event.source) {
                if (event.data.value) {
                    // Entering fullscreen
                    console.log('Kinescope fullscreen: ENTERING');
                    window.oldFrameStyles = frames[i].style.cssText;

                    frames[i].style.cssText = `
                        background: #000;
                        border: none;
                        position: fixed;
                        z-index: 9999;
                        width: 100%;
                        height: 100%;
                        bottom: 0;
                        right: 0;
                        top: 0;
                        left: 0;
                    `;

                    // Lock orientation to landscape for video
                    try {
                        console.log('Attempting to lock landscape orientation...');

                        // 1. Telegram API for orientation lock
                        if (window.Telegram?.WebApp) {
                            if (window.Telegram.WebApp.toggleOrientationLock) {
                                console.log('Using Telegram toggleOrientationLock');
                                window.Telegram.WebApp.toggleOrientationLock(true);
                            }

                            // Direct postEvent call for older versions
                            try {
                                if (window.TelegramWebviewProxy?.postEvent) {
                                    console.log('Using TelegramWebviewProxy.postEvent for landscape');
                                    window.TelegramWebviewProxy.postEvent('web_app_toggle_orientation_lock', JSON.stringify({locked: true}));
                                } else if (window.parent) {
                                    console.log('Using window.parent.postMessage for landscape');
                                    const data = JSON.stringify({
                                        eventType: 'web_app_toggle_orientation_lock',
                                        eventData: { locked: true }
                                    });
                                    window.parent.postMessage(data, 'https://web.telegram.org');
                                }
                            } catch (e) {
                                console.log('Telegram API fallback failed:', e);
                            }
                        }

                        // 2. Standard Screen Orientation API
                        if (screen.orientation && screen.orientation.lock) {
                            console.log('Using screen.orientation.lock');
                            screen.orientation.lock('landscape-primary').catch(err => {
                                console.log('Primary landscape failed, trying any landscape');
                                screen.orientation.lock('landscape').catch(err2 => {
                                    console.log('All orientation locks failed:', err2);
                                });
                            });
                        }

                        // 3. CSS rotation for portrait mode devices
                        if (window.innerHeight > window.innerWidth) {
                            console.log('Applying CSS rotation for portrait mode');
                            frames[i].style.cssText += `
                                transform: rotate(90deg) !important;
                                transform-origin: center center !important;
                                width: 100vh !important;
                                height: 100vw !important;
                                position: fixed !important;
                                top: 50% !important;
                                left: 50% !important;
                                margin-left: -50vh !important;
                                margin-top: -50vw !important;
                            `;
                        }

                        // 4. Android-specific fixes
                        if (navigator.userAgent.includes('Android')) {
                            console.log('Android detected, applying additional styles');
                            document.body.style.overflow = 'hidden';
                            document.documentElement.style.overflow = 'hidden';
                        }

                    } catch (error) {
                        console.log('Failed to lock orientation:', error);
                    }

                } else {
                    // Exiting fullscreen
                    console.log('Kinescope fullscreen: EXITING');

                    if (window.oldFrameStyles) {
                        frames[i].style.cssText = window.oldFrameStyles;
                    } else {
                        frames[i].style.cssText = '';
                    }

                    // Unlock orientation
                    try {
                        console.log('Unlocking orientation...');

                        // Unlock via Telegram API
                        if (window.Telegram?.WebApp) {
                            if (window.Telegram.WebApp.toggleOrientationLock) {
                                console.log('Unlocking via Telegram API');
                                window.Telegram.WebApp.toggleOrientationLock(false);
                            }

                            try {
                                if (window.TelegramWebviewProxy?.postEvent) {
                                    window.TelegramWebviewProxy.postEvent('web_app_toggle_orientation_lock', JSON.stringify({locked: false}));
                                } else if (window.parent) {
                                    const data = JSON.stringify({
                                        eventType: 'web_app_toggle_orientation_lock',
                                        eventData: { locked: false }
                                    });
                                    window.parent.postMessage(data, 'https://web.telegram.org');
                                }
                            } catch (e) {
                                console.log('Telegram unlock fallback failed:', e);
                            }
                        }

                        // Standard unlock
                        if (screen.orientation && screen.orientation.unlock) {
                            console.log('Unlocking via screen.orientation');
                            screen.orientation.unlock();
                        }

                        // Restore Android styles
                        if (navigator.userAgent.includes('Android')) {
                            document.body.style.overflow = '';
                            document.documentElement.style.overflow = '';
                        }

                    } catch (error) {
                        console.log('Failed to unlock orientation:', error);
                    }
                }
                break;
            }
        }
    }
});

// Fallback fullscreen function for Android
function triggerFullscreen() {
    const iframe = document.getElementById('kinescope-player');
    if (!iframe) return;

    console.log('Triggering fullscreen manually...');

    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    }
}

// Make it available globally for debugging
window.triggerFullscreen = triggerFullscreen;

// Initialize player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only init if we're on a page with video
    const videoContainer = document.getElementById('kinescope-player');
    if (videoContainer) {
        console.log('DOM ready, initializing Kinescope player...');
        initKinescopePlayer();

        // For Android - add double-tap on video container to go fullscreen
        const container = document.querySelector('.video-container');
        let lastTap = 0;

        if (container && /Android/i.test(navigator.userAgent)) {
            console.log('Android detected - adding double-tap fullscreen');
            container.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;

                if (tapLength < 500 && tapLength > 0) {
                    console.log('Double tap detected, triggering fullscreen');
                    triggerFullscreen();
                    e.preventDefault();
                }
                lastTap = currentTime;
            });
        }
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
