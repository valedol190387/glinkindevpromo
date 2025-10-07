// Toggle sections
function toggleSection(cardId, contentId) {
    const card = document.getElementById(cardId);
    const content = document.getElementById(contentId);

    card.addEventListener('click', (e) => {
        // Ignore clicks on buttons and inputs
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        const isActive = card.classList.contains('active');

        // Close all sections
        document.querySelectorAll('.section-card').forEach(c => {
            c.classList.remove('active');
        });
        document.querySelectorAll('.section-content').forEach(c => {
            c.style.display = 'none';
        });

        // Toggle current section
        if (!isActive) {
            card.classList.add('active');
            content.style.display = 'block';
        }
    });
}

// Initialize toggles
toggleSection('helpCard', 'helpContent');
toggleSection('paymentsCard', 'paymentsContent');
toggleSection('systemCard', 'systemContent');

// Help form submit
document.querySelector('.submit-button').addEventListener('click', () => {
    const textarea = document.querySelector('.help-textarea');
    const message = textarea.value.trim();

    if (message) {
        alert('Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
        textarea.value = '';
    } else {
        alert('Пожалуйста, опишите вашу проблему или вопрос.');
    }
});

// Copy system info
document.getElementById('copySystemInfo').addEventListener('click', () => {
    const browserInfo = document.getElementById('browserInfo').textContent;
    const osInfo = document.getElementById('osInfo').textContent;
    const deviceInfo = document.getElementById('deviceInfo').textContent;
    const resolutionInfo = document.getElementById('resolutionInfo').textContent;
    const userAgentInfo = document.getElementById('userAgentInfo').textContent;

    const systemData = `
Браузер: ${browserInfo}
ОС: ${osInfo}
Устройство: ${deviceInfo}
Разрешение: ${resolutionInfo}
User Agent: ${userAgentInfo}
    `.trim();

    // Copy to clipboard
    navigator.clipboard.writeText(systemData).then(() => {
        const button = document.getElementById('copySystemInfo');
        const originalText = button.innerHTML;

        button.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Скопировано!
        `;

        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    }).catch(() => {
        alert('Не удалось скопировать данные');
    });
});

// Detect real system info (optional - can replace mock data)
function detectSystemInfo() {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    // You can uncomment these to use real data instead of mock
    // document.getElementById('userAgentInfo').textContent = userAgent;
    // document.getElementById('resolutionInfo').textContent = `${screenWidth}x${screenHeight}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    detectSystemInfo();
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
                // Already on profile page
                break;
        }
    });
});
