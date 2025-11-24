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

            if (currentIndex !== index) {
                targetIndex = index;
                animateToIndex();
            }
        });
    });

    // Keyboard Nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            targetIndex = Math.min(targetIndex + 1, cards.length - 1);
            animateToIndex();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            targetIndex = Math.max(targetIndex - 1, 0);
            animateToIndex();
        }
    });


    // --- Core Logic ---

    function updateCarousel() {
        // Smooth interpolation could go here, but for now direct mapping
        currentIndex = targetIndex;

        const centerAngle = -90; // Top of the circle is -90 degrees in standard trig (or 270)
        // Actually, let's define 0 as top for easier math, then offset.
        // Let's say 0 is top. 
        // y = -R * cos(theta)
        // x = R * sin(theta)

        cards.forEach((card, index) => {
            // Calculate "distance" from the current focus
            const offset = index - currentIndex;

            // Calculate angle for this card
            // offset * spacing. 0 is top.
            const thetaDeg = offset * CARD_SPACING_DEG;
            const thetaRad = thetaDeg * (Math.PI / 180);

            // Calculate Position
            // We want the wheel to be vertical.
            // x = horizontal offset (sin theta)
            // y = vertical offset (1 - cos theta) -> We want top to be highest.
            // Let's center the wheel at (0, R) relative to the track center?
            // No, track center is (0,0).
            // If 0 is top, then at 0 deg: x=0, y=-R.

            const x = RADIUS * Math.sin(thetaRad);
            const y = RADIUS * (1 - Math.cos(thetaRad)) - 50; // -50 to shift top up a bit
            const z = -Math.abs(offset) * 100; // Push back as they go to sides

            // Rotation
            // Cards should rotate to face the viewer or stay somewhat upright?
            // "Ferris Wheel" style: cards stay upright (rotation = 0).
            // "Arch" style: cards rotate with the wheel.
            // User asked for "Orbit" / "Revolver".
            // Let's try slight rotation to face inward.
            const rotateZ = offset * 10; // 10 degrees per slot

            // Scale & Opacity
            // Focus card (offset 0) is largest.
            const scale = 1 - Math.abs(offset) * 0.1;
            const opacity = 1 - Math.abs(offset) * 0.3;

            // Apply styles
            // We use translate3d for hardware accel
            card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${rotateZ}deg) scale(${Math.max(scale, 0)})`;
            card.style.opacity = Math.max(opacity, 0);
            card.style.zIndex = 100 - Math.abs(offset); // Closer cards on top

            // Classes
            if (index === currentIndex) {
                card.classList.add('focused');
            } else {
                card.classList.remove('focused');
            }
        });
    }

    // --- Animation Loop ---
    // Simple version: just update on change. 
    // For smoother physics, we'd use requestAnimationFrame and lerp.
    function animateToIndex() {
        // Clamp target
        // Optional: Infinite loop? User said "Loop".
        // If loop, we need modulo arithmetic.
        // Let's implement simple clamping first, then loop if requested.
        // User said: "Projects are on a loop... Like a revolver".
        // Okay, let's do infinite loop logic.

        // Infinite Loop Logic:
        // We don't clamp targetIndex. It can go negative or > length.
        // In updateCarousel, we modulo the index to find the "visual" card,
        // BUT for 3D positioning, we need to wrap the cards around.
        // Actually, simpler:
        // Keep targetIndex growing/shrinking.
        // In the loop, for each card, calculate its shortest distance to the current "virtual" index.

        updateCarouselLoop();
    }

    function updateCarouselLoop() {
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
        // Only prevent default if we are actually dragging horizontally to allow vertical scroll on mobile
        // But for now, let's keep it simple and prevent default to stop native selection/drag
        e.preventDefault();

        // Use ClientX
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const deltaX = x - startX;
        dragDistance = Math.abs(deltaX);

        // Sensitivity: 100px = 1 card
        const deltaIndex = -deltaX / 100;
        targetIndex = startIndex + deltaIndex;

        requestAnimationFrame(updateCarouselLoop);
    }

    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';

        // Snap to nearest integer
        targetIndex = Math.round(targetIndex);
        animateToIndex();

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
    animateToIndex();
});
