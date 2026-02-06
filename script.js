// Prevent automatic scrolling on page reload
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Navigation and smooth scrolling
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu when link is clicked
        closeMobileMenu();
    });
});

// Footer quick links smooth scrolling
document.querySelectorAll('.quick-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu when link is clicked
        closeMobileMenu();
    });
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu function
function closeMobileMenu() {
    if (hamburger && navLinks) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks && hamburger) {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    }
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section');
const navLinkElements = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinkElements.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Resume download handling from GitHub
const resumeDownloadLink = document.getElementById('resume-download-link');
if (resumeDownloadLink) {
    resumeDownloadLink.addEventListener('click', async function(e) {
        e.preventDefault();
        // GitHub raw URL for resume (works perfectly with direct downloads)
        const downloadUrl = 'https://raw.githubusercontent.com/Raihankhanmalek/raihankhanmalek.github.io/main/resume.pdf';
        
        try {
            // Fetch the file from GitHub
            const response = await fetch(downloadUrl);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Raihankhan_Malek_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                // If file not found, show error
                console.error('Resume file not found. Please ensure resume.pdf is in your repository root.');
                alert('Resume file not found. Please ensure resume.pdf is uploaded to your repository.');
            }
        } catch (error) {
            console.error('Error downloading resume:', error);
            alert('Error downloading resume. Please try again later.');
        }
    });
}

// Form submission handling with Formspree
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable submit button and show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        formStatus.textContent = '';
        formStatus.className = 'form-status';
        
        // Get form data
        const formData = new FormData(this);
        
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                formStatus.textContent = 'Thank you for your message! I will get back to you soon.';
                formStatus.className = 'form-status success';
                this.reset();
            } else {
                // Error from Formspree
                const data = await response.json();
                if (data.errors) {
                    formStatus.textContent = data.errors.map(error => error.message).join(', ');
                } else {
                    formStatus.textContent = 'Oops! There was a problem submitting your message. Please try again.';
                }
                formStatus.className = 'form-status error';
            }
        } catch (error) {
            // Network error
            formStatus.textContent = 'Oops! There was a problem submitting your message. Please check your connection and try again.';
            formStatus.className = 'form-status error';
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Particle effect for hero background (optional)
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
        `;
        hero.appendChild(particle);
    }
}

// Add particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize particles
createParticles();

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Skill bars animation on scroll
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.skill-fill');
            fills.forEach(fill => {
                const width = fill.style.width;
                fill.style.width = '0';
                setTimeout(() => {
                    fill.style.width = width;
                }, 200);
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-card').forEach(skill => {
    skillObserver.observe(skill);
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.getElementById('home');
    hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// Projects filter by skill (multi-select dropdown: show projects that have ALL selected skills)
const projectCards = document.querySelectorAll('.project-card');
const skillCheckboxes = document.querySelectorAll('.projects-filter input[name="skill-filter"]');
const filterDropdown = document.querySelector('.filter-dropdown');
const filterTrigger = document.getElementById('filter-dropdown-trigger');
const filterLabel = document.querySelector('.filter-dropdown-label');
const filterPanel = document.getElementById('filter-dropdown-panel');

function updateFilterLabel() {
    const selected = Array.from(skillCheckboxes).filter(cb => cb.checked);
    if (filterLabel) {
        filterLabel.textContent = selected.length === 0
            ? 'Filter by skills'
            : selected.map(cb => cb.closest('label').querySelector('span').textContent).join(', ');
    }
}

function applyProjectFilter() {
    const selected = Array.from(skillCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value.toLowerCase());

    let visibleCount = 0;
    projectCards.forEach(card => {
        const skills = (card.getAttribute('data-skills') || '').toLowerCase();
        const match = selected.length === 0 || selected.every(skill => skills.includes(skill));
        card.setAttribute('data-hidden', match ? 'false' : 'true');
        if (match) visibleCount++;
    });

    const noResultsEl = document.getElementById('projects-no-results');
    if (noResultsEl) {
        const showNoResults = selected.length > 0 && visibleCount === 0;
        noResultsEl.hidden = !showNoResults;
    }
    updateFilterLabel();
}

function toggleFilterDropdown() {
    if (filterDropdown) {
        filterDropdown.classList.toggle('open');
        filterTrigger.setAttribute('aria-expanded', filterDropdown.classList.contains('open'));
    }
}

function closeFilterDropdown() {
    if (filterDropdown && filterDropdown.classList.contains('open')) {
        filterDropdown.classList.remove('open');
        if (filterTrigger) filterTrigger.setAttribute('aria-expanded', 'false');
    }
}

if (skillCheckboxes.length && projectCards.length) {
    skillCheckboxes.forEach(cb => {
        cb.addEventListener('change', applyProjectFilter);
    });
}

if (filterTrigger && filterPanel) {
    filterTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFilterDropdown();
    });
    filterPanel.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', closeFilterDropdown);
}

updateFilterLabel();