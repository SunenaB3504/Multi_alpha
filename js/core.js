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
        
        // Load saved data
        loadUserData();
        
        // Initialize UI with current state
        UI.updatePoints(state.points);
        UI.updateLevel(state.userLevel);
        UI.updateLevelProgress(state.currentLevelPoints, state.nextLevelThreshold);
        
        // Set correct multiplication table level
        MultiplicationTables.setCurrentLevel(state.userLevel);
        
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
        const currentLevel = MultiplicationTables.getCurrentLevel();
        
        // Generate assessment problems
        state.assessmentProblems = MathUtils.generateAssessmentProblems(currentLevel, 10);
        state.currentProblemIndex = 0;
        
        // Show assessment section
        UI.showSection('assessment');
        
        // Start first problem
        Assessment.startProblem(state.assessmentProblems[0]);
        
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
        state.points += points;
        state.currentLevelPoints += points;
        
        // Update UI
        UI.updatePoints(state.points);
        
        // Check for level up
        checkLevelUp();
        
        // Save user data
        saveUserData();
        
        console.log('Added', points, 'points. New total:', state.points);
        
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
            userLevel: state.userLevel,
            points: state.points,
            currentLevelPoints: state.currentLevelPoints,
            nextLevelThreshold: state.nextLevelThreshold,
            rewards: state.rewards
        };
        
        try {
            localStorage.setItem('multiplicationAdventure', JSON.stringify(userData));
            console.log('User data saved');
        } catch (error) {
            console.error('Error saving user data:', error);
        }
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

// Initialize app when document is ready
document.addEventListener('DOMContentLoaded', function() {
    AppCore.init();
});
