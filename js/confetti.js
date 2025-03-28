/**
 * Simple DOM-based Confetti Animation
 * A more lightweight, reliable approach than canvas-based implementation
 */
(function(global) {
    console.log('Initializing Confetti module...');
    
    // First, check if the Confetti object already exists
    if (global.Confetti) {
        console.log('Confetti module already exists, not overwriting');
        return;
    }
    
    // Default configuration
    const defaults = {
        particleCount: 80,
        colors: ['#ff4e91', '#56c1ff', '#ffd239', '#5de284', '#9b4bff', '#fe8b4c'],
        duration: 3000, // in milliseconds
        spread: 60,
        zIndex: 9999
    };
    
    // Tracking active confetti instances
    let activeConfetti = {};
    
    /**
     * Start confetti animation in the given container
     * @param {Element|String} container - Container element or ID
     * @param {Object} options - Configuration options
     */
    function start(container, options = {}) {
        console.log('🎉 Starting confetti animation');
        
        // Handle string container ID
        if (typeof container === 'string') {
            console.log(`Looking for container by ID: ${container}`);
            container = document.getElementById(container);
        }
        
        // Make sure container exists
        if (!container) {
            console.error('❌ Confetti container not found');
            // Fall back to body if no container specified
            container = document.body;
            console.log('Using body as fallback container');
        }
        
        // Ensure the container is positioned properly
        const containerStyle = window.getComputedStyle(container);
        if (containerStyle.position === 'static') {
            container.style.position = 'relative';
            console.log('Set container to position: relative');
        }
        
        // Combine default options with provided options
        const config = {...defaults, ...options};
        
        // Generate unique ID for this confetti instance
        const id = Date.now().toString();
        
        // Create confetti container
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: ${config.zIndex};
        `;
        
        // Add to container
        container.appendChild(confettiContainer);
        
        // Create particles
        for (let i = 0; i < config.particleCount; i++) {
            createParticle(confettiContainer, config);
        }
        
        // Store in active confetti
        activeConfetti[id] = {
            container: confettiContainer,
            timeout: setTimeout(() => {
                cleanupConfetti(id);
            }, config.duration)
        };
        
        return id;
    }
    
    /**
     * Create a single confetti particle
     * @param {HTMLElement} container - Container for the particle
     * @param {Object} config - Configuration options
     */
    function createParticle(container, config) {
        // Random particle characteristics
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        const size = Math.random() * 10 + 5; // 5-15px
        const left = Math.random() * 100; // 0-100%
        
        // Create particle element
        const particle = document.createElement('div');
        particle.className = 'confetti-particle';
        
        // Set base styles
        particle.style.cssText = `
            position: absolute;
            top: -20px;
            left: ${left}%;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            transform: rotate(${Math.random() * 360}deg);
            opacity: 0.8;
            pointer-events: none;
        `;
        
        // Random particle shape
        const shapeType = Math.floor(Math.random() * 4);
        switch(shapeType) {
            case 0: // square (default)
                break;
            case 1: // circle
                particle.style.borderRadius = '50%';
                break;
            case 2: // triangle
                particle.style.width = '0';
                particle.style.height = '0';
                particle.style.backgroundColor = 'transparent';
                particle.style.borderLeft = `${size/2}px solid transparent`;
                particle.style.borderRight = `${size/2}px solid transparent`;
                particle.style.borderBottom = `${size}px solid ${color}`;
                break;
            case 3: // star
                particle.innerHTML = '★';
                particle.style.backgroundColor = 'transparent';
                particle.style.color = color;
                particle.style.fontSize = `${size * 2}px`;
                particle.style.display = 'flex';
                particle.style.justifyContent = 'center';
                particle.style.alignItems = 'center';
                break;
        }
        
        // Add to container
        container.appendChild(particle);
        
        // Fall animation using CSS
        const duration = 1000 + Math.random() * 2000; // 1-3 seconds
        const delay = Math.random() * 500; // 0-500ms delay
        const horizontalSpread = (Math.random() - 0.5) * config.spread;
        
        // Simple CSS animation for better compatibility
        particle.style.animation = `confetti-fall ${duration}ms ${delay}ms ease-in forwards`;
        
        // Add keyframes if they don't exist yet
        if (!document.getElementById('confetti-keyframes')) {
            const keyframes = document.createElement('style');
            keyframes.id = 'confetti-keyframes';
            keyframes.textContent = `
                @keyframes confetti-fall {
                    0% { 
                        transform: translate(0, 0) rotate(0deg);
                        opacity: 1; 
                    }
                    100% { 
                        transform: translate(${horizontalSpread}px, ${container.clientHeight * 0.8}px) rotate(${Math.random() * 360}deg);
                        opacity: 0.2; 
                    }
                }
            `;
            document.head.appendChild(keyframes);
        }
        
        // Remove particle after animation is complete
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration + delay + 100);
        
        return particle;
    }
    
    /**
     * Clean up confetti animation
     * @param {String} id - Confetti ID to clean up
     */
    function cleanupConfetti(id) {
        if (activeConfetti[id]) {
            clearTimeout(activeConfetti[id].timeout);
            if (activeConfetti[id].container && activeConfetti[id].container.parentNode) {
                activeConfetti[id].container.parentNode.removeChild(activeConfetti[id].container);
                console.log(`Cleaned up confetti ${id}`);
            }
            delete activeConfetti[id];
        }
    }
    
    /**
     * Stop all confetti animations
     */
    function stopAll() {
        Object.keys(activeConfetti).forEach(cleanupConfetti);
        console.log('Stopped all confetti animations');
    }
    
    /**
     * Test function that creates confetti in a visible area
     */
    function test() {
        console.log('Running confetti test');
        // Create a temporary container
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 10%;
            left: 25%;
            width: 50%;
            height: 60%;
            background-color: rgba(255, 255, 255, 0.7);
            border: 3px solid #4CAF50;
            border-radius: 10px;
            z-index: 10000;
            text-align: center;
            padding: 20px;
        `;
        
        // Add test message
        container.innerHTML = '<h3 style="margin-top: 0;">Confetti Test</h3><p>Testing confetti animation...</p>';
        document.body.appendChild(container);
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close Test';
        closeButton.style.cssText = `
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        closeButton.onclick = () => {
            document.body.removeChild(container);
        };
        container.appendChild(closeButton);
        
        // Start confetti
        start(container, { particleCount: 150, duration: 5000 });
        
        return true;
    }
    
    // Create the Confetti interface
    const Confetti = {
        start,
        stop: cleanupConfetti,
        stopAll,
        test
    };
    
    // Expose to global scope
    global.Confetti = Confetti;
    
    // Add a global test function that can be called from the browser console
    global.testConfetti = function() {
        console.log('Testing confetti from global function');
        Confetti.test();
        return 'Confetti test started';
    };
    
    console.log('✅ Confetti module loaded - Use window.testConfetti() to test!');
})(typeof window !== 'undefined' ? window : this);
