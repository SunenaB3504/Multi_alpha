/**
 * UI functionality for Multiplication Adventure
 */

const UI = (function() {
    // Track current visible section
    let currentSection = 'dashboard';
    
    /**
     * Show a specific section and hide others
     * @param {String} sectionId - The ID of the section to show
     */
    function showSection(sectionId) {
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
        // Update dashboard points
        document.getElementById('points').textContent = points;
        
        // Update rewards center points
        document.getElementById('rewardPoints').textContent = points;
        
        // Update current section points
        const currentSectionElem = document.getElementById(currentSection);
        updateSectionPoints(currentSectionElem);
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
        }
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
    
    // Public API
    return {
        showSection,
        updatePoints,
        updateLevel,
        updateLevelProgress,
        showLevelUpMessage,
        showFeedback,
        setHighContrast,
        setTextSize
    };
})();
