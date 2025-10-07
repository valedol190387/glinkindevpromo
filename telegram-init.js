// Telegram WebApp initialization - runs immediately on all pages
(function() {
    console.log('Telegram init script loaded');

    // Initialize as soon as possible
    function initTelegram() {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;

            console.log('Telegram WebApp detected');
            console.log('Current state - isExpanded:', tg.isExpanded, 'viewportHeight:', tg.viewportHeight);

            // Ready the app
            tg.ready();

            // Expand immediately
            tg.expand();
            console.log('Called tg.expand()');

            // Request fullscreen if available
            if (typeof tg.requestFullscreen === 'function') {
                tg.requestFullscreen();
                console.log('Called tg.requestFullscreen()');
            } else {
                console.log('tg.requestFullscreen() not available');
            }

            // Log events
            tg.onEvent('viewportChanged', (data) => {
                console.log('Viewport changed:', data);
            });

            tg.onEvent('fullscreenChanged', () => {
                console.log('Fullscreen changed, isFullscreen:', tg.isFullscreen);
            });

            tg.onEvent('fullscreenFailed', (error) => {
                console.error('Fullscreen failed:', error);
            });

        } else {
            console.log('Not running in Telegram WebApp');
        }
    }

    // Try immediately
    initTelegram();

    // Also try when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTelegram);
    }
})();
