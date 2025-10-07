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
                // Already on products page
                break;
            case 'profile':
                window.location.href = 'profile.html';
                break;
        }
    });
});

// Product cards click handlers
const productCards = {
    'clubCard': {
        title: 'Женский онлайн-клуб Glinkin',
        url: 'https://glinkinwellness.ru'
    },
    'recoveryCard': {
        title: 'Восстановление после родов',
        url: 'https://glinkinwellness.ru/vostanovlenieposlerodov'
    },
    'foodCard': {
        title: 'Healthy FOOD',
        url: 'https://glinkinwellness.ru/healthyfood'
    }
};

Object.keys(productCards).forEach(cardId => {
    const card = document.getElementById(cardId);
    const button = card.querySelector('.product-info-button');

    if (button) {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const product = productCards[cardId];

            // Mock action - in production would open external link
            alert(`Переход на страницу:\n${product.title}\n\n${product.url}`);

            // Uncomment to actually open link:
            // window.open(product.url, '_blank');
        });
    }

    // Make entire card clickable
    card.addEventListener('click', () => {
        const product = productCards[cardId];
        alert(`Подробнее о:\n${product.title}\n\n${product.url}`);

        // Uncomment to actually open link:
        // window.open(product.url, '_blank');
    });
});
