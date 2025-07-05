// --- JavaScript for Dynamic Effects and Countdown Logic ---

document.addEventListener('DOMContentLoaded', () => {

    // 1. Particle Generator (Enhanced)
    const particlesContainer = document.getElementById('particles-container');
    const numHearts = 20;
    const numStars = 15;
    const numDust = 30; // More subtle background particles

    function createParticle(type) {
        const particle = document.createElement('div');
        particle.classList.add('particle', type);

        const startX = Math.random() * window.innerWidth;
        const delay = Math.random() * 8; // 0s to 8s delay
        const duration = 8 + Math.random() * 7; // 8s to 15s duration
        const randomXOffset = (Math.random() - 0.5) * 300; // Wider horizontal drift

        particle.style.left = `${startX}px`;
        particle.style.setProperty('--delay', delay);
        particle.style.setProperty('--duration', duration);
        particle.style.setProperty('--start-x', startX);
        particle.style.setProperty('--end-x', startX + randomXOffset);

        if (type === 'heart') {
            const size = Math.random() * 20 + 10;
            particle.style.fontSize = `${size}px`;
            particle.innerHTML = '❤️';
        } else if (type === 'star') {
            const size = Math.random() * 15 + 8;
            particle.style.fontSize = `${size}px`;
            particle.style.setProperty('--random-rotation', Math.random() * 360);
            particle.style.setProperty('--sparkle-duration', 1 + Math.random() * 1.5);
            particle.innerHTML = '✨';
        } else if (type === 'dust') {
            const size = Math.random() * 3 + 2; // Very small
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.borderRadius = '50%';
        }

        particlesContainer.appendChild(particle);

        // Remove particle after animation to prevent memory leaks and recreate
        particle.addEventListener('animationend', () => {
            particle.remove();
            if (document.body.offsetWidth > 767 || !window.matchMedia('(orientation: landscape)').matches) {
                 // Only recreate if not in a very tight landscape mobile view to save resources
                setTimeout(() => createParticle(type), 100);
            }
        });
    }

    // Initialize particles
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        for (let i = 0; i < numHearts; i++) createParticle('heart');
        for (let i = 0; i < numStars; i++) createParticle('star');
        for (let i = 0; i < numDust; i++) createParticle('dust');
    }

    // On-tap Particle Burst
    document.body.addEventListener('click', (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const burstCount = 10;
        const clickX = e.clientX;
        const clickY = e.clientY;

        for (let i = 0; i < burstCount; i++) {
            const burstParticle = document.createElement('div');
            burstParticle.classList.add('particle', 'burst');
            const type = Math.random() > 0.5 ? 'heart' : 'star';
            burstParticle.innerHTML = type === 'heart' ? '❤️' : '✨';

            const size = Math.random() * 10 + 5;
            burstParticle.style.fontSize = `${size}px`;
            burstParticle.style.left = `${clickX}px`;
            burstParticle.style.top = `${clickY}px`;

            // Randomize burst direction and distance
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 50 + 20; // 20px to 70px
            const burstX = Math.cos(angle) * distance;
            const burstY = Math.sin(angle) * distance;

            burstParticle.style.setProperty('--burst-x', `${burstX}px`);
            burstParticle.style.setProperty('--burst-y', `${burstY}px`);

            particlesContainer.appendChild(burstParticle);

            burstParticle.addEventListener('animationend', () => burstParticle.remove(), { once: true });
        }

        // Optional: Haptic Feedback for mobile
        if ('vibrate' in navigator && e.pointerType === 'touch') {
            navigator.vibrate(50); // Vibrate for 50ms
        }
    });


    // 2. Countdown Logic
    // Set Shreya's actual birthday
    // Example: July 27, 2025. Adjust year as needed.
    const birthdayDate = new Date('July 27, 2025 00:00:00').getTime();
    const countdownElements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };
    let lastValues = {}; // To track changes for flip animation

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = birthdayDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        function animateNumberChange(element, newValue, unitName) {
            const formattedNewValue = String(newValue).padStart(2, '0');
            if (lastValues[unitName] !== formattedNewValue) {
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    element.classList.add('flip');
                    element.addEventListener('animationend', () => {
                        element.textContent = formattedNewValue;
                        element.classList.remove('flip');
                    }, { once: true });
                } else {
                    element.textContent = formattedNewValue; // No animation if reduced motion
                }
                lastValues[unitName] = formattedNewValue;
            }
        }

        if (distance < 0) {
            // Birthday has passed
            const countdownTimer = document.getElementById('countdown-timer');
            countdownTimer.innerHTML = "<div class='time-unit' style='grid-column: 1 / -1; background: linear-gradient(135deg, var(--gold), var(--primary-pink));'><div class='time-number' style='font-size: clamp(2rem, 8vw, 4.5rem);'>🎉 Happy Birthday, Shreya! 🎉</div></div>";
            clearInterval(countdownInterval); // Stop countdown
            particlesContainer.innerHTML = ''; // Clear existing particles
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                // Generate confetti explosion!
                for (let i = 0; i < 80; i++) {
                    setTimeout(() => {
                        const confetti = document.createElement('div');
                        confetti.classList.add('particle', 'confetti');
                        const colors = ['#ffd700', '#ff6b9d', '#ffa8cc', '#c44569', '#fff'];
                        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                        confetti.style.width = confetti.style.height = `${Math.random() * 8 + 5}px`;
                        confetti.style.left = `${Math.random() * 100}vw`;
                        confetti.style.top = `-20px`; // Start above screen
                        confetti.style.animation = `confettiFall ${3 + Math.random() * 3}s linear forwards, rotateConfetti ${2 + Math.random() * 2}s linear infinite`;
                        confetti.style.borderRadius = `${Math.random() > 0.5 ? '50%' : '5px'}`;
                        confetti.style.transform = `scale(${Math.random() * 0.5 + 0.5}) rotate(${Math.random() * 360}deg)`;
                        particlesContainer.appendChild(confetti);
                        confetti.addEventListener('animationend', () => confetti.remove());
                    }, i * 50);
                }
                // Dynamically add confetti keyframes if they don't exist
                const styleSheet = document.styleSheets[0];
                if (![...styleSheet.cssRules].some(rule => rule.name === 'confettiFall')) {
                    styleSheet.insertRule(`
                        @keyframes confettiFall {
                            0% { transform: translateY(-100px) rotate(0deg) scale(0.8); opacity: 0.8; }
                            100% { transform: translateY(100vh) rotate(720deg) scale(1); opacity: 0.3; }
                        }
                    `, styleSheet.cssRules.length);
                    styleSheet.insertRule(`
                        @keyframes rotateConfetti {
                            0% { transform: rotateY(0deg) rotateX(0deg); }
                            100% { transform: rotateY(360deg) rotateX(360deg); }
                        }
                    `, styleSheet.cssRules.length);
                }
            }

        } else {
            animateNumberChange(countdownElements.days, days, 'days');
            animateNumberChange(countdownElements.hours, hours, 'hours');
            animateNumberChange(countdownElements.minutes, minutes, 'minutes');
            animateNumberChange(countdownElements.seconds, seconds, 'seconds');
        }
    }

    // Run countdown initially and then every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // 3. Loading Overlay Hider
    const loadingOverlay = document.querySelector('.loading-overlay');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            loadingOverlay.addEventListener('transitionend', () => {
                loadingOverlay.style.display = 'none';
                // Start message typing after loading screen fades completely
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    typeMessage();
                } else {
                    // If reduced motion, just show the message immediately
                    document.getElementById('message-text-part1').style.opacity = 1;
                    document.getElementById('message-text-part2').style.opacity = 1;
                    document.getElementById('message-text-part3').style.opacity = 1;
                    document.getElementById('signature-text').style.opacity = 1;
                    document.getElementById('signature-name').style.opacity = 1;
                }
            });
        }, 1500); // Wait 1.5 seconds after page load before fading
    });

    // 4. Typewriter Effect for Message
    const messageParts = [
        document.getElementById('message-text-part1'),
        document.getElementById('message-text-part2'),
        document.getElementById('message-text-part3'),
    ];
    const signatureText = document.getElementById('signature-text');
    const signatureName = document.getElementById('signature-name');

    async function typeMessage() {
        for (let i = 0; i < messageParts.length; i++) {
            const part = messageParts[i];
            const originalText = part.textContent;
            part.textContent = ''; // Clear text for typing
            part.style.width = 'fit-content'; // Allow width to adjust
            part.style.opacity = 1; // Make element visible

            await new Promise(resolve => {
                let charIndex = 0;
                const typingSpeed = 50; // Adjust typing speed (ms per char)
                const interval = setInterval(() => {
                    if (charIndex < originalText.length) {
                        part.textContent += originalText.charAt(charIndex);
                        charIndex++;
                        // Optional: Play a very subtle typing sound here
                    } else {
                        clearInterval(interval);
                        part.style.borderRight = 'none'; // Remove cursor
                        resolve();
                    }
                }, typingSpeed);
            });
            await new Promise(resolve => setTimeout(resolve, 500)); // Pause after each paragraph
        }

        // Animate signature fade in
        signatureText.style.transition = 'opacity 1s ease-in';
        signatureText.style.opacity = 1;
        await new Promise(resolve => setTimeout(resolve, 800)); // Pause before name

        signatureName.style.transition = 'opacity 1s ease-in';
        signatureName.style.opacity = 1;
    }

    // 5. Photo Cube Text Overlay Management
    const cubeFaces = document.querySelectorAll('.cube-face');
    const cubeTextOverlay = document.querySelector('.cube-text-overlay');

    cubeFaces.forEach(face => {
        face.addEventListener('mouseenter', () => {
            const text = face.getAttribute('data-text');
            if (text) {
                cubeTextOverlay.textContent = text;
                cubeTextOverlay.style.opacity = 1;
            }
        });

        face.addEventListener('mouseleave', () => {
            cubeTextOverlay.style.opacity = 0;
            // Clear text after transition to prevent lingering
            setTimeout(() => { cubeTextOverlay.textContent = ''; }, 300);
        });

        // For touch devices, tap to show text briefly
        face.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent default browser behavior (e.g., zoom)
            const text = face.getAttribute('data-text');
            if (text) {
                cubeTextOverlay.textContent = text;
                cubeTextOverlay.style.opacity = 1;
                clearTimeout(face.hideTextTimeout); // Clear previous timeout
                face.hideTextTimeout = setTimeout(() => {
                    cubeTextOverlay.style.opacity = 0;
                    setTimeout(() => { cubeTextOverlay.textContent = ''; }, 300);
                }, 2000); // Show text for 2 seconds on tap
            }
        });
    });

});
