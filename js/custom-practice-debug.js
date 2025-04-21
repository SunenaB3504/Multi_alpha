/**
 * Debug script to fix the Custom Practice functionality
 * This script directly manipulates the DOM to ensure proper functionality
 */
console.log('Loading custom practice debug script');

// Wait for full DOM content and all scripts to be loaded
window.addEventListener('load', function() {
    console.log('Custom practice debug: window fully loaded');
    setTimeout(fixCustomPractice, 500); // Small delay to ensure all other scripts have initialized
});

function fixCustomPractice() {
    console.log('Applying custom practice fixes...');
    
    // Get all relevant elements
    const generatePracticeBtn = document.getElementById('generatePractice');
    const customPracticeArea = document.querySelector('.custom-practice-area');
    const customMatchingArea = document.querySelector('.custom-matching-area');
    const tableButtons = document.querySelectorAll('.table-btn');
    const standardModeBtn = document.getElementById('standardModeBtn');
    const matchingModeBtn = document.getElementById('matchingModeBtn');
    
    // Log element statuses
    console.log('Generate Practice button found:', !!generatePracticeBtn);
    console.log('Custom Practice area found:', !!customPracticeArea);
    console.log('Custom Matching area found:', !!customMatchingArea);
    console.log('Table buttons found:', tableButtons.length);
    
    // Remove previous event listeners by replacing elements
    if (generatePracticeBtn) {
        const newBtn = generatePracticeBtn.cloneNode(true);
        generatePracticeBtn.parentNode.replaceChild(newBtn, generatePracticeBtn);
        
        // Add direct click handler that does not rely on other functions
        newBtn.addEventListener('click', function() {
            console.log('Generate Practice button clicked - direct handler');
            
            // Get selected tables
            const selectedTables = [];
            document.querySelectorAll('.table-btn.active').forEach(btn => {
                selectedTables.push(parseInt(btn.getAttribute('data-table')));
            });
            
            console.log('Selected tables:', selectedTables);
            
            if (selectedTables.length === 0) {
                alert('Please select at least one multiplication table to practice.');
                return;
            }
            
            // Check which mode is active
            const isMatchingMode = matchingModeBtn && matchingModeBtn.classList.contains('active');
            console.log('Is matching mode:', isMatchingMode);
            
            try {
                if (isMatchingMode && customMatchingArea) {
                    // Show matching area
                    console.log('Activating matching area');
                    customPracticeArea.classList.add('hidden');
                    customMatchingArea.classList.remove('hidden');
                    
                    // Create simple placeholder cards if custom function doesn't exist
                    const customFlipCardGrid = document.getElementById('customFlipCardGrid');
                    if (customFlipCardGrid) {
                        const cardHTML = createSimpleMatchingCards(selectedTables);
                        customFlipCardGrid.innerHTML = cardHTML;
                        attachCardEventListeners(customFlipCardGrid);
                    }
                } else if (customPracticeArea) {
                    // Show standard practice area
                    console.log('Activating standard practice area');
                    customMatchingArea.classList.add('hidden');
                    customPracticeArea.classList.remove('hidden');
                    
                    // Generate a problem directly
                    createCustomProblem(selectedTables);
                    
                    // Also make sure the Next Problem button works
                    const nextCustomProblem = document.getElementById('nextCustomProblem');
                    if (nextCustomProblem) {
                        nextCustomProblem.replaceWith(nextCustomProblem.cloneNode(true));
                        document.getElementById('nextCustomProblem').addEventListener('click', function() {
                            console.log('Next custom problem button clicked');
                            createCustomProblem(selectedTables);
                        });
                    }
                    
                    // Make sure the submit button works
                    const submitCustomBtn = document.getElementById('submitCustom');
                    if (submitCustomBtn) {
                        submitCustomBtn.replaceWith(submitCustomBtn.cloneNode(true));
                        document.getElementById('submitCustom').addEventListener('click', function() {
                            checkCustomAnswer(selectedTables);
                        });
                    }
                }
            } catch (error) {
                console.error('Error in generate practice:', error);
                alert('There was an error starting the practice. Please try again.');
            }
        });
    }
    
    // Make sure table buttons toggle properly
    tableButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function() {
            console.log(`Table ${this.getAttribute('data-table')} clicked`);
            this.classList.toggle('active');
        });
    });
    
    // Fix mode buttons
    if (standardModeBtn && matchingModeBtn) {
        const newStdBtn = standardModeBtn.cloneNode(true);
        standardModeBtn.parentNode.replaceChild(newStdBtn, standardModeBtn);
        
        const newMatchBtn = matchingModeBtn.cloneNode(true);
        matchingModeBtn.parentNode.replaceChild(newMatchBtn, matchingModeBtn);
        
        newStdBtn.addEventListener('click', function() {
            console.log('Standard mode selected');
            this.classList.add('active');
            document.getElementById('matchingModeBtn').classList.remove('active');
        });
        
        newMatchBtn.addEventListener('click', function() {
            console.log('Matching mode selected');
            this.classList.add('active');
            document.getElementById('standardModeBtn').classList.remove('active');
        });
    }
    
    console.log('Custom practice fixes applied successfully');
}

