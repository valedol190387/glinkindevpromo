// Carousel functionality with infinite loop
class Carousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.originalCards = Array.from(document.querySelectorAll('.carousel-card'));
        this.dots = document.querySelectorAll('.dot');
        this.totalCards = this.originalCards.length;
        this.currentIndex = 0; // Real index (0-5)
        this.visualIndex = 0; // Visual position with clones
        this.cardWidth = 280;
        this.gap = 16;
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.isTransitioning = false;

        this.init();
    }

    init() {
        // Clone all cards for seamless infinite loop
        this.cloneCards();

        // Get all cards including clones
        this.cards = Array.from(this.track.querySelectorAll('.carousel-card'));

        // Start at first real card (after clones)
        this.visualIndex = this.totalCards;
        this.currentIndex = 0;

        // Touch events
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.track.addEventListener('touchend', () => this.handleTouchEnd());

        // Mouse events for desktop testing
        this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.track.addEventListener('mouseup', () => this.handleMouseUp());
        this.track.addEventListener('mouseleave', () => this.handleMouseUp());

        // Click on cards - only open modal for active card
        this.cards.forEach((card) => {
            card.addEventListener('click', (e) => {
                if (!this.isDragging) {
                    // Check if clicked card has active class
                    if (card.classList.contains('active')) {
                        // Get lock icon
                        const lockIcon = card.querySelector('.lock-icon');
                        const isLocked = lockIcon && lockIcon.getAttribute('data-locked') === 'true';

                        if (isLocked) {
                            // Open payment modal
                            this.openModal(this.currentIndex);
                        } else {
                            // Open module content page
                            window.location.href = `module.html?module=${this.currentIndex}`;
                        }
                    }
                }
            });
        });

        // Click on dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Handle transition end for infinite loop
        this.track.addEventListener('transitionend', () => {
            this.handleTransitionEnd();
        });

        // Initial position
        this.updateCarousel(false);
    }

    cloneCards() {
        // Clone all cards and prepend
        this.originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            this.track.appendChild(clone);
        });

        // Clone all cards and append
        this.originalCards.slice().reverse().forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            this.track.insertBefore(clone, this.track.firstChild);
        });
    }

    getRealIndex(visualIndex) {
        // Convert visual index to real card index
        return (visualIndex - this.totalCards + this.totalCards) % this.totalCards;
    }

    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.touches[0].clientX;
    }

    handleTouchEnd() {
        if (!this.isDragging) return;

        const diff = this.startX - this.currentX;
        const threshold = 80; // Increased threshold to prevent accidental swipes

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.next();
            } else {
                // Swipe right - previous slide
                this.prev();
            }
        }

        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
    }

    next() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex = (this.currentIndex + 1) % this.totalCards;
        this.visualIndex++;
        this.updateCarousel(true);
    }

    prev() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
        this.visualIndex--;
        this.updateCarousel(true);
    }

    handleTransitionEnd() {
        this.isTransitioning = false;

        // Reset position if we're at cloned cards
        if (this.visualIndex >= this.totalCards * 2) {
            this.visualIndex = this.totalCards;
            this.updateCarousel(false);
        } else if (this.visualIndex < this.totalCards) {
            this.visualIndex = this.totalCards * 2 - 1;
            this.updateCarousel(false);
        }
    }

    handleMouseDown(e) {
        this.startX = e.clientX;
        this.isDragging = true;
        this.track.style.cursor = 'grabbing';
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.clientX;
    }

    handleMouseUp() {
        // Just reset, no navigation on mouse click - only touch swipes work
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.track.style.cursor = 'grab';
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const diff = index - this.currentIndex;
        this.currentIndex = index;
        this.visualIndex += diff;

        this.updateCarousel(true);
    }

    updateCarousel(withTransition = true) {
        // Update active card
        this.cards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === this.visualIndex) {
                card.classList.add('active');
            }
        });

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === this.currentIndex) {
                dot.classList.add('active');
            }
        });

        // Calculate transform
        const offset = -(this.visualIndex * (this.cardWidth + this.gap));

        if (withTransition) {
            this.track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            this.track.style.transition = 'none';
        }

        this.track.style.transform = `translateX(${offset}px)`;
    }

    openModal(cardIndex) {
        // Set current module for purchase
        if (window.setCurrentModuleForPurchase) {
            window.setCurrentModuleForPurchase(cardIndex);
        }

        const moduleData = [
            {
                title: 'Селезёнка',
                subtitle: 'Мать всех органов',
                description: `В древней восточной медицине селезёнка считается главным органом, который отвечает за то, как мы получаем энергию из пищи и как эта энергия питает всё тело.

Западная наука подтверждает: селезёнка участвует в иммунной системе и кроветворении. Когда селезёнка сильная — у нас достаточно сил, хорошее пищеварение, ясная голова и стабильное настроение.

<strong>Симптомы слабой селезёнки:</strong>
• Постоянная усталость, даже после сна
• Тяжесть после еды, вздутие живота
• Склонность к жидкому стулу или диарее
• Отёки и чувство «воды в теле»
• Снижение мышечного тонуса
• Снижение концентрации, тревожность
• Синяки и кровоточивость
• Холодные руки и ноги

<strong>Селезёнка влияет на:</strong>
• Энергию — извлекает энергию из пищи
• Кровь и сосуды — предотвращает кровотечения
• Иммунитет — защищает от вирусов и бактерий
• Пищеварение — поддерживает ЖКТ
• Эмоции — помогает «переваривать» мысли

<strong>Зачем восстанавливать селезёнку:</strong>
Потому что именно с неё начинается баланс всей системы пищеварения и энергия жизни. Восстановив селезёнку, вы почувствуете: лёгкость после еды, прилив сил, ясность ума, стабильное настроение и крепкий иммунитет.`,
                price: '16 900 ₽',
                image: 'images/1.png'
            },
            {
                title: 'Желудок',
                subtitle: 'Ворота энергии',
                description: `Мы часто думаем: желудок — это просто орган, куда «падает» еда. Но и древняя восточная медицина, и современная наука говорят одно и то же: желудок — это ворота, через которые в организм входит энергия в виде пищи.

Если желудок ослаблен, то даже самая полезная еда не усвоится правильно. В итоге тело не получает ресурс, а вы чувствуете:
• Усталость после еды, вместо энергии
• Тяжесть и вздутие
• Изжогу, отрыжку, кислый привкус во рту
• Тошноту при волнении или стрессах
• Ломкость ногтей и выпадение волос
• Проблемы с кожей (акне, сухость, серый цвет лица)

<strong>Почему важно заботиться о желудке</strong>
Восточная медицина называет желудок «морем пищи и воды» — именно здесь начинается процесс превращения еды в энергию (Ци).

Современная медицина подтверждает: желудок отвечает за переваривание белков, выработку ферментов, усвоение железа, витамина С, витамина B12, йода и защиту от бактерий.

<strong>Чем грозит игнорирование проблем</strong>
• Хроническая усталость и сонливость
• Анемия, дефицит B12 и железа
• Ломкость костей и зубов
• Слабый иммунитет и частые болезни
• Нарушения цикла у женщин
• Риск язвы и гастрита

<strong>Зачем восстанавливать желудок</strong>
Когда желудок в балансе, вы чувствуете: лёгкость после еды, прилив энергии и ясность ума, красивые волосы, ногти, кожу, спокойное пищеварение и крепкий иммунитет.

Желудок — это не просто про еду. Это про качество вашей жизни.`,
                price: '16 900 ₽',
                image: 'images/2.png'
            },
            {
                title: 'Печень',
                subtitle: 'Главный фильтр и дирижёр гормонов',
                description: `Многие заблуждаются, что печень "накапливает в себе токсины". С точки зрения биохимии это совсем не так: печень отвечает за фазы детоксикации.

Но и древняя восточная медицина, и современная наука говорят: печень управляет всей системой — от гормонов и энергии до эмоций и внешности.

<strong>Симптомы нарушения работы печени</strong>
• Хроническая усталость и «нет сил»
• Горечь во рту, тяжесть справа под рёбрами
• Частые головные боли, особенно вечером
• Отёки, вздутие, тяжёлое пищеварение
• Пигментные пятна, тусклая кожа, ломкость волос
• Нарушения цикла, ПМС, болезненные месячные
• Эндометриоз, миомы, мастопатия
• Раздражительность, перепады настроения, вспышки гнева

<strong>Почему печень так важна</strong>
✔️ С точки зрения восточной медицины: печень управляет движением энергии (Ци), отвечает за хранение крови и питание организма, связана с эмоциями.

✔️ С точки зрения западной науки: печень выводит метаболиты токсичных веществ, лекарств, алкоголь; регулирует обмен жиров и глюкозы; перерабатывает гормоны (особенно эстрогены); участвует в синтезе белков, ферментов и витаминов.

<strong>Чем грозит игнорирование сигналов</strong>
• Гормональные сбои и тяжёлый ПМС
• Набор веса и отёки
• Хроническая усталость и «туман в голове»
• Преждевременное старение кожи
• Развитие жировой болезни печени, миом, эндометриоза

<strong>Зачем восстанавливать печень</strong>
Когда печень работает правильно, вы чувствуете: лёгкость в теле и ясность в голове, здоровую кожу и волосы, стабильный цикл и хорошее настроение, много энергии для жизни.

Печень — это не только про здоровье. Это про вашу молодость, красоту и гармонию.`,
                price: '16 900 ₽',
                image: 'images/3.png'
            },
            {
                title: 'Желчный пузырь',
                subtitle: 'Поток и движение',
                description: `Мы редко задумываемся о здоровье желчного пузыря, пока не появляются камни или боли - желчный уже рекомендуют удалить.

Но и восточная медицина, и современная наука говорят: желчный пузырь — это орган, который определяет, как вы перевариваете еду, усваиваете жиры, гормоны и даже как принимаете решения.

<strong>Симптомы нарушения оттока или структуры желчи</strong>
• Тяжесть и горечь во рту, особенно утром
• Вздутие, отрыжка, тошнота после жирной пищи
• Запоры или нестабильный стул
• Отёки и лишний вес, который «не уходит»
• Сероватая или тусклая кожа
• Выпадение волос, ломкие ногти
• Сильный ПМС, болезненные месячные
• Раздражительность, трудности с концентрацией
• Ощущение «застоя в жизни»

<strong>Почему желчный пузырь так важен</strong>
✔️ С точки зрения восточной медицины: отвечает за смелость и способность принимать решения. Его энергия связана с движением — и в теле, и в жизни.

✔️ С точки зрения западной науки: накапливает и выбрасывает желчь → без этого невозможно усваивать жиры, витамины A, D, E, K, омега-3 и гормоны. Плохой отток желчи = застой эстрогенов → миомы, эндометриоз. Желчь является натуральным антисептиком в организме.

<strong>Чем грозит игнорирование проблем</strong>
• Хроническое вздутие, тяжесть, боли после еды
• Постоянные отёки и «лишние килограммы»
• Выраженный ПМС, эндометриоз, миомы
• Камнеобразование, воспаление, удаление органа
• Преждевременное старение кожи, усталость, апатия

<strong>Что даёт восстановление</strong>
Лёгкость после еды, стабильное пищеварение, стройность и снижение отёков, чистая кожа, баланс гормонов, прилив энергии и ясность в голове, уверенность и внутреннюю смелость.

Желчный пузырь — это про движение. И в теле, и в жизни.`,
                price: '16 900 ₽',
                image: 'images/4.png'
            },
            {
                title: 'Поджелудочная железа',
                subtitle: 'Баланс сахара и энергии',
                description: `Мы редко думаем о поджелудочной железе, пока не услышим диагноз «панкреатит» или «сахарный диабет».

Но на самом деле поджелудочная — это орган, который каждый день определяет, есть ли у вас энергия или организм будет тратить ресурс на борьбу с воспалением.

<strong>Симптомы нарушения работы</strong>
• Постоянная тяга к сладкому, кофе и перекусам
• Сонливость и упадок сил после еды
• Скачки настроения, раздражительность, тревожность
• Дрожь в теле и слабость, если долго не ели
• Набор веса в области живота, отёки, инсулинорезистентность
• Вздутие и тяжесть после еды
• Диарея, в частности на фоне употребления фруктов и сырых овощей

<strong>Почему поджелудочная так важна</strong>
✔️ С точки зрения восточной медицины: входит в систему Селезёнка/Желудок — это центр, который «добывает энергию из пищи». Дисбаланс проявляется через тревожность, зацикленность на мыслях, беспокойство.

✔️ С точки зрения западной науки: вырабатывает ферменты для переваривания белков, жиров и углеводов. Контролирует уровень глюкозы в крови с помощью инсулина и глюкагона. Перегрузка быстрыми углеводами ведёт к инсулинорезистентности → лишний вес, усталость, гормональные сбои.

<strong>Чем грозит игнорирование сигналов</strong>
• Хроническая усталость и невозможность концентрироваться
• Постоянный набор веса «в области живота»
• Инсулинорезистентность и диабет
• Панкреатит, боли и воспаления ЖКТ

<strong>Что даёт восстановление</strong>
Стабильная энергия весь день, лёгкое пищеварение без вздутий, снижение тяги к сладкому, стройность и баланс глюкозы в крови, ровное настроение и ясность ума, профилактика диабета.

Поджелудочная железа — это не только про пищеварение. Это про ваш баланс энергии, веса и стабильного эмоционального состояния.`,
                price: '16 900 ₽',
                image: 'images/5.png'
            },
            {
                title: 'Кишечник',
                subtitle: 'Вторая вселенная внутри нас',
                description: `Мы привыкли думать, что кишечник — это просто про "болит живот" и вздутие. Но состояние кишечника определяет качество жизни.

В нём живут триллионы бактерий — микробиота. Они решают: есть ли у тебя энергия, как работает твой иммунитет, будет ли у тебя чистая кожа и нормальный вес, стабильны ли твои эмоции и сон.

<strong>Симптомы проблем с кишечником</strong>
• Вздутие, газообразование, тяжесть после еды
• Нестабильный стул (запоры, поносы или их чередование)
• Непереносимость некоторых продуктов
• Слабый иммунитет, частые простуды, аллергии
• Хронический синусит, тонзиллит
• Кожные проблемы: акне, сыпь, экзема, тусклый цвет лица
• Хроническая усталость и «туман в голове»
• Тревожность, перепады настроения, бессонница
• Аутоиммунные заболевания

<strong>Почему кишечник так важен</strong>
✔️ Взгляд восточной медицины: эмоции напрямую связаны с ЖКТ. Дисбаланс кишечника = тревога, раздражительность, навязчивые мысли.

✔️ Взгляд науки: 80% иммунных клеток живёт в кишечнике. 90% серотонина (гормона счастья) вырабатывается в кишечнике. Дисбиоз → воспаление → эстроген-доминирование, ПМС, эндометриоз, лишний вес. Кишечник напрямую влияет на мозг через ось «кишечник–мозг».

<strong>Что будет, если не заниматься кишечником</strong>
• Хроническая усталость, апатия, снижение концентрации
• Постоянные воспаления и частые болезни
• Проблемы с кожей и внешним видом
• Лишний вес, отёки, метаболические нарушения
• Риск аутоиммунных заболеваний, депрессии, гормональных проблем

<strong>Что даёт восстановление кишечника</strong>
Лёгкое и комфортное пищеварение, ровная кожа и сияющий внешний вид, крепкий иммунитет и меньше простуд, стабильная энергия и ясность ума, хорошее настроение и крепкий сон, стройность и баланс гормонов.

Кишечник — это про твою жизнь, красоту, счастье и долголетие.`,
                price: '16 900 ₽',
                image: 'images/6.png'
            }
        ];

        const data = moduleData[cardIndex];
        showModuleModal(data);
    }
}

