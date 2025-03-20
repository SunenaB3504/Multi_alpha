/**
 * Math Utilities for Multiplication Adventure
 */

const MathUtils = (function() {
    // Timer variables
    let timerInterval = null;
    let timerCallback = null;
    let timerDuration = 15; // Default timer duration in seconds
    
    /**
     * Start a countdown timer
     * @param {Number} duration - Duration in seconds
     * @param {Function} onTick - Callback for each timer tick
     * @param {Function} onComplete - Callback when timer completes
     */
    function startTimer(duration, onTick, onComplete) {
        // Clear any existing timer
        stopTimer();
        
        // Set the timer duration
        timerDuration = duration || timerDuration;
        
        let timeLeft = timerDuration;
        const timerBar = document.getElementById('timerBar');
        
        if (timerBar) {
            timerBar.style.width = '100%';
        }
        
        timerInterval = setInterval(() => {
            timeLeft -= 0.1; // Update every 100ms
            
            // Calculate percentage of time remaining
            const percentLeft = (timeLeft / timerDuration) * 100;
            
            // Call onTick callback if provided
            if (onTick && typeof onTick === 'function') {
                onTick(timeLeft, percentLeft);
            }
            
            // Update timer bar if it exists
            if (timerBar) {
                timerBar.style.width = `${percentLeft}%`;
                
                // Change color as time runs out
                if (percentLeft < 25) {
                    timerBar.style.backgroundColor = '#ea4335'; // Red
                } else if (percentLeft < 50) {
                    timerBar.style.backgroundColor = '#fbbc05'; // Yellow
                }
            }
            
            // Check if timer is complete
            if (timeLeft <= 0) {
                stopTimer();
                
                // Call onComplete callback if provided
                if (onComplete && typeof onComplete === 'function') {
                    onComplete();
                }
            }
        }, 100);
    }
    
    /**
     * Stop the current timer
     */
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    
    /**
     * Set timer duration
     * @param {Number} seconds - Duration in seconds
     */
    function setTimerDuration(seconds) {
        timerDuration = seconds;
    }
    
    /**
     * Calculate points for a correct answer based on time taken
     * @param {Number} timeTaken - Time taken to answer in seconds
     * @param {Number} levelMultiplier - Multiplier for current level
     * @return {Number} - Points awarded
     */
    function calculatePoints(timeTaken, levelMultiplier = 1) {
        // Base points for correct answer
        let points = 10;
        
        // Bonus points for quick answers (max 10 bonus points)
        if (timeTaken < timerDuration) {
            const timeBonus = Math.round((1 - (timeTaken / timerDuration)) * 10);
            points += timeBonus;
        }
        
        // Apply level multiplier (higher levels give more points)
        points *= levelMultiplier;
        
        return Math.round(points);
    }
    
    /**
     * Generate a set of problems for assessment
     * @param {Number} level - Current level
     * @param {Number} count - Number of problems to generate
     * @return {Array} - Array of problem objects
     */
    function generateAssessmentProblems(level, count = 10) {
        const problems = [];
        const tables = MultiplicationTables.getTablesForLevel(level);
        
        // Generate unique problems
        for (let i = 0; i < count; i++) {
            problems.push(MultiplicationTables.getProblemFromTables(tables));
        }
        
        return problems;
    }
    
    // Public API
    return {
        startTimer,
        stopTimer,
        setTimerDuration,
        calculatePoints,
        generateAssessmentProblems
    };
})();
