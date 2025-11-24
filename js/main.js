document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Carousel Logic
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (track && prevBtn && nextBtn) {
        let scrollAmount = 0;
        const cardWidth = 320; // card width + gap

        nextBtn.addEventListener('click', () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            scrollAmount += cardWidth;
            if (scrollAmount > maxScroll) scrollAmount = maxScroll;
            track.style.transform = `translateX(-${scrollAmount}px)`;
        });

        prevBtn.addEventListener('click', () => {
            scrollAmount -= cardWidth;
            if (scrollAmount < 0) scrollAmount = 0;
            track.style.transform = `translateX(-${scrollAmount}px)`;
        });
    }
});
