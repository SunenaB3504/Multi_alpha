/**
 * Debug utilities for Multiplication Adventure
 */
console.log('Initializing debug utilities');

// Check if the practice module is loading correctly
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking modules...');
    
    // Check Practice module
    if (typeof Practice !== 'undefined') {
        console.log('✓ Practice module loaded');
    } else {
        console.error('✗ Practice module not found');
    }
    
    // Check UI module
    if (typeof UI !== 'undefined') {
        console.log('✓ UI module loaded');
    } else {
        console.error('✗ UI module not found');
    }
    
    // Check that table buttons exist
    const tableButtons = document.querySelectorAll('.table-btn');
    console.log(`Found ${tableButtons.length} table buttons`);
    
    // Check that practice mode buttons exist
    const standardModeBtn = document.getElementById('standardModeBtn');
    const matchingModeBtn = document.getElementById('matchingModeBtn');
    console.log('standardModeBtn exists:', !!standardModeBtn);
    console.log('matchingModeBtn exists:', !!matchingModeBtn);
    
    // Check that the start practice button exists
    const generatePracticeBtn = document.getElementById('generatePractice');
    console.log('generatePracticeBtn exists:', !!generatePracticeBtn);
    
    // Add debug click handler to the generate practice button
    if (generatePracticeBtn) {
        const originalClick = generatePracticeBtn.onclick;
        generatePracticeBtn.onclick = function(e) {
            console.log('Debug: generatePractice button clicked');
            if (originalClick) originalClick.call(this, e);
        };
    }
    
    // Add debug click handler to practice mode buttons
    if (standardModeBtn) {
        standardModeBtn.addEventListener('click', function() {
            console.log('Debug: Standard mode button clicked');
        });
    }
    
    if (matchingModeBtn) {
        matchingModeBtn.addEventListener('click', function() {
            console.log('Debug: Matching mode button clicked');
        });
    }
    
    // Add debug click handler to all table buttons
    tableButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Debug: Table button clicked:', this.dataset.table);
        });
    });
});

// Add DOM element checker utility
window.checkPracticeElements = function() {
    console.log('Checking practice DOM elements...');
    const elements = [
        // Practice areas
        { name: '.custom-practice-area', element: document.querySelector('.custom-practice-area') },
        { name: '.custom-matching-area', element: document.querySelector('.custom-matching-area') },
        
        // Standard practice elements
        { name: 'customFactor1', element: document.getElementById('customFactor1') },
        { name: 'customFactor2', element: document.getElementById('customFactor2') },
        { name: 'customInput', element: document.getElementById('customInput') },
        { name: 'customFeedback', element: document.getElementById('customFeedback') },
        { name: 'nextCustomProblem', element: document.getElementById('nextCustomProblem') },
        
        // Matching game elements
        { name: 'customMatchesCount', element: document.getElementById('customMatchesCount') },
        { name: 'customMovesCount', element: document.getElementById('customMovesCount') },
        { name: 'customGameTime', element: document.getElementById('customGameTime') },
        { name: 'customFlipCardGrid', element: document.getElementById('customFlipCardGrid') },
        { name: 'customGameCompleteMessage', element: document.getElementById('customGameCompleteMessage') },
        
        // Practice control elements
        { name: 'standardModeBtn', element: document.getElementById('standardModeBtn') },
        { name: 'matchingModeBtn', element: document.getElementById('matchingModeBtn') },
        { name: 'generatePractice', element: document.getElementById('generatePractice') }
    ];
    
    let allFound = true;
    elements.forEach(item => {
        const status = item.element ? '✓' : '✗';
        console.log(`${status} ${item.name}`);
        if (!item.element) allFound = false;
    });
    
    if (allFound) {
        console.log('All required DOM elements found!');
    } else {
        console.error('Some DOM elements are missing. Practice may not work correctly.');
    }
    
    return allFound;
};

// Automatically check elements when opening practice
document.addEventListener('DOMContentLoaded', function() {
    const openGeneratorBtn = document.getElementById('openGenerator');
    if (openGeneratorBtn) {
        openGeneratorBtn.addEventListener('click', function() {
            setTimeout(window.checkPracticeElements, 200);
        });
    }
});

// Add a global function to test practice initialization
window.testPracticeInit = function() {
    console.log('Testing practice initialization...');
    
    if (typeof Practice === 'undefined') {
        console.error('Practice module not available');
        return;
    }
    
    // Re-initialize table buttons
    if (Practice.setupTableButtons) {
        Practice.setupTableButtons();
        console.log('Re-initialized table buttons');
    }
    
    // Open custom practice section
    if (typeof UI !== 'undefined' && UI.showSection) {
        UI.showSection('wordGenerator');
        console.log('Showed custom practice section');
    } else {
        console.error('UI.showSection not available');
    }
};

console.log('Debug utilities loaded - Use window.testPracticeInit() to test practice');
