/**
 * 3D Arch Carousel Logic
 * 
 * Implements a vertical "Ferris Wheel" style carousel where the active card
 * sits at the top (12 o'clock) and other cards cascade down the sides.
 */

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    const cards = Array.from(document.querySelectorAll('.project-card'));

    if (!track || cards.length === 0) return;

    // --- Configuration ---
    const RADIUS = 600; // Radius of the wheel in pixels
    const VISIBLE_ARC = 120; // Degrees of the circle to display cards on (e.g., top 120 degrees)
    const CARD_SPACING_DEG = 20; // Degrees between cards

    // State
    let currentIndex = 0; // The index of the card currently at the top (focus)
    let targetIndex = 0; // For smooth animation
    let isDragging = false;
    let startY = 0;
    let startIndex = 0;

    // --- Initialization ---

    // Set initial positions
    updateCarousel();

    // --- Event Listeners ---

    // Mouse/Touch Drag
    track.parentElement.addEventListener('mousedown', handleDragStart);
    track.parentElement.addEventListener('touchstart', handleDragStart, { passive: false });

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('touchmove', handleDragMove, { passive: false });

    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);
    // Prevent sticky drag if mouse leaves window
    window.addEventListener('mouseleave', handleDragEnd);

    // Click to Focus
    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            // Ignore click if it was a drag (moved more than 5px)
            if (dragDistance > 5) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            // Calculate shortest distance to this card
            const count = cards.length;
            let offset = (index - targetIndex) % count;

            // Adjust for shortest path (wrapping)
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            // If offset is effectively 0 (card is already centered), do nothing
            if (Math.abs(offset) < 0.1) {
                return;
            }

            // Move targetIndex by the offset to bring this card to center (offset 0)
            targetIndex += offset;
            updateCarousel();
        });
    });

    // Keyboard Nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            targetIndex = Math.min(targetIndex + 1, cards.length - 1);
            updateCarousel();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            targetIndex = Math.max(targetIndex - 1, 0);
            updateCarousel();
        }
    });


    // --- Core Logic ---

    function updateCarousel() {
        // Virtual index allows spinning past bounds
        const count = cards.length;

        cards.forEach((card, i) => {
            // Find shortest distance in the loop
            // dist = (i - targetIndex) % count
            // We want dist to be between -count/2 and +count/2

            let offset = (i - targetIndex) % count;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            // Now same math as before
            const thetaDeg = offset * CARD_SPACING_DEG;
            const thetaRad = thetaDeg * (Math.PI / 180);

            // Only render if within visible arc
            if (Math.abs(thetaDeg) > VISIBLE_ARC) {
                card.style.opacity = 0;
                card.style.pointerEvents = 'none';
                return;
            }
            card.style.pointerEvents = 'auto';

            const x = RADIUS * Math.sin(thetaRad);
            // y: 0 is top. Down is positive.
            // At 0 deg: y should be roughly 0 (centered vertically in container?)
            // Container is 600px high. Center is 300px.
            // Let's say top card is at y=0 relative to center?
            // Actually, let's push the arc down so the top is visible.
            const y = RADIUS * (1 - Math.cos(thetaRad));
            // At 0 deg, y = 0. At 90 deg, y = R.

            const z = -Math.abs(offset) * 50; // Depth

            const rotateZ = offset * 5; // Slight tilt

            const scale = 1 - Math.abs(offset) * 0.05;
            const opacity = 1 - Math.abs(offset) * 0.2;

            card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${rotateZ}deg) scale(${Math.max(scale, 0)})`;
            card.style.opacity = Math.max(opacity, 0);
            card.style.zIndex = 100 - Math.round(Math.abs(offset));

            if (Math.abs(offset) < 0.1) {
                card.classList.add('focused');
            } else {
                card.classList.remove('focused');
            }
        });
    }



    // --- Drag Handlers ---
    let startX = 0;
    let dragDistance = 0;

    function handleDragStart(e) {
        isDragging = true;
        dragDistance = 0;
        // Use ClientX for horizontal drag
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        startIndex = targetIndex;
        track.style.cursor = 'grabbing';
    }

    function handleDragMove(e) {
        if (!isDragging) return;

        // Use ClientX
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const deltaX = x - startX;

        // Only prevent default if we are actually dragging
        if (Math.abs(deltaX) > 5) {
            e.preventDefault();
            track.classList.add('is-dragging');
        }
        dragDistance = Math.abs(deltaX);

        // Sensitivity: 100px = 1 card
        const deltaIndex = -deltaX / 100;
        targetIndex = startIndex + deltaIndex;

        requestAnimationFrame(updateCarousel);
    }

    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';
        track.classList.remove('is-dragging');

        // Snap to nearest integer
        targetIndex = Math.round(targetIndex);
        updateCarousel();

        // Reset drag distance after a short delay to allow click handler to check it
        setTimeout(() => {
            dragDistance = 0;
        }, 50);
    }

    // Prevent native drag of images/cards which causes "sticky" behavior
    track.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    // Initial call
    updateCarousel();
});
