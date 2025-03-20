/**
 * Custom Practice functionality for Multiplication Adventure
 */

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
        
        // Set up generate practice button
        const generateBtn = document.getElementById('generatePractice');
        generateBtn.addEventListener('click', startPractice);
        
        // Submit answer button
        const submitBtn = document.getElementById('submitCustom');
        submitBtn.addEventListener('click', checkAnswer);
        
        // Next problem button
        const nextBtn = document.getElementById('nextCustomProblem');
        nextBtn.addEventListener('click', nextProblem);
        
        // Allow submitting with Enter key
        const input = document.getElementById('customInput');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && practiceActive) {
                checkAnswer();
            }
        });
        
        // Hide practice area initially
        document.querySelector('.custom-practice-area').classList.add('hidden');
        document.getElementById('nextCustomProblem').style.display = 'none';
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
     * Start practice session with selected tables
     */
    function startPractice() {
        // Check if any tables are selected
        if (selectedTables.length === 0) {
            alert('Please select at least one multiplication table.');
            return;
        }
        
        console.log(`Starting practice with tables: ${selectedTables}`);
        
        // Set practice as active
        practiceActive = true;
        
        // Show practice area
        document.querySelector('.custom-practice-area').classList.remove('hidden');
        
        // Generate first problem
        nextProblem();
    }
    
    /**
     * Generate next practice problem
     */
    function nextProblem() {
        // Generate problem from selected tables
        currentProblem = MultiplicationTables.getProblemFromTables(selectedTables);
        
        // Display problem
        document.getElementById('customFactor1').textContent = currentProblem.factor1;
        document.getElementById('customFactor2').textContent = currentProblem.factor2;
        
        // Clear input and feedback
        const input = document.getElementById('customInput');
        input.value = '';
        input.focus();
        input.disabled = false;
        
        document.getElementById('customFeedback').textContent = '';
        document.getElementById('customFeedback').className = 'feedback';
        
        // Hide next button
        document.getElementById('nextCustomProblem').style.display = 'none';
    }
    
    /**
     * Check user's answer
     */
    function checkAnswer() {
        if (!currentProblem || !practiceActive) return;
        
        // Get user's answer
        const input = document.getElementById('customInput');
        const userAnswer = parseInt(input.value.trim());
        
        // Validate input
        if (isNaN(userAnswer)) {
            UI.showFeedback('customFeedback', 'Please enter a number', false);
            return;
        }
        
        // Check answer
        const isCorrect = userAnswer === currentProblem.answer;
        
        // Calculate points
        let pointsEarned = 0;
        if (isCorrect) {
            // Base points (less than assessment or game since this is practice)
            pointsEarned = 5;
            
            // Add points to user's account
            AppCore.addPoints(pointsEarned);
        }
        
        // Show feedback
        if (isCorrect) {
            UI.showFeedback(
                'customFeedback', 
                `Correct! ${currentProblem.factor1} × ${currentProblem.factor2} = ${currentProblem.answer}. +${pointsEarned} points!`, 
                true
            );
        } else {
            UI.showFeedback(
                'customFeedback', 
                `Incorrect. The answer is ${currentProblem.answer}.`, 
                false
            );
        }
        
        // Disable input and show next button
        input.disabled = true;
        document.getElementById('nextCustomProblem').style.display = 'block';
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
        startPractice,
        updateButtonVisuals // Expose for debugging
    };
})();

// Initialize practice module when document is ready
document.addEventListener('DOMContentLoaded', function() {
    Practice.init();
    
    // Additional event listener on container level for debugging
    document.querySelector('.table-selection').addEventListener('click', function(e) {
        console.log('Container click detected on:', e.target);
    }, false);
});