// Fallback function for creating custom problems
function createCustomProblem(selectedTables) {
    console.log('Creating custom problem with tables:', selectedTables);
    
    // Use existing function if available
    if (typeof generateCustomProblem === 'function') {
        console.log('Using existing generateCustomProblem function');
        try {
            generateCustomProblem(selectedTables);
            return;
        } catch (e) {
            console.error('Error in generateCustomProblem:', e);
        }
    }
    
    // Fallback implementation
    console.log('Using fallback problem generator');
    const factor1 = document.getElementById('customFactor1');
    const factor2 = document.getElementById('customFactor2');
    const feedback = document.getElementById('customFeedback');
    const correctGifContainer = document.getElementById('correctGifContainer');
    
    if (factor1 && factor2) {
        // Clear previous feedback
        if (feedback) feedback.textContent = '';
        if (correctGifContainer) correctGifContainer.classList.add('hidden');
        
        // Generate new problem
        const table = selectedTables[Math.floor(Math.random() * selectedTables.length)];
        const number = Math.floor(Math.random() * 12) + 1;
        
        factor1.textContent = table;
        factor2.textContent = number;
        
        // Clear input
        const input = document.getElementById('customInput');
        if (input) input.value = '';
        if (input) input.focus();
    }
}

// Fallback function for checking custom answers
function checkCustomAnswer() {
    console.log('Checking custom answer');
    
    const factor1 = parseInt(document.getElementById('customFactor1').textContent);
    const factor2 = parseInt(document.getElementById('customFactor2').textContent);
    const input = document.getElementById('customInput');
    const feedback = document.getElementById('customFeedback');
    const correctGifContainer = document.getElementById('correctGifContainer');
    
    if (input && feedback) {
        const userAnswer = parseInt(input.value);
        const correctAnswer = factor1 * factor2;
        
        if (isNaN(userAnswer)) {
            feedback.textContent = 'Please enter a number';
            feedback.className = 'feedback warning';
        } else if (userAnswer === correctAnswer) {
            feedback.textContent = 'Correct! Great job!';
            feedback.className = 'feedback correct';
            
            // Show celebration if available
            if (correctGifContainer) {
                correctGifContainer.classList.remove('hidden');
            }
            
            // Add points if points system exists
            if (typeof addPoints === 'function') {
                try {
                    addPoints(5);
                } catch (e) {
                    console.error('Error adding points:', e);
                }
            }
        } else {
            feedback.textContent = 'Not correct. Try again!';
            feedback.className = 'feedback incorrect';
        }
    }
}

// Create simple matching cards as fallback
function createSimpleMatchingCards(selectedTables) {
    console.log('Creating simple matching cards for tables:', selectedTables);
    
    const problems = [];
    // Generate 6 unique problems (for 12 cards)
    while (problems.length < 6) {
        const table = selectedTables[Math.floor(Math.random() * selectedTables.length)];
        const number = Math.floor(Math.random() * 12) + 1;
        const problem = `${table} × ${number}`;
        const answer = table * number;
        
        // Check if this problem is already in the array
        if (!problems.some(p => p.problem === problem)) {
            problems.push({ problem, answer });
        }
    }
    
    // Create HTML for cards
    let cards = [];
    problems.forEach(item => {
        cards.push(`<div class="flip-card" data-value="${item.problem}">
            <div class="flip-card-inner">
                <div class="flip-card-front"></div>
                <div class="flip-card-back">${item.problem}</div>
            </div>
        </div>`);
        
        cards.push(`<div class="flip-card" data-value="${item.problem}">
            <div class="flip-card-inner">
                <div class="flip-card-front"></div>
                <div class="flip-card-back">${item.answer}</div>
            </div>
        </div>`);
    });
    
    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    return cards.join('');
}

// Attach event listeners to matching cards
function attachCardEventListeners(gridElement) {
    const cards = gridElement.querySelectorAll('.flip-card');
    let flippedCards = [];
    let lockBoard = false;
    let matches = 0;
    let moves = 0;
    
    // Update stats display
    const updateStats = () => {
        const matchesCount = document.getElementById('customMatchesCount');
        const movesCount = document.getElementById('customMovesCount');
        
        if (matchesCount) matchesCount.textContent = matches;
        if (movesCount) movesCount.textContent = moves;
    };
    
    // Check if all cards are matched
    const checkGameComplete = () => {
        if (matches === cards.length / 2) {
            const gameCompleteMessage = document.getElementById('customGameCompleteMessage');
            if (gameCompleteMessage) {
                gameCompleteMessage.classList.remove('hidden');
                
                // Update final stats
                const finalMoves = document.getElementById('customFinalMoves');
                if (finalMoves) finalMoves.textContent = moves;
                
                // Add points if points system exists
                if (typeof addPoints === 'function') {
                    try {
                        const points = Math.max(10, 100 - (moves * 2));
                        addPoints(points);
                        
                        const earnedPoints = document.getElementById('customEarnedPoints');
                        if (earnedPoints) earnedPoints.textContent = points;
                    } catch (e) {
                        console.error('Error adding points:', e);
                    }
                }
            }
        }
    };
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            if (lockBoard || this.classList.contains('flipped')) return;
            
            this.classList.add('flipped');
            flippedCards.push(this);
            
            if (flippedCards.length === 2) {
                moves++;
                updateStats();
                lockBoard = true;
                
                // Check for match
                if (flippedCards[0].getAttribute('data-value') === flippedCards[1].getAttribute('data-value')) {
                    // Match found
                    matches++;
                    updateStats();
                    flippedCards = [];
                    lockBoard = false;
                    
                    // Check if game is complete
                    checkGameComplete();
                } else {
                    // No match
                    setTimeout(() => {
                        flippedCards.forEach(card => card.classList.remove('flipped'));
                        flippedCards = [];
                        lockBoard = false;
                    }, 1000);
                }
            }
        });
    });
}
