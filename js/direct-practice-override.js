/**
 * Direct override for custom practice functionality
 * This script completely replaces the existing practice functionality with a simplified version
 */
(function() {
    console.log('⭐ Direct practice override loading...');
    
    // Wait until the document is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPracticeOverride);
    } else {
        // DOM already loaded, initialize immediately
        initPracticeOverride();
    }
    
    function initPracticeOverride() {
        console.log('⭐ Initializing direct practice override');
        
        // Remove any existing button listeners by cloning and replacing elements
        setupTableButtons();
        setupModeButtons();
        setupStartPracticeButton();
        setupSubmitAndNextButtons();
        setupPracticeAgainButton();
        setupBackButton();
        
        console.log('✅ Direct practice override initialized successfully');
    }
    
    function setupTableButtons() {
        try {
            console.log('Setting up table buttons');
            const tableButtons = document.querySelectorAll('.table-btn');
            
            // First, activate the first table button by default
            if (tableButtons.length > 0) {
                tableButtons[0].classList.add('active');
                console.log(`Table ${tableButtons[0].getAttribute('data-table')} activated by default`);
            }
            
            tableButtons.forEach(btn => {
                // Remove existing listeners
                const newBtn = btn.cloneNode(true);
                if (btn.parentNode) {
                    btn.parentNode.replaceChild(newBtn, btn);
                }
                
                // Add new click handler with immediate visual feedback
                newBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle active class with visual feedback
                    this.classList.toggle('active');
                    
                    // Add a brief highlight effect
                    this.style.transition = 'background-color 0.3s';
                    const originalBackground = this.style.backgroundColor;
                    this.style.backgroundColor = this.classList.contains('active') ? '#4CAF50' : '#ff6b6b';
                    
                    setTimeout(() => {
                        this.style.backgroundColor = originalBackground;
                    }, 300);
                    
                    console.log(`Table ${this.getAttribute('data-table')} toggled:`, this.classList.contains('active'));
                });
            });
            
            console.log('Table buttons setup complete');
        } catch (error) {
            console.error('Error setting up table buttons:', error);
        }
    }
    
    function setupModeButtons() {
        try {
            console.log('Setting up mode buttons');
            const standardModeBtn = document.getElementById('standardModeBtn');
            const matchingModeBtn = document.getElementById('matchingModeBtn');
            
            if (standardModeBtn && matchingModeBtn) {
                // Remove existing listeners
                const newStdBtn = standardModeBtn.cloneNode(true);
                const newMatchBtn = matchingModeBtn.cloneNode(true);
                
                if (standardModeBtn.parentNode) {
                    standardModeBtn.parentNode.replaceChild(newStdBtn, standardModeBtn);
                }
                
                if (matchingModeBtn.parentNode) {
                    matchingModeBtn.parentNode.replaceChild(newMatchBtn, matchingModeBtn);
                }
                
                // Add new click handlers
                newStdBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    this.classList.add('active');
                    document.getElementById('matchingModeBtn').classList.remove('active');
                    console.log('Standard mode selected');
                });
                
                newMatchBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    this.classList.add('active');
                    document.getElementById('standardModeBtn').classList.remove('active');
                    console.log('Matching mode selected');
                });
            }
            
            console.log('Mode buttons setup complete');
        } catch (error) {
            console.error('Error setting up mode buttons:', error);
        }
    }
    
    function setupStartPracticeButton() {
        try {
            console.log('Setting up start practice button');
            const startPracticeBtn = document.getElementById('generatePractice');
            
            if (startPracticeBtn) {
                // Remove existing listeners
                const newBtn = startPracticeBtn.cloneNode(true);
                if (startPracticeBtn.parentNode) {
                    startPracticeBtn.parentNode.replaceChild(newBtn, startPracticeBtn);
                }
                
                // Add new click handler with direct implementation
                newBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('⭐ Start Practice button clicked');
                    
                    // Force requery active tables
                    const activeTableButtons = document.querySelectorAll('.table-btn.active');
                    console.log('Found active table buttons:', activeTableButtons.length);
                    
                    // Get selected tables
                    const selectedTables = [];
                    activeTableButtons.forEach(btn => {
                        selectedTables.push(parseInt(btn.getAttribute('data-table')));
                    });
                    
                    console.log('Selected tables:', selectedTables);
                    
                    // Validate selection
                    if (selectedTables.length === 0) {
                        alert('Please select at least one multiplication table to practice.');
                        // Auto-select the first table as fallback
                        const firstTable = document.querySelector('.table-btn');
                        if (firstTable) {
                            firstTable.classList.add('active');
                            selectedTables.push(parseInt(firstTable.getAttribute('data-table')));
                            console.log('Auto-selected first table:', selectedTables);
                        }
                        return;
                    }
                    
                    // Check which mode is active
                    const isMatchingMode = document.getElementById('matchingModeBtn').classList.contains('active');
                    console.log('Is matching mode:', isMatchingMode);
                    
                    // Get relevant elements
                    const customTables = document.querySelector('.custom-tables');
                    const customPracticeArea = document.querySelector('.custom-practice-area');
                    const customMatchingArea = document.querySelector('.custom-matching-area');
                    
                    // Hide tables selection first
                    if (customTables) {
                        customTables.classList.add('hidden');
                    }
                    
                    if (isMatchingMode) {
                        startMatchingMode(selectedTables, customPracticeArea, customMatchingArea);
                    } else {
                        startStandardMode(selectedTables, customPracticeArea, customMatchingArea);
                    }
                });
            }
            
            console.log('Start practice button setup complete');
        } catch (error) {
            console.error('Error setting up start practice button:', error);
        }
    }
    
    function setupSubmitAndNextButtons() {
        try {
            console.log('Setting up submit and next buttons');
            
            // Setup submit button
            const submitCustomBtn = document.getElementById('submitCustom');
            if (submitCustomBtn) {
                const newSubmitBtn = submitCustomBtn.cloneNode(true);
                if (submitCustomBtn.parentNode) {
                    submitCustomBtn.parentNode.replaceChild(newSubmitBtn, submitCustomBtn);
                }
                
                newSubmitBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    checkCustomAnswer();
                });
            }
            
            // Setup next problem button
            const nextCustomProblemBtn = document.getElementById('nextCustomProblem');
            if (nextCustomProblemBtn) {
                const newNextBtn = nextCustomProblemBtn.cloneNode(true);
                if (nextCustomProblemBtn.parentNode) {
                    nextCustomProblemBtn.parentNode.replaceChild(newNextBtn, nextCustomProblemBtn);
                }
                
                newNextBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Get selected tables from active buttons
                    const selectedTables = [];
                    document.querySelectorAll('.table-btn.active').forEach(btn => {
                        selectedTables.push(parseInt(btn.getAttribute('data-table')));
                    });
                    
                    createCustomProblem(selectedTables);
                });
            }
            
            console.log('Submit and next buttons setup complete');
        } catch (error) {
            console.error('Error setting up submit and next buttons:', error);
        }
    }
    
    function startStandardMode(selectedTables, customPracticeArea, customMatchingArea) {
        try {
            console.log('Starting standard practice mode');
            
            // First hide both practice areas
            if (customMatchingArea) customMatchingArea.classList.add('hidden');
            if (customPracticeArea) customPracticeArea.classList.add('hidden');
            
            // Then show only the standard practice area
            if (customPracticeArea) {
                // Small delay to ensure DOM updates properly
                setTimeout(() => {
                    customPracticeArea.classList.remove('hidden');
                    console.log('Standard practice area now visible');
                    
                    // Generate first problem
                    createCustomProblem(selectedTables);
                }, 50);
            }
        } catch (error) {
            console.error('Error starting standard mode:', error);
            alert('There was an error starting practice mode. Please try again.');
        }
    }
    
    function startMatchingMode(selectedTables, customPracticeArea, customMatchingArea) {
        try {
            console.log('Starting matching practice mode');
            
            // First hide both practice areas
            if (customPracticeArea) customPracticeArea.classList.add('hidden');
            if (customMatchingArea) customMatchingArea.classList.add('hidden');
            
            // Then show only the matching area
            if (customMatchingArea) {
                // Small delay to ensure DOM updates properly
                setTimeout(() => {
                    customMatchingArea.classList.remove('hidden');
                    console.log('Matching practice area now visible');
                    
                    // Create matching cards
                    const customFlipCardGrid = document.getElementById('customFlipCardGrid');
                    if (customFlipCardGrid) {
                        customFlipCardGrid.innerHTML = ''; // Clear any existing cards
                        const cardHTML = createMatchingCards(selectedTables);
                        customFlipCardGrid.innerHTML = cardHTML;
                        
                        // Setup card flip functionality
                        setupCardFlips(customFlipCardGrid);
                    }
                }, 50);
            }
        } catch (error) {
            console.error('Error starting matching mode:', error);
            alert('There was an error starting matching mode. Please try again.');
        }
    }
    
    function createCustomProblem(selectedTables) {
        try {
            console.log('Creating custom problem with tables:', selectedTables);
            
            // Get relevant elements
            const factor1 = document.getElementById('customFactor1');
            const factor2 = document.getElementById('customFactor2');
            const feedback = document.getElementById('customFeedback');
            const correctGifContainer = document.getElementById('correctGifContainer');
            const customInput = document.getElementById('customInput');
            
            if (factor1 && factor2) {
                // Clear previous feedback and input
                if (feedback) feedback.textContent = '';
                if (correctGifContainer) correctGifContainer.classList.add('hidden');
                if (customInput) {
                    customInput.value = '';
                    customInput.focus();
                }
                
                // Generate new problem
                const table = selectedTables[Math.floor(Math.random() * selectedTables.length)];
                const number = Math.floor(Math.random() * 12) + 1;
                
                factor1.textContent = table;
                factor2.textContent = number;
                
                console.log(`Created problem: ${table} × ${number} = ${table * number}`);
            }
        } catch (error) {
            console.error('Error creating custom problem:', error);
        }
    }
    
    function checkCustomAnswer() {
        try {
            console.log('Checking custom answer');
            
            // Get relevant elements
            const factor1El = document.getElementById('customFactor1');
            const factor2El = document.getElementById('customFactor2');
            const inputEl = document.getElementById('customInput');
            const feedbackEl = document.getElementById('customFeedback');
            const correctGifContainer = document.getElementById('correctGifContainer');
            
            if (factor1El && factor2El && inputEl && feedbackEl) {
                const factor1 = parseInt(factor1El.textContent);
                const factor2 = parseInt(factor2El.textContent);
                const userAnswer = parseInt(inputEl.value);
                const correctAnswer = factor1 * factor2;
                
                console.log(`Checking answer: ${factor1} × ${factor2} = ${correctAnswer}, user entered: ${userAnswer}`);
                
                if (isNaN(userAnswer)) {
                    feedbackEl.textContent = 'Please enter a number';
                    feedbackEl.className = 'feedback warning';
                } else if (userAnswer === correctAnswer) {
                    feedbackEl.textContent = 'Correct! Great job!';
                    feedbackEl.className = 'feedback correct';
                    
                    // Show celebration if available
                    if (correctGifContainer) {
                        correctGifContainer.classList.remove('hidden');
                    }
                    
                    // Add points if points system exists
                    if (typeof addPoints === 'function') {
                        try {
                            addPoints(5);
                            console.log('Added 5 points for correct answer');
                        } catch (e) {
                            console.error('Error adding points:', e);
                        }
                    }
                } else {
                    feedbackEl.textContent = `Not correct. The answer is ${correctAnswer}. Try again!`;
                    feedbackEl.className = 'feedback incorrect';
                }
            }
        } catch (error) {
            console.error('Error checking answer:', error);
        }
    }
    
    function createMatchingCards(selectedTables) {
        try {
            console.log('Creating matching cards for tables:', selectedTables);
            
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
            
            console.log('Generated problems:', problems);
            
            // Create HTML for cards
            let cards = [];
            problems.forEach(item => {
                // Problem card
                cards.push(`<div class="flip-card" data-value="${item.problem}">
                    <div class="flip-card-inner">
                        <div class="flip-card-front"><i class="fas fa-question"></i></div>
                        <div class="flip-card-back">${item.problem}</div>
                    </div>
                </div>`);
                
                // Answer card
                cards.push(`<div class="flip-card" data-value="${item.problem}">
                    <div class="flip-card-inner">
                        <div class="flip-card-front"><i class="fas fa-question"></i></div>
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
        } catch (error) {
            console.error('Error creating matching cards:', error);
            return '<p>Error creating cards. Please try again.</p>';
        }
    }
    
    function setupCardFlips(gridElement) {
        try {
            console.log('Setting up card flips');
            
            const cards = gridElement.querySelectorAll('.flip-card');
            let flippedCards = [];
            let lockBoard = false;
            let matches = 0;
            let moves = 0;
            let startTime = Date.now();
            
            // Initialize timer
            const gameTimeEl = document.getElementById('customGameTime');
            const timerInterval = setInterval(() => {
                if (gameTimeEl) {
                    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                    const minutes = Math.floor(elapsedSeconds / 60);
                    const seconds = elapsedSeconds % 60;
                    gameTimeEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                }
            }, 1000);
            
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
                    clearInterval(timerInterval);
                    
                    const gameCompleteMessage = document.getElementById('customGameCompleteMessage');
                    const finalMovesEl = document.getElementById('customFinalMoves');
                    const finalTimeEl = document.getElementById('customFinalTime');
                    const earnedPointsEl = document.getElementById('customEarnedPoints');
                    
                    if (gameCompleteMessage) {
                        gameCompleteMessage.classList.remove('hidden');
                        
                        // Calculate elapsed time
                        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                        const minutes = Math.floor(elapsedSeconds / 60);
                        const seconds = elapsedSeconds % 60;
                        const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                        
                        // Update final stats
                        if (finalMovesEl) finalMovesEl.textContent = moves;
                        if (finalTimeEl) finalTimeEl.textContent = timeString;
                        
                        // Calculate and add points
                        const points = Math.max(10, 100 - (moves * 2));
                        if (earnedPointsEl) earnedPointsEl.textContent = points;
                        
                        // Add points if points system exists
                        if (typeof addPoints === 'function') {
                            try {
                                addPoints(points);
                                console.log(`Added ${points} points for completing the matching game`);
                            } catch (e) {
                                console.error('Error adding points:', e);
                            }
                        }
                        
                        // Setup practice again button
                        const practiceAgainBtn = document.getElementById('practiceAgainBtn');
                        if (practiceAgainBtn) {
                            practiceAgainBtn.addEventListener('click', function() {
                                gameCompleteMessage.classList.add('hidden');
                                
                                // Get parent card element and return to selection
                                const parentCard = gridElement.closest('.card');
                                const customTables = parentCard.querySelector('.custom-tables');
                                const customMatchingArea = parentCard.querySelector('.custom-matching-area');
                                
                                if (customTables && customMatchingArea) {
                                    customMatchingArea.classList.add('hidden');
                                    customTables.classList.remove('hidden');
                                }
                            });
                        }
                    }
                }
            };
            
            // Initialize stats
            updateStats();
            
            // Add click handlers to cards
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
            
            console.log('Card flips setup complete');
        } catch (error) {
            console.error('Error setting up card flips:', error);
        }
    }
    
    function setupPracticeAgainButton() {
        const practiceAgainBtn = document.getElementById('practiceAgainBtn');
        if (practiceAgainBtn) {
            practiceAgainBtn.addEventListener('click', function() {
                const customGameCompleteMessage = document.getElementById('customGameCompleteMessage');
                if (customGameCompleteMessage) {
                    customGameCompleteMessage.classList.add('hidden');
                }
                
                // Get all relevant elements
                const customTables = document.querySelector('.custom-tables');
                const customPracticeArea = document.querySelector('.custom-practice-area');
                const customMatchingArea = document.querySelector('.custom-matching-area');
                
                // Hide practice areas
                if (customPracticeArea) customPracticeArea.classList.add('hidden');
                if (customMatchingArea) customMatchingArea.classList.add('hidden');
                
                // Show tables selection
                if (customTables) customTables.classList.remove('hidden');
            });
        }
    }
    
    function setupBackButton() {
        const backBtn = document.querySelector('#wordGenerator .btn-back');
        if (backBtn) {
            backBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get custom tables
                const customTables = document.querySelector('.custom-tables');
                const customPracticeArea = document.querySelector('.custom-practice-area');
                const customMatchingArea = document.querySelector('.custom-matching-area');
                
                // Make sure tables are visible when going back
                if (customTables) customTables.classList.remove('hidden');
                if (customPracticeArea) customPracticeArea.classList.add('hidden');
                if (customMatchingArea) customMatchingArea.classList.add('hidden');
            });
        }
    }
})();
