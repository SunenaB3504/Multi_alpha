/**
 * Multiplication Tables Data and Utilities
 */

const MultiplicationTables = (function() {
    // Store tables by level
    const tablesByLevel = {
        1: [1, 2, 3, 4, 5],        // Basic tables 1-5
        2: [6, 7, 8, 9],           // Intermediate tables 6-9
        3: [10, 11, 12]            // Advanced tables 10-12
    };
    
    // Maximum number for multiplication (1-12)
    const MAX_MULTIPLIER = 12;
    
    // Store current level
    let currentLevel = 1;
    
    /**
     * Get tables for a specific level
     * @param {Number} level - The level (1, 2, or 3)
     * @return {Array} - Array of table numbers for that level
     */
    function getTablesForLevel(level) {
        return tablesByLevel[level] || tablesByLevel[1];
    }
    
    /**
     * Get random multiplication problem for the current level
     * @return {Object} - Object containing factor1, factor2, and answer
     */
    function getRandomProblem() {
        const tables = getTablesForLevel(currentLevel);
        const factor1 = tables[Math.floor(Math.random() * tables.length)];
        const factor2 = Math.floor(Math.random() * MAX_MULTIPLIER) + 1;
        
        return {
            factor1,
            factor2,
            answer: factor1 * factor2
        };
    }
    
    /**
     * Get random problem from specific tables
     * @param {Array} tables - Array of table numbers to use
     * @return {Object} - Object containing factor1, factor2, and answer
     */
    function getProblemFromTables(tables) {
        if (!tables || tables.length === 0) {
            return getRandomProblem();
        }
        
        const factor1 = tables[Math.floor(Math.random() * tables.length)];
        const factor2 = Math.floor(Math.random() * MAX_MULTIPLIER) + 1;
        
        return {
            factor1,
            factor2,
            answer: factor1 * factor2
        };
    }
    
    /**
     * Get complete multiplication table for a specific number
     * @param {Number} tableNumber - The multiplication table to generate (e.g., 5 for 5x table)
     * @return {Array} - Array of objects with each calculation in the table
     */
    function getFullTable(tableNumber) {
        const table = [];
        
        for (let i = 1; i <= MAX_MULTIPLIER; i++) {
            table.push({
                factor1: tableNumber,
                factor2: i,
                answer: tableNumber * i
            });
        }
        
        return table;
    }
    
    /**
     * Set the current level
     * @param {Number} level - The level to set (1, 2, or 3)
     */
    function setCurrentLevel(level) {
        if (level >= 1 && level <= 3) {
            currentLevel = level;
        }
    }
    
    /**
     * Get the current level
     * @return {Number} - The current level
     */
    function getCurrentLevel() {
        return currentLevel;
    }
    
    // Public API
    return {
        getTablesForLevel,
        getRandomProblem,
        getProblemFromTables,
        getFullTable,
        setCurrentLevel,
        getCurrentLevel
    };
})();
