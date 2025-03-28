/**
 * Flash Cards Game module for Multiplication Adventure
 */

const Game = (function() {
    // Game state
    let currentProblem = null;
    let timeStarted = 0;
    let timerDuration = 15; // Default timer in seconds
    let gameActive = false;
    let score = 0;
    let problems = 0;
    
    /**
     * Initialize the game module
     */
    function init() {
        console.log('Initializing Flash Cards game module');
        
        // Get timer duration from settings
        const timerSettings = document.getElementById('timerDuration');
        if (timerSettings && timerSettings.value) {
            timerDuration = parseInt(timerSettings.value);
        }
        
        // Set up submit button with direct onclick handler
        const submitBtn = document.getElementById('submitGame');
        if (submitBtn) {
            submitBtn.onclick = function(e) {
                e.preventDefault();
                console.log('Game submit button clicked');
                checkAnswer();
                return false;
            };
        } else {
            console.error('Submit game button not found!');
        }
        
        // Set up enter key handler
        const input = document.getElementById('gameInput');
        if (input) {
            input.onkeypress = function(e) {
                if (e.key === 'Enter' && gameActive) {
                    e.preventDefault();
                    checkAnswer();
                }
            };
        }
        
        // Set up next problem button
        const nextBtn = document.getElementById('nextProblem');
        if (nextBtn) {
            nextBtn.onclick = function(e) {
                e.preventDefault();
                generateProblem();
            };
            nextBtn.style.display = 'none'; // Hide initially
        }
        
        console.log('Game module initialized');
    }
    
    /**
     * Start a new game session
     */
    function startGame() {
        console.log('Starting new Flash Cards game');
        gameActive = true;
        score = 0;
        problems = 0;
        
        // Reset UI
        const feedback = document.getElementById('gameFeedback');
        if (feedback) {
            feedback.textContent = '';
            feedback.className = 'feedback';
        }
        
        // Generate first problem
        generateProblem();
    }
    
    /**
     * Generate a new problem for the game
     */
    function generateProblem() {
        console.log('Generating new game problem');
        
        // Get the current level tables
        const tables = MultiplicationTables.getCurrentLevelTables();
        
        // Generate a problem
        currentProblem = MultiplicationTables.getProblemFromTables(tables);
        console.log('Generated game problem:', currentProblem);
        
        // Display the problem
        document.getElementById('gameFactor1').textContent = currentProblem.factor1;
        document.getElementById('gameFactor2').textContent = currentProblem.factor2;
        
        // Clear input and feedback
        const input = document.getElementById('gameInput');
        if (input) {
            input.value = '';
            input.disabled = false;
            input.focus();
        }
        
        const feedback = document.getElementById('gameFeedback');
        if (feedback) {
            feedback.textContent = '';
            feedback.className = 'feedback';
        }
        
        // Hide next button
        const nextBtn = document.getElementById('nextProblem');
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        
        // Start timer
        timeStarted = Date.now();
        MathUtils.startTimer(timerDuration, null, function() {
            // Time's up!
            timeUp();
        });
    }
    
    /**
     * Check the user's answer
     */
    function checkAnswer() {
        if (!currentProblem || !gameActive) {
            console.error('No active game problem to check');
            return;
        }
        
        // Stop the timer
        MathUtils.stopTimer();
        
        // Get time taken
        const timeTaken = (Date.now() - timeStarted) / 1000;
        
        // Get user's answer
        const input = document.getElementById('gameInput');
        if (!input) {
            console.error('Game input not found');
            return;
        }
        
        const userAnswer = parseInt(input.value.trim());
        
        // Validate input
        if (isNaN(userAnswer)) {
            UI.showFeedback('gameFeedback', 'Please enter a number', false);
            return;
        }
        
        // Check answer
        const isCorrect = userAnswer === currentProblem.answer;
        console.log(`Answer check: ${userAnswer} === ${currentProblem.answer} = ${isCorrect}`);
        
        // Calculate points
        let pointsEarned = 0;
        if (isCorrect) {
            // Calculate points based on time taken
            const level = MultiplicationTables.getCurrentLevel();
            pointsEarned = MathUtils.calculatePoints(timeTaken, level);
            
            // Update score
            score += pointsEarned;
            
            // Add points to user's account - with improved error handling
            try {
                console.log('Game: Awarding points:', pointsEarned);
                if (window.AppCore && typeof window.AppCore.addPoints === 'function') {
                    const newTotal = window.AppCore.addPoints(pointsEarned);
                    console.log('Game: New total points:', newTotal);
                } else {
                    console.error('AppCore.addPoints is not available');
                }
            } catch (err) {
                console.error('Error adding points in game:', err);
            }
            
            // DIRECT APPROACH: Create and show dancing dog animation right in the Flash Cards section
            showDancingDogInFlashCards();
            
            // Play correct sound
            if (window.SoundManager) {
                SoundManager.play('correct');
            }
        } else {
            // Play incorrect sound
            if (window.SoundManager) {
                SoundManager.play('incorrect');
            }
        }
        
        // Increment problem count
        problems++;
        
        // Show feedback
        if (isCorrect) {
            UI.showFeedback(
                'gameFeedback', 
                `Correct! ${currentProblem.factor1} × ${currentProblem.factor2} = ${currentProblem.answer}. +${pointsEarned} points!`, 
                true
            );
        } else {
            UI.showFeedback(
                'gameFeedback', 
                `Incorrect. The answer is ${currentProblem.answer}.`, 
                false
            );
        }
        
        // Disable input
        input.disabled = true;
        
        // Show next button
        const nextBtn = document.getElementById('nextProblem');
        if (nextBtn) {
            nextBtn.style.display = 'block';
        }
    }
    
    /**
     * Direct method to show dancing dog in Flash Cards
     * This bypasses the UI module to ensure it works
     */
    function showDancingDogInFlashCards() {
        console.log('Directly showing dancing dog in Flash Cards');
        
        // Get Flash Cards section card
        const gameCard = document.querySelector('#game .card');
        if (!gameCard) {
            console.error('Flash Cards card element not found');
            return;
        }
        
        // Create animation container
        const dogContainer = document.createElement('div');
        dogContainer.className = 'game-celebration-container';
        dogContainer.style.cssText = `
            display: block;
            visibility: visible;
            opacity: 1;
            background-color: rgba(245, 245, 220, 0.9);
            border: 5px solid #8B4513;
            border-radius: 12px;
            padding: 15px;
            margin: 15px auto;
            max-width: 280px;
            text-align: center;
            z-index: 9999;
            position: relative;
        `;
        
        // Create dog animation content
        dogContainer.innerHTML = `
            <img src="images/dancing_dog.gif" 
                 alt="Dancing dog celebration" 
                 style="display: block; max-width: 220px; max-height: 220px; margin: 0 auto; border-radius: 8px;"
                 onerror="this.src='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjdsOWsweXE5ZngzaGFiMm5mMWprdG4zangyOW8wZDc0Y2pxODNuZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9tx0gy61kmcdG/giphy.gif';" />
            <p style="margin: 10px 0; color: #8B4513; font-weight: bold;">Great job! 🎉</p>
            <div style="display: flex; justify-content: center; margin-top: 10px;">
                <i class="fas fa-dog" style="color: #8B4513; font-size: 30px; margin: 0 10px;"></i>
                <i class="fas fa-bone" style="color: #D2B48C; font-size: 25px; margin: 0 10px;"></i>
                <i class="fas fa-dog" style="color: #8B4513; font-size: 30px; margin: 0 10px;"></i>
            </div>
        `;
        
        // First remove any existing animation
        const existingAnimation = document.querySelector('.game-celebration-container');
        if (existingAnimation) {
            existingAnimation.remove();
        }
        
        // Add to the game card, after the feedback element
        const feedbackElem = document.getElementById('gameFeedback');
        if (feedbackElem) {
            feedbackElem.parentNode.insertBefore(dogContainer, feedbackElem.nextSibling);
        } else {
            gameCard.appendChild(dogContainer);
        }
        
        // Remove after 5 seconds
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
        
        // Also try the regular UI method as a backup
        if (window.UI && UI.showCelebrationAnimation) {
            try {
                setTimeout(() => UI.showCelebrationAnimation(), 100);
            } catch (e) {
                console.log('Backup animation method failed, but direct method should work');
            }
        }
    }
    
    /**
     * Handle when time runs out
     */
    function timeUp() {
        if (!gameActive) return;
        
        console.log('Time\'s up!');
        
        // Show feedback
        UI.showFeedback(
            'gameFeedback', 
            `Time's up! The answer is ${currentProblem.answer}.`, 
            false
        );
        
        // Play error sound
        if (window.SoundManager) {
            SoundManager.play('error');
        }
        
        // Disable input
        const input = document.getElementById('gameInput');
        if (input) {
            input.disabled = true;
        }
        
        // Show next button
        const nextBtn = document.getElementById('nextProblem');
        if (nextBtn) {
            nextBtn.style.display = 'block';
        }
        
        // Increment problem count
        problems++;
    }
    
    /**
     * Reset the game module
     */
    function reset() {
        gameActive = false;
        MathUtils.stopTimer();
    }
    
    // Initialize module when document is ready
    document.addEventListener('DOMContentLoaded', init);
    
    // Public API
    return {
        startGame,
        reset,
        checkAnswer // Expose for testing
    };
})();

// Make it globally available
window.Game = Game;

console.log('Game module loaded');
