// Ensure the widget loads properly
document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('message', function (e) {
        if (e.data.event && e.data.event.indexOf('calendly') === 0) {
            document.querySelector('.calendly-inline-widget').classList.add('loaded');
        }
    });

    // Fallback to hide loader after 3 seconds if Calendly doesn't trigger event
    setTimeout(function () {
        document.querySelector('.calendly-loading').style.opacity = 0;
        document.querySelector('.calendly-loading').style.pointerEvents = 'none';
    }, 3000);
});

const propertyImages = [
    { image: 'photos/1523964748-70399-shutterstock-555325381jpg.jpg' },
    { image: 'photos/Best-Practices-For-Shooting-Single-Images-In-Real-Estate-Photography.jpg' },
    { image: 'photos/real-estate-photography-a-complete-guide-header.jpg' },
    { image: 'photos/real-estate-photography-brampton-kitchen-216470gkam-8-1536x1023.jpg' },
    { image: 'photos/RWQX005.jpg' },
    { image: 'photos/Toronto-Real-Estate-Photography-005.jpg' }
];

// Animation parameters for each row
const carouselRows = [
    { id: 'carousel-track-1', position: 0, speed: 0.4, direction: -1 }, // Left to right (negative direction)
    { id: 'carousel-track-2', position: 0, speed: 0.4, direction: 1 },  // Right to left (positive direction)
    { id: 'carousel-track-3', position: 0, speed: 0.4, direction: -1 }  // Left to right (negative direction)
];

// Setup all carousel rows
function setupMultiRowCarousel() {
    carouselRows.forEach((row, rowIndex) => {
        const track = document.getElementById(row.id);
        track.innerHTML = '';

        // Create even more copies for the full-width effect
        const allImages = [...propertyImages, ...propertyImages, ...propertyImages, ...propertyImages, ...propertyImages];

        // Add images to this row
        allImages.forEach((property, index) => {
            const slide = document.createElement('div');
            slide.className = 'flex-shrink-0 px-2 h-full';
            slide.style.width = '250px'; // Fixed width for each slide

            slide.innerHTML = `
        <div class="cursor-pointer overflow-hidden rounded-lg shadow-md h-full">
            <img src="${property.image}" alt="Property Image ${index % propertyImages.length + 1}" 
                 class="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105">
        </div>
    `;

            slide.addEventListener('click', () => openLightbox(property.image));
            track.appendChild(slide);
        });

        // Set initial track width
        updateTrackWidth(row.id);

        // Set initial position for RTL rows
        if (row.direction > 0) {
            // For rows moving right to left, start at position 0
            row.position = 0;
        }
    });

    // Start animations for all rows
    startAllAnimations();
}

// Update track width for a specific row
function updateTrackWidth(trackId) {
    const track = document.getElementById(trackId);
    const slides = track.querySelectorAll('div[class^="flex-shrink-0"]');

    // Calculate total width of all slides
    let totalWidth = 0;
    slides.forEach(slide => {
        totalWidth += slide.offsetWidth;
    });

    // Set track width to fit all slides
    track.style.width = `${totalWidth}px`;
}

// Start animations for all rows
function startAllAnimations() {
    carouselRows.forEach(row => {
        animateRow(row);
    });
}

// Animate a specific row with improved infinite scroll
function animateRow(row) {
    const track = document.getElementById(row.id);
    const slides = track.querySelectorAll('div[class^="flex-shrink-0"]');
    const slideCount = slides.length;
    const slideWidth = slides[0].offsetWidth;

    // Calculate the point at which we need to reset (one full row of images)
    const resetPoint = slideWidth * propertyImages.length;

    function animate() {
        // Move position based on direction and speed
        row.position += row.speed * row.direction;

        // Handle infinite scrolling reset
        if (row.direction < 0) { // Moving left to right (negative direction)
            if (Math.abs(row.position) >= resetPoint) {
                // If we've gone too far left, reset to the beginning
                row.position = 0;
            }
        } else { // Moving right to left (positive direction)
            if (row.position >= resetPoint) {
                // If we've gone too far right, reset to the beginning
                row.position = 0;
            }
        }

        // Apply the transform
        track.style.transform = `translateX(${-row.position}px)`;

        // Continue the animation
        requestAnimationFrame(animate);
    }

    // Start the animation
    animate();
}

// Handle window resize to update carousel layout
window.addEventListener('resize', () => {
    carouselRows.forEach(row => {
        updateTrackWidth(row.id);
    });
});

// Lightbox functionality
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');

    lightboxImage.src = imageSrc;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('flex');
    lightbox.classList.add('hidden');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupMultiRowCarousel();

    // Lightbox close event
    document.getElementById('closeLightbox').addEventListener('click', closeLightbox);

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            // Add mobile menu functionality here
        });
    }
});

// Fix for page reload scrolling to anchor
if (window.location.hash) {
    // If there's a hash in the URL when page loads
    window.scrollTo(0, 0); // Scroll to top of page
    setTimeout(function () {
        // Remove the hash without triggering another page reload
        history.replaceState("", document.title, window.location.pathname + window.location.search);
    }, 10);
}