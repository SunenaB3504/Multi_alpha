/**
 * Multiplication Tables module for the app
 */

const MultiplicationTables = (function() {
    // Current level (1: tables 1-5, 2: tables 6-9, 3: tables 10-12)
    let currentLevel = 1;
    
    // Tables for each level
    const levelTables = {
        1: [1, 2, 3, 4, 5],
        2: [6, 7, 8, 9],
        3: [10, 11, 12]
    };
    
    /**
     * Set the current level for multiplication tables
     * @param {number} level - The level to set (1-3)
     */
    function setCurrentLevel(level) {
        console.log('Setting multiplication tables level to:', level);
        
        // Validate level
        if (level < 1 || level > 3) {
            console.error('Invalid level provided, defaulting to level 1');
            level = 1;
        }
        
        currentLevel = level;
        return levelTables[level];
    }
    
    /**
     * Get the current level tables
     * @returns {Array} - Array of tables for the current level
     */
    function getCurrentLevelTables() {
        return levelTables[currentLevel];
    }
    
    /**
     * Generate a problem from specified tables
     * @param {Array} tables - Array of multiplication tables to use
     * @returns {Object} - Problem object with factor1, factor2, and answer
     */
    function getProblemFromTables(tables) {
        console.log('Generating problem from tables:', tables);
        
        if (!tables || !tables.length) {
            console.error('No tables provided! Using current level tables.');
            tables = getCurrentLevelTables();
        }
        
        // Select a random table from the provided tables
        const tableIndex = Math.floor(Math.random() * tables.length);
        const table = tables[tableIndex];
        
        // Generate a random second factor (1-12)
        const factor2 = Math.floor(Math.random() * 12) + 1;
        
        // Calculate the answer
        const answer = table * factor2;
        
        // Return problem object
        return {
            factor1: table,
            factor2: factor2,
            answer: answer
        };
    }
    
    /**
     * Get tables for a specific level
     * @param {number} level - The level (1-3)
     * @returns {Array} - Array of tables for the specified level
     */
    function getTablesForLevel(level) {
        if (level < 1 || level > 3) {
            console.error('Invalid level, defaulting to level 1');
            level = 1;
        }
        return levelTables[level];
    }
    
    /**
     * Get the current level
     * @returns {number} - The current level (1-3)
     */
    function getCurrentLevel() {
        return currentLevel;
    }
    
    // Public API
    return {
        getProblemFromTables,
        setCurrentLevel,
        getCurrentLevelTables,
        getTablesForLevel,
        getCurrentLevel  // Add this to expose the getCurrentLevel function
    };
})();

// Make it globally available
window.MultiplicationTables = MultiplicationTables;

console.log('Multiplication Tables module loaded');
