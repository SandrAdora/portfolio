class ProjectCarousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.container = document.querySelector('.carousel-track-container');
        this.cards = document.querySelectorAll('.project-card');
        this.prevBtn = document.querySelector('.carousel-btn--left');
        this.nextBtn = document.querySelector('.carousel-btn--right');
        this.dotsContainer = document.querySelector('.carousel-dots');

        if (!this.track || this.cards.length === 0) return;

        this.currentIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.dragDelta = 0;

        this.init();
    }

    init() {
        this.createDots();
        this.updateCarousel(false);
        this.bindEvents();
    }

    createDots() {
        this.cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Projekt ${i + 1}`);
            dot.addEventListener('click', () => this.goTo(i));
            this.dotsContainer.appendChild(dot);
        });
        this.dots = document.querySelectorAll('.dot');
    }

    cardWidth() {
        const card = this.cards[0];
        const gap = 28;
        return card.offsetWidth + gap;
    }

    updateCarousel(animate = true) {
        if (!animate) this.track.style.transition = 'none';
        else this.track.style.transition = '';

        this.track.style.transform = `translateX(-${this.currentIndex * this.cardWidth()}px)`;

        this.dots.forEach((dot, i) =>
            dot.classList.toggle('active', i === this.currentIndex)
        );

        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.cards.length - 1;

        // Re-enable transition after forced layout
        if (!animate) {
            requestAnimationFrame(() => {
                this.track.style.transition = '';
            });
        }
    }

    goTo(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.cards.length - 1));
        this.updateCarousel();
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.goTo(this.currentIndex - 1));
        this.nextBtn.addEventListener('click', () => this.goTo(this.currentIndex + 1));

        // Mouse drag
        this.track.addEventListener('mousedown', (e) => this.dragStart(e));
        window.addEventListener('mousemove', (e) => this.dragMove(e));
        window.addEventListener('mouseup', (e) => this.dragEnd(e));

        // Touch swipe
        this.track.addEventListener('touchstart', (e) => this.dragStart(e), { passive: true });
        window.addEventListener('touchmove', (e) => this.dragMove(e), { passive: true });
        window.addEventListener('touchend', (e) => this.dragEnd(e));

        // Keyboard navigation when section is in view
        document.addEventListener('keydown', (e) => {
            const section = document.getElementById('projects-section');
            const rect = section.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inView) return;
            if (e.key === 'ArrowLeft') this.goTo(this.currentIndex - 1);
            if (e.key === 'ArrowRight') this.goTo(this.currentIndex + 1);
        });

        // Recalculate on resize
        window.addEventListener('resize', () => this.updateCarousel(false));
    }

    getClientX(e) {
        return e.touches ? e.touches[0].clientX : e.clientX;
    }

    dragStart(e) {
        // Only left mouse button
        if (e.button !== undefined && e.button !== 0) return;
        this.isDragging = true;
        this.startX = this.getClientX(e);
        this.dragDelta = 0;
        this.track.classList.add('is-dragging');
    }

    dragMove(e) {
        if (!this.isDragging) return;
        const currentX = this.getClientX(e);
        this.dragDelta = currentX - this.startX;
        const base = -this.currentIndex * this.cardWidth();
        this.track.style.transform = `translateX(${base + this.dragDelta}px)`;
    }

    dragEnd(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.track.classList.remove('is-dragging');

        const threshold = 60;
        if (this.dragDelta < -threshold) this.goTo(this.currentIndex + 1);
        else if (this.dragDelta > threshold) this.goTo(this.currentIndex - 1);
        else this.updateCarousel();
    }
}

document.addEventListener('DOMContentLoaded', () => new ProjectCarousel());
