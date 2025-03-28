/**
 * Confetti Fix - Emergency fallback if confetti module is not found
 */
(function() {
    console.log('Checking for Confetti module...');
    
    // Wait for DOM content loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Check if Confetti exists
        if (!window.Confetti) {
            console.error('Confetti module not found! Creating emergency fallback...');
            
            // Create minimal confetti fallback
            window.Confetti = {
                start: function(container) {
                    console.log('Using fallback confetti on:', container);
                    
                    // Simple fallback animation - just show some emoji
                    if (typeof container === 'string') {
                        container = document.getElementById(container);
                    }
                    
                    if (!container) {
                        container = document.body;
                    }
                    
                    // Create fallback container
                    const fallbackContainer = document.createElement('div');
                    fallbackContainer.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        text-align: center;
                        overflow: hidden;
                        z-index: 9999;
                    `;
                    
                    // Add some emoji confetti
                    const emojis = ['🎉', '🎊', '✨', '⭐', '🌟'];
                    for (let i = 0; i < 20; i++) {
                        const emoji = document.createElement('div');
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        emoji.innerText = randomEmoji;
                        emoji.style.cssText = `
                            position: absolute;
                            top: ${Math.random() * 100}%;
                            left: ${Math.random() * 100}%;
                            font-size: ${Math.random() * 20 + 10}px;
                            animation: fallEmoji 3s ease-in forwards;
                        `;
                        fallbackContainer.appendChild(emoji);
                    }
                    
                    // Add keyframe animation
                    if (!document.getElementById('emoji-fallback-keyframes')) {
                        const style = document.createElement('style');
                        style.id = 'emoji-fallback-keyframes';
                        style.textContent = `
                            @keyframes fallEmoji {
                                0% { transform: translateY(-10px) rotate(0); opacity: 1; }
                                100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    // Add to container
                    container.appendChild(fallbackContainer);
                    
                    // Remove after animation
                    setTimeout(() => {
                        if (fallbackContainer.parentNode) {
                            fallbackContainer.parentNode.removeChild(fallbackContainer);
                        }
                    }, 3000);
                    
                    return 'fallback-' + Date.now();
                },
                
                stop: function() { 
                    console.log('Fallback confetti stop called');
                },
                
                stopAll: function() {
                    console.log('Fallback confetti stopAll called');
                },
                
                test: function() {
                    console.log('Testing fallback confetti');
                    const container = document.createElement('div');
                    container.style.cssText = `
                        position: fixed;
                        top: 10%;
                        left: 25%;
                        width: 50%; 
                        height: 60%;
                        background-color: rgba(255, 255, 255, 0.7);
                        border: 3px solid red;
                        border-radius: 10px;
                        z-index: 10000;
                        padding: 20px;
                        text-align: center;
                    `;
                    
                    container.innerHTML = '<h3>Fallback Confetti</h3><p>The main confetti module is missing!</p>';
                    document.body.appendChild(container);
                    
                    // Add close button
                    const closeButton = document.createElement('button');
                    closeButton.innerText = 'Close';
                    closeButton.style.marginTop = '20px';
                    closeButton.onclick = () => {
                        document.body.removeChild(container);
                    };
                    container.appendChild(closeButton);
                    
                    this.start(container);
                }
            };
            
            // Add a warning on the page
            const warning = document.createElement('div');
            warning.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                background-color: #ff9800;
                color: white;
                padding: 10px;
                font-size: 12px;
                z-index: 10000;
            `;
            warning.textContent = 'Warning: Using fallback confetti module!';
            document.body.appendChild(warning);
            
            console.log('Fallback confetti module created');
        } else {
            console.log('✓ Confetti module found and ready');
        }
    });
})();
