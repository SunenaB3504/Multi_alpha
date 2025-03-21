/**
 * UI functionality for Multiplication Adventure
 */

const UI = (function() {
    // Track current visible section
    let currentSection = 'dashboard';
    
    /**
     * Initialize UI module
     */
    function init() {
        console.log('Initializing UI module');
    }
    
    /**
     * Show a specific section and hide others
     * @param {String} sectionId - The ID of the section to show
     */
    function showSection(sectionId) {
        console.log('Showing section:', sectionId);
        
        // Hide all sections
        const sections = document.querySelectorAll('.app-section');
        sections.forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
        });
        
        // Show the requested section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
            currentSection = sectionId;
            
            // Update points display in section header if it exists
            updateSectionPoints(targetSection);
        } else {
            console.error(`Section with ID ${sectionId} not found`);
        }
    }
    
    /**
     * Update points display in section header
     * @param {Element} section - The section element
     */
    function updateSectionPoints(section) {
        const pointsDisplay = section.querySelector('.points-value');
        if (pointsDisplay) {
            pointsDisplay.textContent = AppCore.getState().points;
        }
    }
    
    /**
     * Update points display throughout the app
     * @param {Number} points - Current points total
     */
    function updatePoints(points) {
        console.log('UI: Updating points displays to:', points);
        
        try {
            // Ensure points is a number
            points = parseInt(points) || 0;
            
            // Update all points displays
            document.querySelectorAll('.points-value').forEach(el => {
                el.textContent = points;
            });
            
            // Update specific points displays
            const pointsElement = document.getElementById('points');
            if (pointsElement) pointsElement.textContent = points;
            
            const currentPointsElement = document.getElementById('currentPoints');
            if (currentPointsElement) currentPointsElement.textContent = points;
            
            const rewardPointsElement = document.getElementById('rewardPoints');
            if (rewardPointsElement) rewardPointsElement.textContent = points;
            
            // Update current section points
            const currentSectionElem = document.getElementById(currentSection);
            if (currentSectionElem) {
                updateSectionPoints(currentSectionElem);
            }
            
            console.log('UI: Points displays updated successfully');
        } catch (err) {
            console.error('Error updating points displays:', err);
        }
    }
    
    /**
     * Update level display
     * @param {Number} level - Current user level
     */
    function updateLevel(level) {
        document.getElementById('level').textContent = level;
    }
    
    /**
     * Update level progress bar
     * @param {Number} currentPoints - Points in current level
     * @param {Number} nextLevelPoints - Points needed for next level
     */
    function updateLevelProgress(currentPoints, nextLevelPoints) {
        const progressBar = document.getElementById('levelProgressBar');
        const currentPointsElem = document.getElementById('currentPoints');
        const nextLevelPointsElem = document.getElementById('nextLevelPoints');
        
        // Calculate percentage
        const percentage = Math.min((currentPoints / nextLevelPoints) * 100, 100);
        
        // Update progress bar
        progressBar.style.width = `${percentage}%`;
        
        // Update text displays
        currentPointsElem.textContent = currentPoints;
        nextLevelPointsElem.textContent = nextLevelPoints;
    }
    
    /**
     * Show level up celebration message
     * @param {Number} newLevel - The new level achieved
     */
    function showLevelUpMessage(newLevel) {
        // Create popup element
        const popup = document.createElement('div');
        popup.className = 'level-up-popup';
        popup.innerHTML = `
            <div class="level-up-content">
                <h2>Level Up!</h2>
                <p>Congratulations! You've reached Level ${newLevel}!</p>
                <div class="level-up-icon">🏆</div>
                <button class="btn-primary">Continue</button>
            </div>
        `;
        
        // Add popup to document
        document.body.appendChild(popup);
        
        // Add animation class after a small delay (for transition effect)
        setTimeout(() => {
            popup.classList.add('active');
        }, 10);
        
        // Remove popup when button is clicked
        popup.querySelector('button').addEventListener('click', () => {
            popup.classList.remove('active');
            setTimeout(() => {
                popup.remove();
            }, 300);
        });
    }
    
    /**
     * Show feedback message
     * @param {String} elementId - ID of feedback element
     * @param {String} message - Message to display
     * @param {Boolean} isSuccess - Whether it's a success or error message
     */
    function showFeedback(elementId, message, isSuccess) {
        const feedbackElem = document.getElementById(elementId);
        if (feedbackElem) {
            feedbackElem.textContent = message;
            feedbackElem.className = 'feedback';
            feedbackElem.classList.add(isSuccess ? 'success' : 'error');
            
            // Clear feedback after a delay if it's an error
            if (!isSuccess) {
                setTimeout(() => {
                    feedbackElem.textContent = '';
                    feedbackElem.className = 'feedback';
                }, 3000);
            }
        } else {
            console.error(`Feedback element with ID ${elementId} not found`);
        }
    }
    
    /**
     * Apply high contrast mode (dark mode)
     * @param {Boolean} enabled - Whether high contrast is enabled
     */
    function setHighContrast(enabled) {
        const root = document.documentElement;
        
        if (enabled) {
            // Dark mode colors
            root.style.setProperty('--primary-color', '#a742f5'); // Brighter purple
            root.style.setProperty('--secondary-color', '#7c4dff'); // Deeper purple
            root.style.setProperty('--accent-color', '#ff9800'); // Bright orange
            root.style.setProperty('--background-color', '#121212'); // Dark background
            root.style.setProperty('--text-color', '#f5f5f5'); // Light text
            root.style.setProperty('--card-color', '#1e1e1e'); // Dark card
            root.style.setProperty('--light-text', '#bbbbbb'); // Lighter gray text
            root.style.setProperty('--shadow', '0 4px 8px rgba(0, 0, 0, 0.5)'); // Darker shadow
            
            // Additional dark mode specific overrides for better visibility
            root.style.setProperty('--instruction-color', '#e0e0e0'); // Brighter text for instructions
            root.style.setProperty('--table-btn-text', '#ffffff'); // White text for table buttons
            root.style.setProperty('--table-btn-border', '#7c4dff'); // Visible border for buttons
            
            // Add dark mode class to body for CSS-specific overrides
            document.body.classList.add('dark-mode');
        } else {
            // Regular purple and orange theme
            root.style.setProperty('--primary-color', '#8a2be2'); // Purple
            root.style.setProperty('--secondary-color', '#9370db'); // Medium Purple
            root.style.setProperty('--accent-color', '#ff8c00'); // Dark Orange
            root.style.setProperty('--background-color', '#f5f5f5'); // Light gray
            root.style.setProperty('--text-color', '#333333'); // Dark text
            root.style.setProperty('--card-color', '#ffffff'); // White cards
            root.style.setProperty('--light-text', '#666666'); // Light gray text
            root.style.setProperty('--shadow', '0 4px 8px rgba(0, 0, 0, 0.1)'); // Standard shadow
            
            // Reset additional properties
            root.style.setProperty('--instruction-color', '#666666'); // Default instruction color
            root.style.setProperty('--table-btn-text', '#333333'); // Default button text
            root.style.setProperty('--table-btn-border', '#8a2be2'); // Default button border
            
            // Remove dark mode class
            document.body.classList.remove('dark-mode');
        }
        
        // Update specific elements that might need immediate style changes
        updateDarkModeSpecificElements(enabled);
    }
    
    /**
     * Update specific elements that need immediate style changes in dark mode
     * @param {Boolean} isDarkMode - Whether dark mode is enabled
     */
    function updateDarkModeSpecificElements(isDarkMode) {
        // Update instruction text color
        const instructions = document.querySelectorAll('.instruction');
        instructions.forEach(el => {
            el.style.color = isDarkMode ? '#e0e0e0' : '';
        });
        
        // Update table button styles
        const tableButtons = document.querySelectorAll('.table-btn');
        tableButtons.forEach(btn => {
            if (isDarkMode) {
                if (!btn.classList.contains('selected')) {
                    btn.style.color = '#ffffff';
                    btn.style.borderColor = '#7c4dff';
                    btn.style.backgroundColor = '#2d2d2d';
                }
            } else {
                if (!btn.classList.contains('selected')) {
                    btn.style.color = '';
                    btn.style.borderColor = '';
                    btn.style.backgroundColor = '';
                }
            }
        });
    }
    
    /**
     * Apply text size setting
     * @param {String} size - Size setting ('small', 'medium', or 'large')
     */
    function setTextSize(size) {
        const root = document.documentElement;
        
        switch (size) {
            case 'small':
                root.style.fontSize = '14px';
                break;
            case 'medium':
                root.style.fontSize = '16px';
                break;
            case 'large':
                root.style.fontSize = '18px';
                break;
            default:
                root.style.fontSize = '16px';
        }
    }
    
    /**
     * Show a dancing dog celebration animation
     * Global function for showing celebration across the app
     */
    function showCelebrationAnimation() {
        try {
            console.log('Showing dancing dog celebration animation');
            
            // Create animation container if it doesn't exist
            let gifContainer = document.getElementById('celebrationContainer');
            
            if (!gifContainer) {
                gifContainer = document.createElement('div');
                gifContainer.id = 'celebrationContainer';
                gifContainer.className = 'correct-gif-container';
                gifContainer.innerHTML = `
                    <img id="celebrationGif" 
                         src="images/dancing_dog.gif" 
                         alt="Dancing dog celebration" 
                         onload="console.log('Dancing dog animation loaded')"
                         onerror="this.onerror=null; this.src='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjdsOWsweXE5ZngzaGFiMm5mMWprdG4zangyOW8wZDc0Y2pxODNuZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9tx0gy61kmcdG/giphy.gif';">
                    <p style="margin: 10px 0; color: #8B4513; font-weight: bold;">Great job! 🎉</p>
                    <div class="celebration-fallback">
                        <i class="fas fa-dog celebration-star"></i>
                        <i class="fas fa-bone celebration-star"></i>
                        <i class="fas fa-dog celebration-star"></i>
                    </div>
                `;
                
                // Append to active section
                const activeSection = document.querySelector('.app-section.active');
                if (activeSection) {
                    const card = activeSection.querySelector('.card');
                    if (card) {
                        card.appendChild(gifContainer);
                    } else {
                        activeSection.appendChild(gifContainer);
                    }
                } else {
                    document.body.appendChild(gifContainer);
                }
            }
            
            // Force animation to be visible
            gifContainer.setAttribute('style', 
                'display: block !important; ' +
                'visibility: visible !important; ' +
                'opacity: 1 !important; ' + 
                'background-color: rgba(245, 245, 220, 0.4) !important; ' +
                'border: 3px solid #8B4513 !important; ' +
                'z-index: 9999 !important; ' +
                'position: relative !important; ' +
                'max-height: none !important; ' +
                'overflow: visible !important;'
            );
            
            // Force GIF reload
            const gif = gifContainer.querySelector('img');
            if (gif) {
                const originalSrc = gif.src;
                gif.src = 'about:blank';
                setTimeout(() => {
                    gif.src = originalSrc;
                }, 50);
                
                gif.style.cssText = 'display: block !important; max-width: 220px !important; max-height: 220px !important;';
            }
            
            // Hide after delay
            setTimeout(() => {
                gifContainer.style.transition = 'opacity 1s ease';
                gifContainer.style.opacity = '0';
                
                setTimeout(() => {
                    gifContainer.style.display = 'none';
                    gifContainer.remove(); // Remove from DOM when done
                }, 1000);
            }, 5000);
            
        } catch (error) {
            console.error('Error showing celebration animation:', error);
        }
    }

    // Public API
    return {
        init,
        showSection,
        updatePoints,
        updateLevel,
        updateLevelProgress,
        showLevelUpMessage,
        showFeedback,
        setHighContrast,
        setTextSize,
        showCelebrationAnimation // Add the new function to the public API
    };
})();

// Initialize UI module when document is ready
document.addEventListener('DOMContentLoaded', UI.init);

console.log('UI module loaded');
