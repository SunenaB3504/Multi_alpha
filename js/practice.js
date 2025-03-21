/**
 * Custom Practice functionality for Multiplication Adventure
 */

// Make sure MultiplicationTables is available
window.MultiplicationTables = window.MultiplicationTables || {
    getProblemFromTables: function(tables) {
        console.log('Fallback multiplication table generator used');
        // Simple fallback if the real module isn't loaded
        const table = tables[Math.floor(Math.random() * tables.length)];
        const factor2 = Math.floor(Math.random() * 12) + 1;
        return {
            factor1: table,
            factor2: factor2,
            answer: table * factor2
        };
    }
};

const Practice = (function() {
    // Practice state
    let selectedTables = [];
    let currentProblem = null;
    let practiceActive = false;
    
    /**
     * Initialize practice module
     */
    function init() {
        console.log('Initializing custom practice module');
        
        // Reset any previous state
        selectedTables = [];
        
        // Set up table selection buttons
        setupTableButtons();
        
        // Set up generate practice button with direct event handling
        const generateBtn = document.getElementById('generatePractice');
        if (generateBtn) {
            // Clear existing listeners by cloning
            const newBtn = generateBtn.cloneNode(true);
            generateBtn.parentNode.replaceChild(newBtn, generateBtn);
            
            // Add new listener
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Generate practice button clicked directly');
                startPracticeDirectly();
            });
        } else {
            console.error('Generate practice button not found');
        }
        
        // Submit answer button - direct attachment
        const submitBtn = document.getElementById('submitCustom');
        if (submitBtn) {
            submitBtn.onclick = function(e) {
                e.preventDefault();
                console.log('Submit answer clicked');
                checkAnswer();
            };
        }
        
        // Next problem button - direct attachment
        const nextBtn = document.getElementById('nextCustomProblem');
        if (nextBtn) {
            nextBtn.onclick = function(e) {
                e.preventDefault();
                console.log('Next problem clicked');
                nextProblem();
            };
        }
        
        // Allow submitting with Enter key
        const input = document.getElementById('customInput');
        if (input) {
            input.onkeypress = function(e) {
                if (e.key === 'Enter' && practiceActive) {
                    e.preventDefault();
                    checkAnswer();
                }
            };
        }
        
        // Hide practice area initially
        const practiceArea = document.querySelector('.custom-practice-area');
        if (practiceArea) {
            practiceArea.classList.add('hidden');
            practiceArea.style.display = 'none';
        }
        
        const nextProblemBtn = document.getElementById('nextCustomProblem');
        if (nextProblemBtn) {
            nextProblemBtn.style.display = 'none';
        }
    }
    
    // Function to start practice directly - bypassing module encapsulation issues
    function startPracticeDirectly() {
        console.log('Direct practice start function called');
        
        // Check if any tables are selected
        if (selectedTables.length === 0) {
            alert('Please select at least one multiplication table.');
            return;
        }
        
        console.log(`Starting practice with tables: ${selectedTables}`);
        
        // Set practice as active
        practiceActive = true;
        
        // Show practice area with multiple methods
        const practiceArea = document.querySelector('.custom-practice-area');
        if (practiceArea) {
            practiceArea.classList.remove('hidden');
            practiceArea.style.display = 'block';
            console.log('Practice area should now be visible');
        } else {
            console.error('Practice area not found in DOM');
        }
        
        // Generate first problem
        try {
            nextProblem();
        } catch (error) {
            console.error('Error generating problem:', error);
            alert('There was an error starting practice. Please try again.');
        }
    }
    
    /**
     * Set up table selection buttons - simplified for reliability
     */
    function setupTableButtons() {
        const tableButtons = document.querySelectorAll('.table-btn');
        console.log(`Found ${tableButtons.length} table buttons`);
        
        tableButtons.forEach(button => {
            // Clear any existing event listeners by cloning and replacing
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add click event with simple, direct handling
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const tableNum = parseInt(this.dataset.table);
                console.log(`Button clicked for table ${tableNum}`);
                
                // Toggle selection visually first for immediate feedback
                this.classList.toggle('selected');
                
                // Then update the data model
                if (this.classList.contains('selected')) {
                    selectedTables.push(tableNum);
                    console.log(`Added table ${tableNum}, selected tables: ${selectedTables}`);
                } else {
                    selectedTables = selectedTables.filter(num => num !== tableNum);
                    console.log(`Removed table ${tableNum, selectedTables}`);
                }
                
                // Visual debugging - add/change text content to confirm selection
                updateButtonVisuals();
            });
        });
    }
    
    /**
     * Update button visuals to match selected state
     */
    function updateButtonVisuals() {
        const tableButtons = document.querySelectorAll('.table-btn');
        
        tableButtons.forEach(button => {
            const tableNum = parseInt(button.dataset.table);
            const isSelected = selectedTables.includes(tableNum);
            
            // Ensure visual state matches data model
            if (isSelected && !button.classList.contains('selected')) {
                button.classList.add('selected');
            } else if (!isSelected && button.classList.contains('selected')) {
                button.classList.remove('selected');
            }
            
            // Update button text for clarity
            button.innerHTML = `${tableNum}× ${isSelected ? '✓' : ''}`;
        });
    }
    
    /**
     * Generate next practice problem
     */
    function nextProblem() {
        console.log('Generating next problem');
        
        try {
            // Generate problem from selected tables
            if (!window.MultiplicationTables) {
                console.error('MultiplicationTables module not found!');
                return;
            }
            
            currentProblem = window.MultiplicationTables.getProblemFromTables(selectedTables);
            console.log('Generated problem:', currentProblem);
            
            // Display problem
            const factor1El = document.getElementById('customFactor1');
            const factor2El = document.getElementById('customFactor2');
            
            if (factor1El && factor2El) {
                factor1El.textContent = currentProblem.factor1;
                factor2El.textContent = currentProblem.factor2;
            } else {
                console.error('Factor elements not found in DOM');
            }
            
            // Clear input and feedback
            const input = document.getElementById('customInput');
            if (input) {
                input.value = '';
                input.disabled = false;
                setTimeout(() => input.focus(), 100);
            }
            
            const feedback = document.getElementById('customFeedback');
            if (feedback) {
                feedback.textContent = '';
                feedback.className = 'feedback';
            }
            
            // Hide next button
            const nextBtn = document.getElementById('nextCustomProblem');
            if (nextBtn) {
                nextBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Error in nextProblem:', error);
        }
    }
    
    /**
     * Check user's answer
     */
    function checkAnswer() {
        console.log('Checking answer');
        
        if (!currentProblem || !practiceActive) {
            console.error('No active problem to check');
            return;
        }
        
        // Get user's answer
        const input = document.getElementById('customInput');
        if (!input) {
            console.error('Input element not found');
            return;
        }
        
        const userAnswer = parseInt(input.value.trim());
        
        // Validate input
        if (isNaN(userAnswer)) {
            if (window.UI && window.UI.showFeedback) {
                window.UI.showFeedback('customFeedback', 'Please enter a number', false);
            } else {
                const feedback = document.getElementById('customFeedback');
                if (feedback) {
                    feedback.textContent = 'Please enter a number';
                    feedback.className = 'feedback error';
                }
            }
            return;
        }
        
        // Check answer
        const isCorrect = userAnswer === currentProblem.answer;
        console.log(`Answer check: ${userAnswer} === ${currentProblem.answer} = ${isCorrect}`);
        
        // Calculate points
        let pointsEarned = 0;
        if (isCorrect) {
            // Base points (less than assessment or game since this is practice)
            pointsEarned = 5;
            
            // Add points to user's account - with improved error handling
            try {
                console.log('Practice: Awarding points:', pointsEarned);
                if (window.AppCore && typeof window.AppCore.addPoints === 'function') {
                    const newTotal = window.AppCore.addPoints(pointsEarned);
                    console.log('Practice: New total points:', newTotal);
                } else {
                    console.error('AppCore.addPoints is not available');
                }
            } catch (err) {
                console.error('Error adding points in practice:', err);
            }
            
            // Show celebration animation - use direct method for reliability
            showDancingDogInCustomPractice();
        }
        
        // Show feedback
        if (isCorrect) {
            if (window.UI && window.UI.showFeedback) {
                window.UI.showFeedback(
                    'customFeedback', 
                    `Correct! ${currentProblem.factor1} × ${currentProblem.factor2} = ${currentProblem.answer}. +${pointsEarned} points!`, 
                    true
                );
            } else {
                const feedback = document.getElementById('customFeedback');
                if (feedback) {
                    feedback.textContent = `Correct! ${currentProblem.factor1} × ${currentProblem.factor2} = ${currentProblem.answer}. +${pointsEarned} points!`;
                    feedback.className = 'feedback success';
                }
            }
        } else {
            if (window.UI && window.UI.showFeedback) {
                window.UI.showFeedback(
                    'customFeedback', 
                    `Incorrect. The answer is ${currentProblem.answer}.`, 
                    false
                );
            } else {
                const feedback = document.getElementById('customFeedback');
                if (feedback) {
                    feedback.textContent = `Incorrect. The answer is ${currentProblem.answer}.`;
                    feedback.className = 'feedback error';
                }
            }
        }
        
        // Disable input and show next button
        if (input) {
            input.disabled = true;
        }
        
        const nextBtn = document.getElementById('nextCustomProblem');
        if (nextBtn) {
            nextBtn.style.display = 'block';
        }
    }
    
    /**
     * Direct method to show dancing dog in Custom Practice
     * This ensures the animation works reliably in this section
     */
    function showDancingDogInCustomPractice() {
        console.log('Directly showing dancing dog in Custom Practice');
        
        try {
            // Get the practice area
            const practiceArea = document.querySelector('.custom-practice-area');
            if (!practiceArea) {
                console.error('Custom practice area not found');
                return;
            }
            
            // Create the animation container
            const dogContainer = document.createElement('div');
            dogContainer.className = 'practice-celebration-container';
            dogContainer.style.cssText = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                background-color: rgba(245, 245, 220, 0.9) !important;
                border: 5px solid #8B4513 !important;
                border-radius: 12px !important;
                padding: 15px !important;
                margin: 15px auto !important;
                max-width: 280px !important;
                text-align: center !important;
                z-index: 9999 !important;
                position: relative !important;
            `;
            
            // Add the dog animation content
            dogContainer.innerHTML = `
                <img src="images/dancing_dog.gif" 
                     alt="Dancing dog celebration" 
                     style="display: block !important; max-width: 220px !important; max-height: 220px !important; margin: 0 auto !important; border-radius: 8px !important;"
                     onerror="this.src='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjdsOWsweXE5ZngzaGFiMm5mMWprdG4zangyOW8wZDc0Y2pxODNuZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9tx0gy61kmcdG/giphy.gif';" />
                <p style="margin: 10px 0; color: #8B4513; font-weight: bold;">Great job! 🎉</p>
                <div style="display: flex; justify-content: center; margin-top: 10px;">
                    <i class="fas fa-dog" style="color: #8B4513; font-size: 30px; margin: 0 10px; animation: bounce 1s infinite alternate;"></i>
                    <i class="fas fa-bone" style="color: #D2B48C; font-size: 25px; margin: 0 10px; animation: rotate 1.5s infinite linear;"></i>
                    <i class="fas fa-dog" style="color: #8B4513; font-size: 30px; margin: 0 10px; animation: bounce 1s infinite alternate;"></i>
                </div>
            `;
            
            // Remove any existing animation
            const existingAnimation = document.querySelector('.practice-celebration-container');
            if (existingAnimation) {
                existingAnimation.remove();
            }
            
            // Find the right place to insert it (after feedback)
            const feedback = document.getElementById('customFeedback');
            if (feedback) {
                feedback.parentNode.insertBefore(dogContainer, feedback.nextSibling);
            } else {
                // If no feedback element, just add it to the practice area
                practiceArea.appendChild(dogContainer);
            }
            
            // Remove after a timeout
            setTimeout(() => {
                if (dogContainer && dogContainer.parentNode) {
                    dogContainer.style.transition = 'opacity 1s ease';
                    dogContainer.style.opacity = '0';
                    
                    setTimeout(() => {
                        if (dogContainer && dogContainer.parentNode) {
                            dogContainer.remove();
                        }
                    }, 1000);
                }
            }, 5000);
            
        } catch (error) {
            console.error('Error showing custom practice celebration:', error);
        }
    }
    
    /**
     * Reset practice module
     */
    function reset() {
        // Clear selected tables
        selectedTables = [];
        
        // Reset UI
        document.querySelectorAll('.table-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Hide practice area
        document.querySelector('.custom-practice-area').classList.add('hidden');
        
        // Set practice as inactive
        practiceActive = false;
    }
    
    // Public API
    return {
        init,
        reset,
        startPractice: startPracticeDirectly,
        updateButtonVisuals,
        nextProblem,
        checkAnswer
    };
})();

// Initialize practice module when document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing practice module');
    if (Practice && Practice.init) {
        Practice.init();
    } else {
        console.error('Practice module not defined');
    }
    
    // Make startPractice globally accessible for direct calling
    window.startPracticeDirectly = function() {
        console.log('Global practice start function called');
        if (Practice && Practice.startPractice) {
            Practice.startPractice();
        }
    };
    
    // Fix the generate practice button with direct onclick
    setTimeout(function() {
        const generateBtn = document.getElementById('generatePractice');
        if (generateBtn) {
            console.log('Adding direct onclick to generate practice button');
            generateBtn.onclick = function(e) {
                e.preventDefault();
                console.log('Generate practice button clicked via onclick');
                if (Practice && Practice.startPractice) {
                    Practice.startPractice();
                } else {
                    window.startPracticeDirectly();
                }
            };
        }
    }, 500);
});

// Completely revised animation function to ensure visibility
function showSimpleAnimation() {
    try {
        console.log('Showing animation with enhanced visibility');
        
        // Get container
        const gifContainer = document.getElementById('correctGifContainer');
        if (!gifContainer) {
            console.error('Animation container not found!');
            return;
        }
        
        // Force animation to be visible with direct DOM manipulation
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
        
        // Remove any classes that might hide it
        gifContainer.classList.remove('hidden');
        
        // Force GIF reload to ensure animation plays
        const gif = document.getElementById('correctGif');
        if (gif) {
            // Save original src
            const originalSrc = gif.src;
            
            // Force reload by briefly changing src
            gif.src = 'about:blank';
            
            // Set src back to original after a brief delay
            setTimeout(() => {
                gif.src = originalSrc;
                console.log('GIF source reloaded:', originalSrc);
            }, 50);
            
            // Make sure GIF is visible
            gif.style.cssText = 'display: block !important; max-width: 220px !important; max-height: 220px !important;';
        }
        
        // Show the container for a longer time
        setTimeout(() => {
            console.log('Hiding animation container');
            // Gradually fade out
            gifContainer.style.transition = 'opacity 1s ease';
            gifContainer.style.opacity = '0';
            
            // Then hide completely after fade
            setTimeout(() => {
                gifContainer.style.display = 'none';
                gifContainer.classList.add('hidden');
            }, 1000);
        }, 8000); // Show for 8 seconds
        
    } catch (error) {
        console.error('Error showing animation:', error);
    }
}

// Make this function directly accessible
window.showDancingDog = showSimpleAnimation;

// Ensure the direct click handler is attached to generatePractice
window.addEventListener('load', function() {
    const generateBtn = document.getElementById('generatePractice');
    if (generateBtn) {
        generateBtn.onclick = function() {
            console.log('Start Practice clicked from window.load');
            startPracticeDirectly();
            return false;
        };
    }
});
