/**
 * Flash Cards Game for Multiplication Adventure
 */

const Game = (function() {
    // Game state
    let currentProblem = null;
    let problemStartTime = 0;
    let gameScore = 0;
    let problemsAttempted = 0;
    let timerDuration = 15; // Default seconds
    
    /**
     * Initialize game module
     */
    function init() {
        // Set up event listeners
        const submitBtn = document.getElementById('submitGame');
        const input = document.getElementById('gameInput');
        const nextBtn = document.getElementById('nextProblem');
        
        submitBtn.addEventListener('click', checkAnswer);
        nextBtn.addEventListener('click', nextProblem);
        
        // Allow submitting with Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
        
        // Hide next button initially
        document.getElementById('nextProblem').style.display = 'none';
    }
    
    /**
     * Start the game
     */
    function startGame() {
        // Reset game state
        gameScore = 0;
        problemsAttempted = 0;
        
        // Get timer duration from settings
        const timerSelect = document.getElementById('timerDuration');
        if (timerSelect) {
            timerDuration = parseInt(timerSelect.value);
        }
        
        // Start with a new problem
        nextProblem();
    }
    
    /**
     * Get next problem
     */
    function nextProblem() {
        // Get a problem based on current level
        const problem = MultiplicationTables.getRandomProblem();
        currentProblem = problem;
        
        // Display problem
        document.getElementById('gameFactor1').textContent = problem.factor1;
        document.getElementById('gameFactor2').textContent = problem.factor2;
        
        // Clear input and feedback
        const input = document.getElementById('gameInput');
        input.value = '';
        input.focus();
        input.disabled = false;
        
        document.getElementById('gameFeedback').textContent = '';
        document.getElementById('gameFeedback').className = 'feedback';
        
        // Hide next button
        document.getElementById('nextProblem').style.display = 'none';
        
        // Enable submit button
        document.getElementById('submitGame').disabled = false;
        
        // Record start time
        problemStartTime = Date.now();
        
        // Start timer
        MathUtils.startTimer(timerDuration, null, () => {
            timeUp();
        });
    }
    
    /**
     * Check user's answer
     */
    function checkAnswer() {
        if (!currentProblem) return;
        
        // Stop timer
        MathUtils.stopTimer();
        
        // Get user's answer
        const input = document.getElementById('gameInput');
        const userAnswer = parseInt(input.value.trim());
        
        // Validate input
        if (isNaN(userAnswer)) {
            UI.showFeedback('gameFeedback', 'Please enter a number', false);
            return;
        }
        
        // Calculate time taken
        const timeTaken = (Date.now() - problemStartTime) / 1000;
        
        // Check answer
        const isCorrect = userAnswer === currentProblem.answer;
        
        // Update game stats
        problemsAttempted++;
        
        // Calculate points
        let pointsEarned = 0;
        if (isCorrect) {
            // Calculate points based on time taken
            const level = MultiplicationTables.getCurrentLevel();
            pointsEarned = MathUtils.calculatePoints(timeTaken, level);
            
            // Update game score
            gameScore += pointsEarned;
            
            // Add points to user's account
            AppCore.addPoints(pointsEarned);
        }
        
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
        
        // Disable input and show next button
        input.disabled = true;
        document.getElementById('submitGame').disabled = true;
        document.getElementById('nextProblem').style.display = 'block';
    }
    
    /**
     * Handle when timer runs out
     */
    function timeUp() {
        // Get user's answer so far
        const input = document.getElementById('gameInput');
        const userAnswer = parseInt(input.value.trim());
        
        // Check if answer is correct
        const isCorrect = !isNaN(userAnswer) && userAnswer === currentProblem.answer;
        
        // Update game stats
        problemsAttempted++;
        
        // Award points if correct
        if (isCorrect) {
            // Half points for correct answer at the last moment
            const level = MultiplicationTables.getCurrentLevel();
            const pointsEarned = 5 * level;
            
            // Update game score
            gameScore += pointsEarned;
            
            // Add points to user's account
            AppCore.addPoints(pointsEarned);
            
            // Show success feedback
            UI.showFeedback(
                'gameFeedback', 
                `Just in time! +${pointsEarned} points!`, 
                true
            );
        } else {
            // Show timeout feedback
            UI.showFeedback(
                'gameFeedback', 
                `Time's up! The answer is ${currentProblem.answer}.`, 
                false
            );
        }
        
        // Disable input and show next button
        input.disabled = true;
        document.getElementById('submitGame').disabled = true;
        document.getElementById('nextProblem').style.display = 'block';
    }
    
    // Public API
    return {
        init,
        startGame,
        nextProblem
    };
})();

// Initialize game module when document is ready
document.addEventListener('DOMContentLoaded', function() {
    Game.init();
});