// Header interactions
const calendarIcon = document.querySelector('.calendar-icon');
const profileAvatar = document.querySelector('.profile-avatar');

calendarIcon.addEventListener('click', () => {
    window.location.href = 'calendar.html';
});

profileAvatar.addEventListener('click', () => {
    window.location.href = 'profile.html';
});

// Package modal
const packageCard = document.getElementById('packageCard');
const packageModal = document.getElementById('packageModal');
const packageModalClose = document.getElementById('packageModalClose');
const packageModalOverlay = packageModal?.querySelector('.modal-overlay');

if (packageCard) {
    packageCard.addEventListener('click', () => {
        packageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (packageModalClose) {
    packageModalClose.addEventListener('click', () => {
        packageModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (packageModalOverlay) {
    packageModalOverlay.addEventListener('click', () => {
        packageModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Expert modal
const expertCard = document.getElementById('expertCard');
const expertModal = document.getElementById('expertModal');
const expertModalClose = document.getElementById('expertModalClose');
const expertModalOverlay = expertModal?.querySelector('.modal-overlay');

if (expertCard) {
    expertCard.addEventListener('click', () => {
        expertModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (expertModalClose) {
    expertModalClose.addEventListener('click', () => {
        expertModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (expertModalOverlay) {
    expertModalOverlay.addEventListener('click', () => {
        expertModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Modal functionality
function showModuleModal(data) {
    const modal = document.getElementById('moduleModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');

    modalImage.src = data.image;
    modalImage.alt = data.title;
    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;
    modalDescription.innerHTML = data.description; // Use innerHTML to support HTML markup
    modalPrice.textContent = data.price;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModuleModal() {
    const modal = document.getElementById('moduleModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Modal close handlers
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalBuyButton = document.querySelector('.modal-buy-button');

    modalClose.addEventListener('click', closeModuleModal);
    modalOverlay.addEventListener('click', closeModuleModal);

    let currentModuleIndex = 0;

    modalBuyButton.addEventListener('click', () => {
        // Simulate payment success - unlock module
        const originalCards = document.querySelectorAll('.carousel-card:not(.clone)');
        const card = originalCards[currentModuleIndex];

        if (card) {
            const lockIcon = card.querySelector('.lock-icon');
            if (lockIcon) {
                lockIcon.setAttribute('data-locked', 'false');
            }

            // Also unlock in clones
            const allCards = document.querySelectorAll('.carousel-card');
            allCards.forEach(c => {
                const cardIndex = parseInt(c.getAttribute('data-index'));
                if (cardIndex === currentModuleIndex) {
                    const cloneLock = c.querySelector('.lock-icon');
                    if (cloneLock) {
                        cloneLock.setAttribute('data-locked', 'false');
                    }
                }
            });
        }

        closeModuleModal();

        // Show success message and redirect
        setTimeout(() => {
            alert('Оплата успешна! Модуль разблокирован.');
            window.location.href = `module.html?module=${currentModuleIndex}`;
        }, 300);
    });

    // Track current module for purchase
    window.setCurrentModuleForPurchase = (index) => {
        currentModuleIndex = index;
    };
});

// Responsive adjustments
function handleResize() {
    const carousel = new Carousel();
    const width = window.innerWidth;

    if (width < 380) {
        carousel.cardWidth = 240;
    } else {
        carousel.cardWidth = 280;
    }
}

window.addEventListener('resize', handleResize);
