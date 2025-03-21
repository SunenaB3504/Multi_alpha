/**
 * Core application functionality for Multiplication Adventure
 */

const AppCore = (function() {
    // Application state
    const state = {
        userLevel: 1,
        points: 0,
        rewards: [],
        currentLevelPoints: 0,
        nextLevelThreshold: 100,
        currentMode: 'dashboard',
        assessmentProblems: [],
        currentProblemIndex: 0,
        selectedTables: []
    };
    
    // Points required to level up
    const levelThresholds = [0, 100, 250, 500, 1000];
    
    /**
     * Initialize the app
     */
    function init() {
        console.log('Initializing Multiplication Adventure app');
        
        // Ensure MultiplicationTables module is available and has all needed functions
        if (!window.MultiplicationTables) {
            console.error('MultiplicationTables module not loaded!');
            window.MultiplicationTables = {
                setCurrentLevel: function(level) {
                    console.log('Fallback level setter used:', level);
                    return [1, 2, 3, 4, 5];
                },
                getProblemFromTables: function(tables) {
                    console.log('Fallback problem generator used');
                    const factor1 = Math.floor(Math.random() * 10) + 1;
                    const factor2 = Math.floor(Math.random() * 10) + 1;
                    return {
                        factor1: factor1,
                        factor2: factor2,
                        answer: factor1 * factor2
                    };
                }
            };
        }
        
        // Make sure setCurrentLevel exists
        if (!window.MultiplicationTables.setCurrentLevel) {
            console.warn('Adding missing setCurrentLevel function to MultiplicationTables');
            window.MultiplicationTables.setCurrentLevel = function(level) {
                console.log('Fallback level setter used:', level);
                return level === 1 ? [1, 2, 3, 4, 5] : 
                       level === 2 ? [6, 7, 8, 9] : 
                       [10, 11, 12];
            };
        }
        
        // Load saved data first
        loadUserData();
        
        // Now it's safe to call setCurrentLevel with the loaded user level
        MultiplicationTables.setCurrentLevel(state.userLevel || 1);
        
        // Initialize UI with current state
        UI.updatePoints(state.points);
        UI.updateLevel(state.userLevel);
        UI.updateLevelProgress(state.currentLevelPoints, state.nextLevelThreshold);
        
        // Register event handlers
        registerEventHandlers();
        
        console.log('App initialized with user level:', state.userLevel);
    }
    
    /**
     * Register all event handlers
     */
    function registerEventHandlers() {
        // Level selection buttons
        document.getElementById('level1Btn').addEventListener('click', () => setTableLevel(1));
        document.getElementById('level2Btn').addEventListener('click', () => setTableLevel(2));
        document.getElementById('level3Btn').addEventListener('click', () => setTableLevel(3));
        
        // Action buttons
        document.getElementById('startAssessment').addEventListener('click', () => startAssessment());
        document.getElementById('playGame').addEventListener('click', () => startGame());
        document.getElementById('openGenerator').addEventListener('click', () => openCustomPractice());
        document.getElementById('openRewards').addEventListener('click', () => openRewards());
        document.getElementById('settingsBtn').addEventListener('click', () => UI.showSection('settings'));
        
        // Back buttons
        document.querySelectorAll('.btn-back').forEach(button => {
            button.addEventListener('click', () => UI.showSection('dashboard'));
        });
    }
    
    /**
     * Set the multiplication table level
     * @param {Number} level - The level to set
     */
    function setTableLevel(level) {
        MultiplicationTables.setCurrentLevel(level);
        
        // Update active button
        document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`level${level}Btn`).classList.add('active');
        
        console.log('Table level set to:', level);
    }
    
    /**
     * Start assessment mode
     */
    function startAssessment() {
        // Get the current level
        const currentLevel = MultiplicationTables.getCurrentLevel();
        
        // Generate assessment problems
        state.assessmentProblems = MathUtils.generateAssessmentProblems(currentLevel, 10);
        state.currentProblemIndex = 0;
        
        // Show assessment section
        UI.showSection('assessment');
        
        // Start the assessment with all problems
        if (window.Assessment && Assessment.startAssessment) {
            Assessment.startAssessment(state.assessmentProblems);
        } else {
            console.error('Assessment module not loaded or missing startAssessment function');
            // Fallback to just showing the first problem
            if (state.assessmentProblems.length > 0) {
                const problem = state.assessmentProblems[0];
                document.getElementById('factor1').textContent = problem.factor1;
                document.getElementById('factor2').textContent = problem.factor2;
            }
        }
        
        console.log('Starting assessment with level:', currentLevel);
    }
    
    /**
     * Start flash cards game
     */
    function startGame() {
        // Show game section
        UI.showSection('game');
        
        // Start the game
        Game.startGame();
        
        console.log('Starting flash cards game');
    }
    
    /**
     * Open custom practice section
     */
    function openCustomPractice() {
        // Show custom practice section
        UI.showSection('wordGenerator');
        
        // Initialize custom practice
        Practice.init();
        
        console.log('Opening custom practice');
    }
    
    /**
     * Open rewards center
     */
    function openRewards() {
        // Show rewards section
        UI.showSection('rewardsCenter');
        
        // Update rewards display
        Rewards.updateRewardsDisplay(state.points);
        
        console.log('Opening rewards center');
    }
    
    /**
     * Add points to user's total
     * @param {Number} points - Points to add
     */
    function addPoints(points) {
        console.log('Core: Adding points:', points);
        
        // Make sure points is a valid number
        if (typeof points !== 'number' || isNaN(points)) {
            console.error('Invalid points value:', points);
            points = 0;
        }
        
        // Convert to integer and ensure it's positive
        points = Math.abs(Math.floor(points));
        
        // Update state
        state.points += points;
        state.currentLevelPoints += points;
        
        console.log('New points total:', state.points);
        console.log('Current level points:', state.currentLevelPoints);
        
        // Update UI immediately
        try {
            UI.updatePoints(state.points);
        } catch (err) {
            console.error('Error updating points display:', err);
        }
        
        // Check for level up
        checkLevelUp();
        
        // Save user data
        saveUserData();
        
        // Expose points in global debugging
        window.debugTotalPoints = state.points;
        
        return state.points;
    }
    
    /**
     * Check if user should level up
     */
    function checkLevelUp() {
        if (state.currentLevelPoints >= state.nextLevelThreshold && state.userLevel < 3) {
            // Level up!
            state.userLevel++;
            state.currentLevelPoints = state.currentLevelPoints - state.nextLevelThreshold;
            state.nextLevelThreshold = levelThresholds[state.userLevel];
            
            // Update UI
            UI.updateLevel(state.userLevel);
            UI.showLevelUpMessage(state.userLevel);
            
            // Show dancing dog for level up too!
            if (window.UI && UI.showCelebrationAnimation) {
                setTimeout(() => {
                    UI.showCelebrationAnimation();
                }, 1000); // Slight delay after level up message
            }
            
            console.log('Level up! New level:', state.userLevel);
        }
        
        // Update progress bar
        UI.updateLevelProgress(state.currentLevelPoints, state.nextLevelThreshold);
    }
    
    /**
     * Save user data to localStorage
     */
    function saveUserData() {
        const userData = {
            userLevel: state.userLevel,           // Current level (1-3)
            points: state.points,                 // Total points earned
            currentLevelPoints: state.currentLevelPoints,   // Points in current level
            nextLevelThreshold: state.nextLevelThreshold,   // Points needed for next level
            rewards: state.rewards                // Rewards earned
        };
        
        // This saves the data to browser's localStorage
        localStorage.setItem('multiplicationAdventure', JSON.stringify(userData));
    }
    
    /**
     * Load user data from localStorage
     */
    function loadUserData() {
        try {
            const savedData = localStorage.getItem('multiplicationAdventure');
            
            if (savedData) {
                const userData = JSON.parse(savedData);
                
                // Update state with saved data
                state.userLevel = userData.userLevel || 1;
                state.points = userData.points || 0;
                state.currentLevelPoints = userData.currentLevelPoints || 0;
                state.nextLevelThreshold = userData.nextLevelThreshold || 100;
                state.rewards = userData.rewards || [];
                
                console.log('User data loaded');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
    
    /**
     * Get current application state
     */
    function getState() {
        return state;
    }
    
    // Public API
    return {
        init,
        addPoints,
        getState,
        saveUserData,
        setTableLevel
    };
})();

// Make sure AppCore is properly exposed globally
window.AppCore = AppCore;

// Initialize app when document is ready
document.addEventListener('DOMContentLoaded', function() {
    AppCore.init();
    
    // Debug output for initial state
    console.log('Initial app state:', AppCore.getState());
});
