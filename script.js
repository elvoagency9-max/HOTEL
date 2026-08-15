/**
 * The Grand Eclat - Core Logic
 */

// --- Data: Room Inventory ---
const roomData = [
    {
        id: 'deluxe',
        title: 'Deluxe King Room',
        price: 350,
        size: '45 sq.m / 484 sq.ft',
        view: 'City Skyline',
        bed: '1 King Bed',
        desc: 'Experience pure comfort in our meticulously designed Deluxe King Room. Featuring bespoke furnishings, Italian marble bathrooms, and floor-to-ceiling windows offering vibrant city views, this room is your perfect urban retreat.',
        images: [
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['Free High-Speed Wi-Fi', 'Nespresso Coffee Machine', 'Smart TV with Streaming', '24-hour Room Service', 'Luxury Toiletries', 'Evening Turndown Service']
    },
    {
        id: 'executive',
        title: 'Executive Suite',
        price: 650,
        size: '80 sq.m / 860 sq.ft',
        view: 'Garden & City',
        bed: '1 King Bed',
        desc: 'Our Executive Suites offer expansive living areas separate from the master bedroom. Ideal for extended stays or entertaining, these suites feature a dining area, enhanced workspace, and access to the exclusive Executive Club Lounge.',
        images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['Executive Lounge Access', 'Separate Living Area', 'Deep Soaking Tub', 'Complimentary Breakfast', 'Personal Concierge', 'Premium Minibar']
    },
    {
        id: 'penthouse',
        title: 'The Grand Penthouse',
        price: 2200,
        size: '250 sq.m / 2690 sq.ft',
        view: 'Panoramic City & River',
        bed: '2 King Beds',
        desc: 'The pinnacle of luxury. The Grand Penthouse crowns the hotel, featuring a private terrace, a grand piano, a dining room for twelve, and a private butler. Surrounded by unparalleled views, this is an experience reserved for the most discerning guests.',
        images: [
            'https://images.unsplash.com/photo-1502672260266-1c1e5250adfd?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['Private Butler Service', 'Wraparound Terrace', 'Private Dining Room', 'Jacuzzi', 'Airport Limousine Transfer', 'In-suite Spa Treatments']
    }
];

// --- App Controller ---
const app = {
    init() {
        this.renderRooms();
        this.setupScrollListener();
        this.setupObservers();
        this.setupBookingForm();
        
        // Set minimum dates for date pickers to today
        const today = new Date().toISOString().split('T')[0];
        document.querySelectorAll('input[type="date"]').forEach(el => {
            el.setAttribute('min', today);
        });
    },

    // View Navigation
    navigate(viewId) {
        document.querySelectorAll('.view').forEach(el => {
            el.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Re-trigger animations for the new view
        setTimeout(() => this.setupObservers(), 100);
    },

    // Render the Room Grid
    renderRooms() {
        const container = document.getElementById('rooms-container');
        container.innerHTML = roomData.map(room => `
            <div class="room-card animate-on-scroll" onclick="app.openRoomDetail('${room.id}')">
                <img src="${room.images[0]}" alt="${room.title}" class="room-img">
                <div class="room-info">
                    <h3>${room.title}</h3>
                    <span class="room-price">$${room.price} / night</span>
                    <div class="room-amenities-mini">
                        <span><i class="fas fa-bed"></i> ${room.bed}</span>
                        <span><i class="fas fa-vector-square"></i> ${room.size.split('/')[0]}</span>
                    </div>
                    <p>${room.desc.substring(0, 80)}...</p>
                </div>
            </div>
        `).join('');
    },

    // Open Specific Room Detail
    openRoomDetail(roomId) {
        const room = roomData.find(r => r.id === roomId);
        if (!room) return;

        const content = document.getElementById('room-detail-content');
        content.innerHTML = `
            <div class="room-detail-header">
                <div>
                    <h2>${room.title}</h2>
                    <p class="room-price" style="font-size: 1.5rem;">$${room.price} <span style="font-size: 1rem; color: #666; font-weight: normal;">per night</span></p>
                </div>
                <button class="btn-primary" onclick="app.bookSpecificRoom('${room.id}')">Book This Suite</button>
            </div>
            
            <div class="room-detail-gallery">
                <img src="${room.images[0]}" alt="Main" class="main-img">
                <div class="side-imgs">
                    <img src="${room.images[1]}" alt="Detail 1" class="side-img">
                    <img src="${room.images[2]}" alt="Detail 2" class="side-img">
                </div>
            </div>

            <div class="room-detail-grid">
                <div>
                    <h3>Suite Overview</h3>
                    <p style="margin-bottom: 20px;">${room.desc}</p>
                    
                    <div style="display: flex; gap: 30px; margin-bottom: 30px; padding: 20px; background: #fafafa; border-radius: 4px;">
                        <div><strong>Size:</strong><br>${room.size}</div>
                        <div><strong>Bed:</strong><br>${room.bed}</div>
                        <div><strong>View:</strong><br>${room.view}</div>
                    </div>
                </div>
                <div>
                    <h3>Amenities</h3>
                    <ul class="amenities-list">
                        ${room.amenities.map(a => `<li><i class="fas fa-check"></i> ${a}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        this.navigate('room-detail-view');
    },

    // Pre-select room and go to booking form
    bookSpecificRoom(roomId) {
        document.getElementById('booking-room-select').value = roomId;
        this.navigate('booking-view');
    },

    // Guest Counter Logic
    updateGuests(change) {
        const input = document.getElementById('guest-count');
        let current = parseInt(input.value);
        let newVal = current + change;
        if (newVal >= 1 && newVal <= 6) {
            input.value = newVal;
        }
    },

    // Header Scroll Effect
    setupScrollListener() {
        const header = document.getElementById('main-header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                // Remove hero-specific text coloring if we aren't at the top
                document.querySelector('.hero header') && document.querySelector('.hero header').classList.remove('hero'); 
            } else {
                header.classList.remove('scrolled');
            }
        });
    },

    // Intersection Observer for scroll animations
    setupObservers() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, { threshold: 0.1 });

        // Select all animate elements in the currently active view
        document.querySelectorAll('.view.active .animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    },
    
    // Form Submission Handling
    setupBookingForm() {
        document.getElementById('full-booking-form').addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, this would send data to a backend.
            alert('Thank you for choosing The Grand Eclat. Your reservation request has been received. Our concierge will email your confirmation shortly.');
            e.target.reset();
            app.navigate('home-view');
        });
    }
};

// Initialize App on Load
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
