/**
 * Flip Card Game for Multiplication Adventure
 * A memory matching game where players match products with multiplication expressions
 */

const FlipCardGame = (function() {
    // Game state
    let gameLevel = 'easy';
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let gameTimer = null;
    let gameTimeSeconds = 0;
    let isPlaying = false;
    let gamePoints = 0;
    
    // Card counts by level
    const levelConfig = {
        easy: { pairs: 6, maxFactor: 5, basePoints: 10 },
        medium: { pairs: 8, maxFactor: 9, basePoints: 15 },
        hard: { pairs: 12, maxFactor: 12, basePoints: 20 }
    };
    
    /**
     * Initialize the flip card game
     */
    function init() {
        console.log('Initializing flip card game module');
        
        // Set up event listeners for the game controls
        setupEventListeners();
    }
    
    /**
     * Set up event listeners for the game
     */
    function setupEventListeners() {
        // Level selection buttons
        const levelButtons = document.querySelectorAll('.flip-game-level-btn');
        levelButtons.forEach(button => {
            button.addEventListener('click', () => {
                gameLevel = button.dataset.level;
                
                // Update active class
                levelButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Start a new game with the selected level
                startNewGame();
            });
        });
        
        // Restart game button
        const restartButton = document.getElementById('restartFlipGame');
        if (restartButton) {
            restartButton.addEventListener('click', startNewGame);
        }
        
        // Play again button in game complete message
        const playAgainButton = document.getElementById('playAgainBtn');
        if (playAgainButton) {
            playAgainButton.addEventListener('click', () => {
                document.getElementById('gameCompleteMessage').classList.add('hidden');
                startNewGame();
            });
        }
        
        // Back button to return to dashboard
        const backButton = document.querySelector('#flipCardGame .btn-back');
        if (backButton) {
            backButton.addEventListener('click', () => {
                stopTimer();
                UI.showSection('dashboard');
            });
        }
        
        // Add event listener for opening the game from dashboard
        const playFlipCardGameBtn = document.getElementById('playFlipCardGame');
        if (playFlipCardGameBtn) {
            playFlipCardGameBtn.addEventListener('click', () => {
                UI.showSection('flipCardGame');
                updatePointsDisplay(); // Update points when switching to the game
                startNewGame();
            });
        }
    }
    
    /**
     * Start a new game with the current level
     */
    function startNewGame() {
        // Reset game state
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        gameTimeSeconds = 0;
        isPlaying = true;
        
        // Update UI counters
        updateMovesCounter();
        updateMatchesCounter();
        updateTimer();
        
        // Generate cards for the current level
        generateCards();
        
        // Hide game complete message if visible
        const gameCompleteMessage = document.getElementById('gameCompleteMessage');
        if (gameCompleteMessage) {
            gameCompleteMessage.classList.add('hidden');
        }
        
        // Start the timer
        startTimer();
    }
    
    /**
     * Generate cards for the game based on the current level
     */
    function generateCards() {
        const grid = document.getElementById('flipCardGrid');
        const config = levelConfig[gameLevel];
        
        // Clear the grid
        grid.innerHTML = '';
        
        // Create pairs of cards (product & multiplication expression)
        cards = createCardPairs(config.pairs, config.maxFactor);
        
        // Shuffle the cards
        shuffleCards(cards);
        
        // Adjust grid layout based on the number of cards
        grid.className = 'flip-card-grid';
        if (cards.length <= 12) {
            grid.classList.add('grid-3x4');
        } else if (cards.length <= 16) {
            grid.classList.add('grid-4x4');
        } else {
            grid.classList.add('grid-4x6');
        }
        
        // Add cards to the grid
        cards.forEach((card, index) => {
            const cardElement = createCardElement(card, index);
            grid.appendChild(cardElement);
        });
    }
    
    /**
     * Create pairs of cards with products and multiplication expressions
     * @param {number} numPairs - Number of pairs to create
     * @param {number} maxFactor - Maximum multiplication factor to use
     * @return {Array} Array of card objects
     */
    function createCardPairs(numPairs, maxFactor) {
        const cardPairs = [];
        const usedProducts = new Set();
        
        while (cardPairs.length < numPairs * 2) {
            // Generate valid factors
            let factor1, factor2, product;
            
            do {
                factor1 = Math.floor(Math.random() * maxFactor) + 1;
                factor2 = Math.floor(Math.random() * maxFactor) + 1;
                product = factor1 * factor2;
            } while (usedProducts.has(product));
            
            usedProducts.add(product);
            
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
        const cardElement = document.querySelector(`.flip-card[data-index="${index}"]`);
        
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
            const cardElement = document.querySelector(`.flip-card[data-index="${index}"]`);
            cardElement.classList.add('matched');
        });
        
        // Play sound effect if enabled
        playSound('match');
        
        // Increment matched pairs counter
        matchedPairs++;
        updateMatchesCounter();
        
        // Award small bonus points for each match
        const matchPoints = 2; // Small bonus for each match
        if (window.Core && typeof Core.addPoints === 'function') {
            Core.addPoints(matchPoints);
        } else if (window.AppCore && typeof AppCore.addPoints === 'function') {
            AppCore.addPoints(matchPoints);
        }
        
        // Update the points display
        updatePointsDisplay();
        
        // Reset flipped cards
        flippedCards = [];
        
        // Check if the game is complete
        if (matchedPairs === levelConfig[gameLevel].pairs) {
            gameComplete();
        }
    }
    
    /**
     * Handle mismatched cards
     */
    function handleMismatch() {
        // Flip the cards back
        flippedCards.forEach(index => {
            const cardElement = document.querySelector(`.flip-card[data-index="${index}"]`);
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
        
        // Calculate points based on level, moves, and time
        const config = levelConfig[gameLevel];
        const timeBonus = Math.max(0, 60 - gameTimeSeconds) * 2;
        const movesBonus = Math.max(0, config.pairs * 3 - moves) * 5;
        gamePoints = config.basePoints * config.pairs + timeBonus + movesBonus;
        
        // Update player's total points
        if (window.Core && typeof Core.addPoints === 'function') {
            Core.addPoints(gamePoints);
            console.log(`Added ${gamePoints} points for completing the matching game`);
        } else if (window.AppCore && typeof AppCore.addPoints === 'function') {
            AppCore.addPoints(gamePoints);
            console.log(`Added ${gamePoints} points for completing the matching game (AppCore)`);
        }
        
        // Show completion message
        const gameCompleteMessage = document.getElementById('gameCompleteMessage');
        document.getElementById('finalMoves').textContent = moves;
        document.getElementById('finalTime').textContent = formatTime(gameTimeSeconds);
        document.getElementById('earnedPoints').textContent = gamePoints;
        gameCompleteMessage.classList.remove('hidden');
        
        // Add confetti animation to the completion message
        if (window.Confetti && typeof Confetti.start === 'function') {
            setTimeout(() => {
                Confetti.start(gameCompleteMessage);
            }, 200);
        } else {
            console.warn('Confetti module not found');
        }
        
        // Play victory sound and show celebration
        playSound('victory');
        if (window.UI && typeof UI.showCelebrationAnimation === 'function') {
            setTimeout(UI.showCelebrationAnimation, 300);
        }
        
        // Make sure UI point displays are updated
        if (window.UI && typeof UI.updatePoints === 'function') {
            setTimeout(() => {
                if (window.AppCore && typeof AppCore.getState === 'function') {
                    UI.updatePoints(AppCore.getState().points);
                } else if (window.Core && typeof Core.getPoints === 'function') {
                    UI.updatePoints(Core.getPoints());
                }
            }, 500);
        }
    }
    
    /**
     * Update the moves counter in the UI
     */
    function updateMovesCounter() {
        const movesElement = document.getElementById('movesCount');
        if (movesElement) {
            movesElement.textContent = moves;
        }
    }
    
    /**
     * Update the matches counter in the UI
     */
    function updateMatchesCounter() {
        const matchesElement = document.getElementById('matchesCount');
        if (matchesElement) {
            matchesElement.textContent = `${matchedPairs}/${levelConfig[gameLevel].pairs}`;
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
     * Update the timer display
     */
    function updateTimer() {
        const timerElement = document.getElementById('gameTime');
        if (timerElement) {
            timerElement.textContent = formatTime(gameTimeSeconds);
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
    
    /**
     * Update the points display
     */
    function updatePointsDisplay() {
        const pointsDisplays = document.querySelectorAll('#flipCardGame .points-value');
        let currentPoints = 0;
        
        if (window.AppCore && typeof AppCore.getState === 'function') {
            currentPoints = AppCore.getState().points;
        } else if (window.Core && typeof Core.getPoints === 'function') {
            currentPoints = Core.getPoints();
        }
        
        pointsDisplays.forEach(display => {
            display.textContent = currentPoints;
        });
    }
    
    // Public API
    return {
        init,
        updatePointsDisplay
    };
})();

// Initialize module when document is ready
document.addEventListener('DOMContentLoaded', function() {
    FlipCardGame.init();
});
