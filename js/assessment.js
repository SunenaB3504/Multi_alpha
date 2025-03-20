/**
 * Assessment functionality for Multiplication Adventure
 */

const Assessment = (function() {
    // Track assessment state
    let currentProblem = null;
    let problemCount = 0;
    let correctCount = 0;
    let totalPoints = 0;
    
    /**
     * Initialize assessment module
     */
    function init() {
        // Set up event listeners
        const submitBtn = document.getElementById('submitAssessment');
        const input = document.getElementById('assessmentInput');
        
        submitBtn.addEventListener('click', checkAnswer);
        
        // Allow submitting with Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
    }
    
    /**
     * Start assessment with first problem
     */
    function startAssessment() {
        // Reset assessment state
        problemCount = 0;
        correctCount = 0;
        totalPoints = 0;
        
        // Get a new problem
        nextProblem();
    }
    
    /**
     * Start a specific problem
     * @param {Object} problem - Problem object with factor1, factor2, answer
     */
    function startProblem(problem) {
        // Store current problem
        currentProblem = problem;
        
        // Display problem
        document.getElementById('factor1').textContent = problem.factor1;
        document.getElementById('factor2').textContent = problem.factor2;
        
        // Clear input and feedback
        const input = document.getElementById('assessmentInput');
        input.value = '';
        input.focus();
        
        document.getElementById('assessmentFeedback').textContent = '';
        document.getElementById('assessmentFeedback').className = 'feedback';
    }
    
    /**
     * Move to next problem
     */
    function nextProblem() {
        // Increase problem count
        problemCount++;
        
        // Check if assessment is complete
        if (problemCount > 10) {
            completeAssessment();
            return;
        }
        
        // Get a new problem based on level
        const level = MultiplicationTables.getCurrentLevel();
        const problem = MultiplicationTables.getRandomProblem();
        
        // Start problem
        startProblem(problem);
    }
    
    /**
     * Check user's answer
     */
    function checkAnswer() {
        if (!currentProblem) return;
        
        // Get user's answer
        const input = document.getElementById('assessmentInput');
        const userAnswer = parseInt(input.value.trim());
        
        // Validate input
        if (isNaN(userAnswer)) {
            UI.showFeedback('assessmentFeedback', 'Please enter a number', false);
            return;
        }
        
        // Check answer
        const isCorrect = userAnswer === currentProblem.answer;
        
        // Calculate points
        let pointsEarned = 0;
        if (isCorrect) {
            // Base points per level
            const level = MultiplicationTables.getCurrentLevel();
            pointsEarned = 10 * level;
            
            // Update correct count
            correctCount++;
            
            // Update total points
            totalPoints += pointsEarned;
            
            // Add points to user's account
            AppCore.addPoints(pointsEarned);
        }
        
        // Show feedback
        if (isCorrect) {
            UI.showFeedback(
                'assessmentFeedback', 
                `Correct! ${currentProblem.factor1} × ${currentProblem.factor2} = ${currentProblem.answer}. +${pointsEarned} points!`, 
                true
            );
            
            // Add short delay before next problem
            setTimeout(nextProblem, 1500);
        } else {
            UI.showFeedback(
                'assessmentFeedback', 
                `Incorrect. The answer is ${currentProblem.answer}. Try the next one!`, 
                false
            );
            
            // Add short delay before next problem
            setTimeout(nextProblem, 2000);
        }
    }
    
    /**
     * Complete the assessment
     */
    function completeAssessment() {
        // Create results card
        const assessmentSection = document.getElementById('assessment');
        const resultsCard = document.createElement('div');
        resultsCard.className = 'card assessment-results';
        
        // Calculate percentage
        const percentage = Math.round((correctCount / 10) * 100);
        
        // Determine performance message
        let performanceMessage = '';
        if (percentage >= 90) {
            performanceMessage = 'Amazing work! You\'re a multiplication master!';
        } else if (percentage >= 70) {
            performanceMessage = 'Great job! You\'re getting really good at this!';
        } else if (percentage >= 50) {
            performanceMessage = 'Good effort! Keep practicing to improve!';
        } else {
            performanceMessage = 'Keep practicing - you\'ll get better with time!';
        }
        
        // Set results content
        resultsCard.innerHTML = `
            <h3>Assessment Complete!</h3>
            <div class="results-stats">
                <div class="result-item">
                    <div class="result-label">Score</div>
                    <div class="result-value">${correctCount}/10</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Percentage</div>
                    <div class="result-value">${percentage}%</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Points Earned</div>
                    <div class="result-value">+${totalPoints}</div>
                </div>
            </div>
            <p class="performance-message">${performanceMessage}</p>
            <button id="returnToDashboard" class="btn-primary">Return to Dashboard</button>
        `;
        
        // Replace assessment content
        const card = assessmentSection.querySelector('.card');
        card.parentNode.replaceChild(resultsCard, card);
        
        // Add event listener for return button
        resultsCard.querySelector('#returnToDashboard').addEventListener('click', () => {
            // Return to dashboard
            UI.showSection('dashboard');
            
            // Restore original assessment card
            setTimeout(() => {
                resultsCard.parentNode.replaceChild(card, resultsCard);
            }, 500);
        });
    }
    
    // Public API
    return {
        init,
        startAssessment,
        startProblem
    };
})();

// Initialize assessment module when document is ready
document.addEventListener('DOMContentLoaded', function() {
    Assessment.init();
});
