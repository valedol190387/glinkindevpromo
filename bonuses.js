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
                // Already on bonuses page
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

// Bonus cards click handlers
const bonusCards = document.querySelectorAll('.bonus-card');

bonusCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();

        const title = card.querySelector('.bonus-title').textContent;
        const type = card.getAttribute('data-type');

        // Mock action - show alert for now
        // In production, this would link to actual PDFs, documents, or external resources
        switch(type) {
            case 'checklist':
                alert(`📋 Скачивание: ${title}\n\nФайл будет загружен в формате PDF.`);
                break;
            case 'document':
                alert(`📄 Открытие: ${title}\n\nДокумент откроется в новой вкладке.`);
                break;
            case 'external':
                alert(`🔗 Переход: ${title}\n\nВы будете перенаправлены на внешний ресурс.`);
                break;
            default:
                alert(`Открытие: ${title}`);
        }
    });
});
