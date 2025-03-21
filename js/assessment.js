/**
 * Assessment module for the app
 */

const Assessment = (function() {
    // Track assessment state
    let currentProblem = null;
    let problemIndex = 0;
    let totalProblems = 0;
    let correctAnswers = 0;
    
    /**
     * Start a new problem in the assessment
     * @param {Object} problem - The problem to display
     */
    function startProblem(problem) {
        console.log('Starting assessment problem:', problem);
        
        if (!problem) {
            console.error('No problem provided!');
            return;
        }
        
        // Store the current problem
        currentProblem = problem;
        
        // Display the problem
        document.getElementById('factor1').textContent = problem.factor1;
        document.getElementById('factor2').textContent = problem.factor2;
        
        // Clear input and feedback
        const input = document.getElementById('assessmentInput');
        if (input) {
            input.value = '';
            input.disabled = false;
            input.focus();
        }
        
        const feedback = document.getElementById('assessmentFeedback');
        if (feedback) {
            feedback.textContent = '';
            feedback.className = 'feedback';
        }
        
        // Show progress
        const progressDiv = document.createElement('div');
        progressDiv.className = 'assessment-progress';
        progressDiv.textContent = `Problem ${problemIndex + 1} of ${totalProblems}`;
        
        const existingProgress = document.querySelector('.assessment-progress');
        if (existingProgress) {
            existingProgress.replaceWith(progressDiv);
        } else {
            const container = document.querySelector('#assessment .card');
            if (container) {
                container.prepend(progressDiv);
            }
        }
    }
    
    /**
     * Start a new assessment
     * @param {Array} problems - Array of problems for the assessment
     */
    function startAssessment(problems) {
        console.log('Starting new assessment with problems:', problems);
        
        if (!problems || !problems.length) {
            console.error('No problems provided for assessment!');
            return;
        }
        
        // Reset assessment state
        problemIndex = 0;
        totalProblems = problems.length;
        correctAnswers = 0;
        
        // Start first problem
        startProblem(problems[0]);
        
        // Set up the submit button handler
        const submitBtn = document.getElementById('submitAssessment');
        if (submitBtn) {
            submitBtn.onclick = function() {
                checkAnswer(problems);
            };
        }
        
        // Set up enter key handler
        const input = document.getElementById('assessmentInput');
        if (input) {
            input.onkeypress = function(e) {
                if (e.key === 'Enter') {
                    checkAnswer(problems);
                }
            };
        }
    }
    
    /**
     * Check the user's answer
     */
    function checkAnswer(problems) {
        if (!currentProblem) return;
        
        // Get user's answer
        const input = document.getElementById('assessmentInput');
        if (!input) return;
        
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
            // Award points - more for assessment than practice
            pointsEarned = 10;
            correctAnswers++;
            
            // Add points to user's account - with improved error handling
            try {
                console.log('Assessment: Awarding points:', pointsEarned);
                if (window.AppCore && typeof window.AppCore.addPoints === 'function') {
                    const newTotal = window.AppCore.addPoints(pointsEarned);
                    console.log('Assessment: New total points:', newTotal);
                } else {
                    console.error('AppCore.addPoints is not available');
                }
            } catch (err) {
                console.error('Error adding points:', err);
            }
            
            // Show dancing dog celebration - using direct method for reliability
            showDancingDogInAssessment();
        }
        
        // Show feedback
        if (isCorrect) {
            UI.showFeedback(
                'assessmentFeedback', 
                `Correct! ${currentProblem.factor1} × ${currentProblem.factor2} = ${currentProblem.answer}. +${pointsEarned} points!`, 
                true
            );
        } else {
            UI.showFeedback(
                'assessmentFeedback', 
                `Incorrect. The answer is ${currentProblem.answer}.`, 
                false
            );
        }
        
        // Move to next problem or finish assessment
        problemIndex++;
        
        // Disable input temporarily
        input.disabled = true;
        
        setTimeout(function() {
            if (problemIndex < totalProblems) {
                // Move to next problem
                startProblem(problems[problemIndex]);
            } else {
                // Assessment complete
                completeAssessment();
            }
        }, 2000);
    }
    
    /**
     * Direct method to show dancing dog in Assessment
     * This ensures the animation works reliably in this section
     */
    function showDancingDogInAssessment() {
        console.log('Directly showing dancing dog in Assessment');
        
        try {
            // Get Assessment section card
            const assessmentCard = document.querySelector('#assessment .card');
            if (!assessmentCard) {
                console.error('Assessment card element not found');
                return;
            }
            
            // Create animation container
            const dogContainer = document.createElement('div');
            dogContainer.className = 'assessment-celebration-container';
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
            
            // Create dog animation content
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
            const existingAnimation = document.querySelector('.assessment-celebration-container');
            if (existingAnimation) {
                existingAnimation.remove();
            }
            
            // Find the right place to insert it (after feedback)
            const feedback = document.getElementById('assessmentFeedback');
            if (feedback) {
                feedback.parentNode.insertBefore(dogContainer, feedback.nextSibling);
            } else {
                // If no feedback element, just add to the card
                assessmentCard.appendChild(dogContainer);
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
            
            // Also try the regular UI method as a backup
            if (window.UI && UI.showCelebrationAnimation) {
                try {
                    setTimeout(() => UI.showCelebrationAnimation(), 100);
                } catch (e) {
                    console.log('Backup animation method failed, but direct method should work');
                }
            }
            
        } catch (error) {
            console.error('Error showing assessment celebration:', error);
        }
    }
    
    /**
     * Complete the assessment and show results
     */
    function completeAssessment() {
        console.log('Assessment complete. Correct answers:', correctAnswers, 'out of', totalProblems);
        
        // Calculate score as percentage
        const score = Math.round((correctAnswers / totalProblems) * 100);
        
        // Create results display
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'assessment-results';
        resultsDiv.innerHTML = `
            <h3>Assessment Complete!</h3>
            <p>You got ${correctAnswers} out of ${totalProblems} correct (${score}%).</p>
            <button class="btn-primary" id="returnToDashboard">
                <i class="fas fa-home"></i> Return to Dashboard
            </button>
        `;
        
        // Replace content with results
        const container = document.querySelector('#assessment .card');
        if (container) {
            container.innerHTML = '';
            container.appendChild(resultsDiv);
            
            // Add event listener to return button
            document.getElementById('returnToDashboard').addEventListener('click', function() {
                UI.showSection('dashboard');
            });
        }
    }
    
    // Public API
    return {
        startProblem,
        startAssessment
    };
})();

// Make it globally available
window.Assessment = Assessment;

console.log('Assessment module loaded');
