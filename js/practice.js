/**
 * Custom Practice Module for Multiplication Adventure
 */

const Practice = (function() {
    // Module state
    let selectedTables = [];
    let currentProblem = {};
    let correctAnswers = 0;
    let totalProblems = 0;
    let practiceMode = 'standard'; // 'standard' or 'matching'
    
    // Matching game state
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let gameTimer = null;
    let gameTimeSeconds = 0;
    let isPlaying = false;
    let gamePoints = 0;
    
    /**
     * Initialize practice module
     */
    function init() {
        console.log('Initializing practice module');
        
        setupEventListeners();
    }
    
    /**
     * Set up event listeners for the practice module
     */
    function setupEventListeners() {
        // Table selection buttons - improved event handling
        console.log('Setting up practice table button listeners');
        const tableButtons = document.querySelectorAll('.table-btn');
        console.log(`Found ${tableButtons.length} table buttons`);
        
        tableButtons.forEach(button => {
            // Add clear debugging for button clicks
            button.addEventListener('click', function(e) {
                console.log('Table button clicked:', this.dataset.table);
                this.classList.toggle('selected');
                e.stopPropagation(); // Prevent event bubbling
            });
            
            // Make sure the button is also clickable by direct events
            button.addEventListener('mousedown', function(e) {
                console.log('Table button mousedown:', this.dataset.table);
                e.stopPropagation();
            });
            
            // Add a class to show it's interactive
            button.classList.add('interactive');
        });
        
        // Re-initialize table buttons when this section becomes visible
        const openGeneratorBtn = document.getElementById('openGenerator');
        if (openGeneratorBtn) {
            openGeneratorBtn.addEventListener('click', function() {
                // Wait for the section to become visible
                setTimeout(setupTableButtons, 100);
            });
        }
        
        // Practice mode toggle buttons
        const standardModeBtn = document.getElementById('standardModeBtn');
        const matchingModeBtn = document.getElementById('matchingModeBtn');
        
        if (standardModeBtn && matchingModeBtn) {
            standardModeBtn.addEventListener('click', () => {
                practiceMode = 'standard';
                standardModeBtn.classList.add('active');
                matchingModeBtn.classList.remove('active');
            });
            
            matchingModeBtn.addEventListener('click', () => {
                practiceMode = 'matching';
                matchingModeBtn.classList.add('active');
                standardModeBtn.classList.remove('active');
            });
        }
        
        // Start practice button - enhanced with better error handling
        const generatePracticeBtn = document.getElementById('generatePractice');
        if (generatePracticeBtn) {
            console.log('Found generatePractice button, attaching click event');
            generatePracticeBtn.addEventListener('click', function(e) {
                console.log('Start Practice button clicked');
                e.preventDefault(); // Prevent any form submission
                startPractice();
            });
            
            // Also attach a mousedown event for better responsiveness
            generatePracticeBtn.addEventListener('mousedown', function(e) {
                console.log('Start Practice button mousedown');
                e.stopPropagation();
            });
        } else {
            console.error('Could not find generatePractice button');
        }
        
        // Submit answer button
        const submitCustomBtn = document.getElementById('submitCustom');
        if (submitCustomBtn) {
            submitCustomBtn.addEventListener('click', checkAnswer);
        }
        
        // Next problem button
        const nextCustomProblemBtn = document.getElementById('nextCustomProblem');
        if (nextCustomProblemBtn) {
            nextCustomProblemBtn.addEventListener('click', generateProblem);
        }
        
        // Practice again button
        const practiceAgainBtn = document.getElementById('practiceAgainBtn');
        if (practiceAgainBtn) {
            practiceAgainBtn.addEventListener('click', () => {
                document.getElementById('customGameCompleteMessage').classList.add('hidden');
                startPractice();
            });
        }
        
        // Enter key for submitting answers
        const customInput = document.getElementById('customInput');
        if (customInput) {
            customInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    checkAnswer();
                }
            });
        }
    }
    
    /**
     * Set up table buttons specifically - can be called multiple times
     */
    function setupTableButtons() {
        console.log('Re-initializing table buttons');
        const tableButtons = document.querySelectorAll('.table-btn');
        
        tableButtons.forEach(button => {
            // Clear existing event listeners by cloning and replacing
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add the event listener to the new button
            newButton.addEventListener('click', function(e) {
                console.log('Table button clicked (refreshed):', this.dataset.table);
                this.classList.toggle('selected');
                e.stopPropagation();
            });
        });
    }
    
    /**
     * Start practice session
     */
    function startPractice() {
        console.log('Starting practice...');
        console.log('Practice mode:', practiceMode);
        
        // Get selected tables
        selectedTables = [];
        const selectedButtons = document.querySelectorAll('.table-btn.selected');
        console.log(`Found ${selectedButtons.length} selected tables`);
        
        selectedButtons.forEach(button => {
            const tableNumber = parseInt(button.dataset.table);
            console.log(`Adding table ${tableNumber} to selected tables`);
            selectedTables.push(tableNumber);
        });
        
        // Check if any tables were selected
        if (selectedTables.length === 0) {
            console.warn('No tables selected');
            alert('Please select at least one multiplication table to practice.');
            return;
        }
        
        // Reset counters
        correctAnswers = 0;
        totalProblems = 0;
        
        console.log(`Starting ${practiceMode} practice mode`);
        
        try {
            // Show appropriate practice area based on mode
            if (practiceMode === 'standard') {
                startStandardPractice();
            } else {
                startMatchingPractice();
            }
        } catch (error) {
            console.error('Error starting practice:', error);
            alert('There was an error starting the practice. Please try again.');
        }
    }
    
    /**
     * Start standard practice mode
     */
    function startStandardPractice() {
        try {
            console.log('Starting standard practice mode');
            
            // Find the custom practice area with better error handling
            const practiceArea = document.querySelector('.custom-practice-area');
            const matchingArea = document.querySelector('.custom-matching-area');
            
            if (!practiceArea) {
                console.error('Could not find custom-practice-area element');
                throw new Error('Missing practice area element');
            }
            
            if (!matchingArea) {
                console.error('Could not find custom-matching-area element - this is non-critical');
            }
            
            // Check for required elements in the practice area
            const customFactor1 = document.getElementById('customFactor1');
            const customFactor2 = document.getElementById('customFactor2');
            const customInput = document.getElementById('customInput');
            
            if (!customFactor1 || !customFactor2 || !customInput) {
                console.error('Missing required elements for standard practice');
                console.log('customFactor1 exists:', !!customFactor1);
                console.log('customFactor2 exists:', !!customFactor2);
                console.log('customInput exists:', !!customInput);
                throw new Error('Missing required standard practice elements');
            }
            
            // Show standard practice area, hide matching area
            practiceArea.classList.remove('hidden');
            if (matchingArea) matchingArea.classList.add('hidden');
            
            // Generate first problem
            generateProblem();
            
            console.log('Standard practice started successfully');
        } catch (error) {
            console.error('Error in startStandardPractice:', error);
            throw error; // Re-throw to be caught by startPractice
        }
    }
    
    /**
     * Start matching practice mode
     */
    function startMatchingPractice() {
        try {
            console.log('Starting matching practice mode');
            
            // Find practice areas with better error handling
            const practiceArea = document.querySelector('.custom-practice-area');
            const matchingArea = document.querySelector('.custom-matching-area');
            
            if (!practiceArea) {
                console.error('Could not find custom-practice-area element');
                throw new Error('Missing practice area element');
            }
            
            if (!matchingArea) {
                console.error('Could not find custom-matching-area element');
                throw new Error('Missing matching area element');
            }
            
            // Show matching practice area, hide standard area
            practiceArea.classList.add('hidden');
            matchingArea.classList.remove('hidden');
            
            // Reset matching game state
            flippedCards = [];
            matchedPairs = 0;
            moves = 0;
            gameTimeSeconds = 0;
            isPlaying = true;
            
            // Update UI counters with checks
            const matchesCountElement = document.getElementById('customMatchesCount');
            const movesCountElement = document.getElementById('customMovesCount');
            const gameTimeElement = document.getElementById('customGameTime');
            
            if (!matchesCountElement || !movesCountElement || !gameTimeElement) {
                console.error('Missing required UI counter elements');
                console.log('matchesCount exists:', !!matchesCountElement);
                console.log('movesCount exists:', !!movesCountElement);
                console.log('gameTime exists:', !!gameTimeElement);
                throw new Error('Missing required UI elements');
            }
            
            updateMovesCounter();
            updateMatchesCounter();
            updateTimer();
            
            // Generate cards for the matching game
            const flipCardGrid = document.getElementById('customFlipCardGrid');
            if (!flipCardGrid) {
                console.error('customFlipCardGrid element not found');
                throw new Error('Missing flip card grid element');
            }
            
            generateMatchingCards();
            
            // Hide game complete message if visible
            const gameCompleteMessage = document.getElementById('customGameCompleteMessage');
            if (gameCompleteMessage) {
                gameCompleteMessage.classList.add('hidden');
            }
            
            // Start the timer
            startTimer();
            
            // Update points display when starting
            updatePointsDisplay();
            
            console.log('Matching practice started successfully');
        } catch (error) {
            console.error('Error in startMatchingPractice:', error);
            throw error; // Re-throw to be caught by startPractice
        }
    }
    
    /**
     * Update the moves counter in the UI
     */
    function updateMovesCounter() {
        const movesElement = document.getElementById('customMovesCount');
        if (movesElement) {
            movesElement.textContent = moves;
        } else {
            console.error('Could not find customMovesCount element');
        }
    }

    /**
     * Update the matches counter in the UI
     */
    function updateMatchesCounter() {
        const matchesElement = document.getElementById('customMatchesCount');
        if (matchesElement) {
            if (cards && cards.length > 0) {
                matchesElement.textContent = `${matchedPairs}/${cards.length / 2}`;
            } else {
                matchesElement.textContent = `${matchedPairs}/0`;
                console.warn('Cards array is empty or undefined');
            }
        } else {
            console.error('Could not find customMatchesCount element');
        }
    }

    /**
     * Update the timer display
     */
    function updateTimer() {
        const timerElement = document.getElementById('customGameTime');
        if (timerElement) {
            timerElement.textContent = formatTime(gameTimeSeconds);
        } else {
            console.error('Could not find customGameTime element');
        }
    }
    
    /**
     * Generate a random multiplication problem
     */
    function generateProblem() {
        // Hide feedback and gif
        document.getElementById('customFeedback').textContent = '';
        document.getElementById('customFeedback').className = 'feedback';
        document.getElementById('correctGifContainer').classList.add('hidden');
        
        // Clear input field
        document.getElementById('customInput').value = '';
        document.getElementById('customInput').focus();
        
        // Generate a new problem
        const tableIndex = Math.floor(Math.random() * selectedTables.length);
        const table = selectedTables[tableIndex];
        const multiplier = Math.floor(Math.random() * 12) + 1;
        
        currentProblem = {
            factor1: table,
            factor2: multiplier,
            answer: table * multiplier
        };
        
        // Update the UI
        document.getElementById('customFactor1').textContent = currentProblem.factor1;
        document.getElementById('customFactor2').textContent = currentProblem.factor2;
        
        // Hide next button
        document.getElementById('nextCustomProblem').classList.add('hidden');
    }
    
    /**
     * Check the user's answer
     */
    function checkAnswer() {
        const userAnswer = parseInt(document.getElementById('customInput').value);
        
        // Validate input
        if (isNaN(userAnswer)) {
            document.getElementById('customFeedback').textContent = 'Please enter a number.';
            return;
        }
        
        // Check answer
        totalProblems++;
        
        if (userAnswer === currentProblem.answer) {
            correctAnswers++;
            
            // Show success feedback
            document.getElementById('customFeedback').textContent = 'Correct! Well done!';
            document.getElementById('customFeedback').className = 'feedback success';
            
            // Show celebration gif
            document.getElementById('correctGifContainer').classList.remove('hidden');            // Add points
            const points = 5;  // Base points for correct answer
            console.log("Awarding points for correct answer:", points);
            
            // Use AppCore to add points correctly
            if (window.AppCore && typeof window.AppCore.addPoints === 'function') {
                window.AppCore.addPoints(points);
                console.log("Added points using window.AppCore.addPoints");
            } else {
                console.error("Could not find AppCore.addPoints function to award points");
            }
            
            // Update points display directly as a backup
            updatePointsDisplay(points);
            
            // Show next button
            document.getElementById('nextCustomProblem').classList.remove('hidden');
        } else {
            document.getElementById('customFeedback').textContent = `Not quite. The correct answer is ${currentProblem.answer}. Try again!`;
            document.getElementById('customFeedback').className = 'feedback error';
        }
    }
    
    /**
     * Generate cards for the matching game
     */
    function generateMatchingCards() {
        const grid = document.getElementById('customFlipCardGrid');
        
        // Clear the grid
        grid.innerHTML = '';
        console.log("Cleared flip card grid");
        
        // Determine number of pairs based on selected tables
        // Make sure we create at least 4 pairs and at most 10 pairs
        const minPairs = 4;
        const maxPairs = 10;
        let numPairs = Math.min(maxPairs, Math.max(minPairs, selectedTables.length * 2));
        
        console.log(`Creating ${numPairs} pairs (${numPairs*2} cards total)`);
        
        // Create pairs of cards (product & multiplication expression)
        cards = createCardPairs(numPairs);
        console.log(`Generated ${cards.length} cards`);
        
        // Shuffle the cards
        shuffleCards(cards);
        
        // Adjust grid layout based on the number of cards
        grid.className = 'flip-card-grid';
        if (cards.length <= 12) {
            grid.classList.add('grid-3x4');
            console.log("Using grid-3x4 layout");
        } else if (cards.length <= 16) {
            grid.classList.add('grid-4x4');
            console.log("Using grid-4x4 layout");
        } else if (cards.length <= 20) {
            grid.classList.add('grid-4x5');
            console.log("Using grid-4x5 layout");
        } else {
            grid.classList.add('grid-4x6');
            console.log("Using grid-4x6 layout");
        }
        
        // Add cards to the grid with better error handling
        try {
            cards.forEach((card, index) => {
                const cardElement = createCardElement(card, index);
                grid.appendChild(cardElement);
            });
            console.log(`Added ${cards.length} card elements to the grid`);
        } catch (error) {
            console.error("Error adding cards to grid:", error);
        }
        
        // Force grid to update layout
        setTimeout(() => {
            grid.style.display = 'grid';
            console.log("Applied grid display style");
        }, 50);
    }
    
    /**
     * Create card pairs for the matching game with better distribution
     */
    function createCardPairs(numPairs) {
        const cardPairs = [];
        const usedProducts = new Set();
        const pairsToCreate = numPairs;
        let attempts = 0;
        let pairsCreated = 0;
        const maxAttempts = 200; // Prevent infinite loop
        
        console.log(`Selected tables: ${selectedTables.join(', ')}`);
        
        // If we have too few tables selected, duplicate them to ensure we have enough factors
        let workingTables = [...selectedTables];
        while (workingTables.length < 5 && selectedTables.length > 0) {
            workingTables = workingTables.concat(selectedTables);
        }
        
        // Try to create pairs using the selected tables
        while (pairsCreated < pairsToCreate && attempts < maxAttempts) {
            attempts++;
            
            // Randomly select a table from the working tables
            const tableIndex = Math.floor(Math.random() * workingTables.length);
            const factor1 = workingTables[tableIndex];
            
            // Choose a random factor 1-12
            const factor2 = Math.floor(Math.random() * 12) + 1;
            const product = factor1 * factor2;
            
            // Avoid duplicate products
            if (usedProducts.has(product)) {
                continue;
            }
            
            usedProducts.add(product);
            pairsCreated++;
            
            // Create product card
            cardPairs.push({
                id: cardPairs.length,
                type: 'product',
                value: product,
                display: product.toString(),
                pairId: Math.floor(cardPairs.length / 2)
            });
            
            // Create expression card
            cardPairs.push({
                id: cardPairs.length,
                type: 'expression',
                value: product,
                display: `${factor1} × ${factor2}`,
                pairId: Math.floor(cardPairs.length / 2)
            });
        }
        
        if (attempts >= maxAttempts) {
            console.warn(`Reached maximum attempts (${maxAttempts}) when creating card pairs. Created ${pairsCreated} pairs.`);
        }
        
        return cardPairs;
    }
    
    /**
     * Shuffle the array of cards
     * @param {Array} array - Array of cards to shuffle
     */
    function shuffleCards(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    /**
     * Create a card DOM element
     * @param {Object} card - Card data object
     * @param {number} index - Index of the card
     * @return {HTMLElement} Card DOM element
     */
    function createCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'flip-card';
        cardElement.dataset.index = index;
        
        cardElement.innerHTML = `
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <div class="card-symbol">?</div>
                </div>
                <div class="flip-card-back ${card.type === 'product' ? 'product-card' : 'expression-card'}">
                    <div class="card-content">${card.display}</div>
                </div>
            </div>
        `;
        
        cardElement.addEventListener('click', () => handleCardClick(index));
        
        return cardElement;
    }
    
    /**
     * Handle a card click event
     * @param {number} index - Index of the clicked card
     */
    function handleCardClick(index) {
        const card = cards[index];
        const cardElement = document.querySelector(`.custom-matching-area .flip-card[data-index="${index}"]`);
        
        // Ignore clicks if game is not playing, or if card is already flipped or matched
        if (!isPlaying || flippedCards.includes(index) || cardElement.classList.contains('matched')) {
            return;
        }
        
        // Flip the card
        cardElement.classList.add('flipped');
        flippedCards.push(index);
        
        // Play sound effect if enabled
        playSound('flip');
        
        // Check for a match if we have flipped two cards
        if (flippedCards.length === 2) {
            moves++;
            updateMovesCounter();
            
            const card1 = cards[flippedCards[0]];
            const card2 = cards[flippedCards[1]];
            
            if (card1.pairId === card2.pairId) {
                // It's a match!
                handleMatch();
            } else {
                // Not a match, flip back after a delay
                setTimeout(() => {
                    handleMismatch();
                }, 1000);
            }
        }
    }
    
    /**
     * Handle a matching pair of cards
     */
    function handleMatch() {
        // Mark the cards as matched
        flippedCards.forEach(index => {
            const cardElement = document.querySelector(`.custom-matching-area .flip-card[data-index="${index}"]`);
            cardElement.classList.add('matched');
        });
        
        // Play sound effect if enabled
        playSound('match');
        
        // Increment matched pairs counter
        matchedPairs++;
        updateMatchesCounter();
          // Award small bonus points for each match (consistent with main game)
        const matchPoints = 2;
        if (window.AppCore && typeof window.AppCore.addPoints === 'function') {
            window.AppCore.addPoints(matchPoints);
            console.log("Added match bonus points using window.AppCore.addPoints:", matchPoints);
        } else {
            console.error("Could not find AppCore.addPoints function to award match points");
        }
        
        // Update points display
        updatePointsDisplay();
        
        // Reset flipped cards
        flippedCards = [];
        
        // Check if the game is complete
        if (matchedPairs === cards.length / 2) {
            gameComplete();
        }
    }
    
    /**
     * Handle mismatched cards
     */
    function handleMismatch() {
        // Flip the cards back
        flippedCards.forEach(index => {
            const cardElement = document.querySelector(`.custom-matching-area .flip-card[data-index="${index}"]`);
            cardElement.classList.remove('flipped');
        });
        
        // Play sound effect if enabled
        playSound('mismatch');
        
        // Reset flipped cards
        flippedCards = [];
    }
    
    /**
     * Handle game completion
     */
    function gameComplete() {
        isPlaying = false;
        stopTimer();
        
        // Calculate points based on moves and time in a consistent way with main game
        const timeBonus = Math.max(0, 60 - gameTimeSeconds) * 2;
        const movesBonus = Math.max(0, cards.length - moves) * 2;
        
        // Base points for custom matching should reflect the challenge level
        const basePointsPerPair = 10;
        gamePoints = basePointsPerPair * (cards.length / 2) + timeBonus + movesBonus;
        
        // Round to whole number
        gamePoints = Math.round(gamePoints);
        
        console.log(`Custom matching game complete: ${gamePoints} points earned`);
        console.log(`- Base: ${basePointsPerPair * (cards.length / 2)} points`);
        console.log(`- Time bonus: ${timeBonus} points`);
        console.log(`- Moves bonus: ${movesBonus} points`);
          // Update player's total points
        if (window.AppCore && typeof window.AppCore.addPoints === 'function') {
            window.AppCore.addPoints(gamePoints);
            console.log("Added game completion points using window.AppCore.addPoints:", gamePoints);
        } else {
            console.error("Could not find AppCore.addPoints function to award game completion points");
        }
        
        // Show completion message
        const gameCompleteMessage = document.getElementById('customGameCompleteMessage');
        if (gameCompleteMessage) {
            document.getElementById('customFinalMoves').textContent = moves;
            document.getElementById('customFinalTime').textContent = formatTime(gameTimeSeconds);
            document.getElementById('customEarnedPoints').textContent = gamePoints;
            gameCompleteMessage.classList.remove('hidden');
            
            // Use a safer approach to start confetti
            setTimeout(function() {
                try {
                    // Check if Confetti module is available
                    if (typeof window.Confetti === 'object' && typeof window.Confetti.start === 'function') {
                        console.log('Starting confetti animation on game completion');
                        window.Confetti.start(gameCompleteMessage, { particleCount: 150 });
                    } else {
                        console.warn('Confetti module not available for game completion');
                        
                        // Add a button to manually trigger confetti as fallback
                        const confettiBtn = document.createElement('button');
                        confettiBtn.innerHTML = '🎉 Show Celebration';
                        confettiBtn.className = 'btn-secondary';
                        confettiBtn.style.marginTop = '10px';
                        confettiBtn.onclick = function() {
                            if (window.testConfetti) {
                                window.testConfetti();
                            } else {
                                alert('Confetti module not available');
                            }
                        };
                        gameCompleteMessage.appendChild(confettiBtn);
                    }
                } catch (err) {
                    console.error('Error starting confetti:', err);
                }
            }, 500); // Give more time for everything to load
        }
        
        // Play victory sound
        playSound('victory');
        
        // Update points display
        updatePointsDisplay();
    }
    
    /**
     * Update the points display in the custom practice matching game
     */
    function updatePointsDisplay() {
        try {
            const pointsDisplays = document.querySelectorAll('#wordGenerator .points-value');
            if (pointsDisplays.length === 0) {
                console.warn('No points display elements found in wordGenerator section');
                return;
            }
            
            let currentPoints = 0;
            
            if (window.AppCore && typeof AppCore.getState === 'function') {
                currentPoints = AppCore.getState().points;
            } else if (window.Core && typeof Core.getPoints === 'function') {
                currentPoints = Core.getPoints();
            } else {
                console.warn('No Core/AppCore found for getting points');
            }
            
            pointsDisplays.forEach(display => {
                display.textContent = currentPoints;
            });
        } catch (error) {
            console.error('Error updating points display:', error);
            // Not throwing error here as this is non-critical
        }
    }
    
    /**
     * Start the game timer
     */
    function startTimer() {
        // Clear any existing timer
        stopTimer();
        
        gameTimeSeconds = 0;
        updateTimer();
        
        // Start a new timer
        gameTimer = setInterval(() => {
            gameTimeSeconds++;
            updateTimer();
        }, 1000);
    }
    
    /**
     * Stop the game timer
     */
    function stopTimer() {
        if (gameTimer) {
            clearInterval(gameTimer);
            gameTimer = null;
        }
    }
    
    /**
     * Format time in seconds to MM:SS format
     * @param {number} seconds - Time in seconds
     * @return {string} Formatted time string
     */
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    /**
     * Play a sound effect if sound is enabled
     * @param {string} soundType - Type of sound to play
     */
    function playSound(soundType) {
        // Try using SoundManager first (preferred method)
        if (window.SoundManager && typeof SoundManager.play === 'function') {
            SoundManager.play(soundType);
            return;
        }
        
        // Fall back to direct Audio playback if SoundManager is not available
        if (window.Settings && Settings.isSoundEnabled && Settings.isSoundEnabled()) {
            let soundFile = '';
            
            switch (soundType) {
                case 'flip':
                    soundFile = 'sounds/card-flip.mp3';
                    break;
                case 'match':
                    soundFile = 'sounds/match.mp3';
                    break;
                case 'mismatch':
                    soundFile = 'sounds/mismatch.mp3';
                    break;
                case 'victory':
                    soundFile = 'sounds/victory.mp3';
                    break;
            }
            
            if (soundFile) {
                try {
                    const audio = new Audio(soundFile);
                    audio.play().catch(err => console.log('Sound play error:', err));
                } catch (error) {
                    console.log('Sound error:', error);
                }
            }
        }
    }
    
    // Public API
    return {
        init,
        setupTableButtons // Export this so it can be called from outside if needed
    };
})();

// Initialize practice module when document is ready
document.addEventListener('DOMContentLoaded', function() {
    Practice.init();
});
