/**
 * Fix for the Custom Practice "Start Practice" button functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    const generatePracticeBtn = document.getElementById('generatePractice');
    const customPracticeArea = document.querySelector('.custom-practice-area');
    const customMatchingArea = document.querySelector('.custom-matching-area');
    const standardModeBtn = document.getElementById('standardModeBtn');
    const matchingModeBtn = document.getElementById('matchingModeBtn');

    if (generatePracticeBtn) {
        console.log('Practice button fix loaded and active');
        
        // Ensure we remove any existing event listeners to avoid duplication
        generatePracticeBtn.replaceWith(generatePracticeBtn.cloneNode(true));
        const newBtn = document.getElementById('generatePractice');
        
        newBtn.addEventListener('click', function() {
            console.log('Start Practice button clicked');
            
            // Get selected tables
            const selectedTables = Array.from(document.querySelectorAll('.table-btn.active'))
                .map(btn => parseInt(btn.getAttribute('data-table')));
            
            if (selectedTables.length === 0) {
                alert('Please select at least one multiplication table to practice.');
                return;
            }
            
            // Check which mode is active
            const isMatchingMode = matchingModeBtn && matchingModeBtn.classList.contains('active');
            
            if (isMatchingMode) {
                // Initialize and show the matching practice mode
                console.log('Starting matching practice mode');
                if (customMatchingArea) {
                    customPracticeArea.classList.add('hidden');
                    customMatchingArea.classList.remove('hidden');
                    
                    // Initialize matching cards if a function exists for it
                    if (typeof initializeCustomMatchingCards === 'function') {
                        initializeCustomMatchingCards(selectedTables);
                    } else {
                        console.error('initializeCustomMatchingCards function not found');
                        // Fallback implementation
                        const gridElement = document.getElementById('customFlipCardGrid');
                        if (gridElement) {
                            gridElement.innerHTML = '<p>Matching mode is currently under development.</p>';
                        }
                    }
                }
            } else {
                // Initialize and show the standard practice mode
                console.log('Starting standard practice mode');
                if (customPracticeArea) {
                    customMatchingArea.classList.add('hidden');
                    customPracticeArea.classList.remove('hidden');
                    
                    // Generate the first problem
                    if (typeof generateCustomProblem === 'function') {
                        generateCustomProblem(selectedTables);
                    } else {
                        console.log('Using fallback problem generator');
                        // Fallback if the function doesn't exist
                        const factor1 = document.getElementById('customFactor1');
                        const factor2 = document.getElementById('customFactor2');
                        
                        if (factor1 && factor2) {
                            const table = selectedTables[Math.floor(Math.random() * selectedTables.length)];
                            const number = Math.floor(Math.random() * 12) + 1;
                            
                            factor1.textContent = table;
                            factor2.textContent = number;
                        }
                    }
                }
            }
        });
    }
    
    // Add click handlers for table selection buttons if they're not working
    document.querySelectorAll('.table-btn').forEach(btn => {
        // Remove existing listeners to prevent duplicates
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            console.log(`Table ${this.getAttribute('data-table')} toggled`);
        });
    });
    
    // Add click handlers for mode buttons if they're not working
    if (standardModeBtn && matchingModeBtn) {
        // Clean up standardModeBtn
        const newStdBtn = standardModeBtn.cloneNode(true);
        standardModeBtn.parentNode.replaceChild(newStdBtn, standardModeBtn);
        
        // Clean up matchingModeBtn
        const newMatchBtn = matchingModeBtn.cloneNode(true);
        matchingModeBtn.parentNode.replaceChild(newMatchBtn, matchingModeBtn);
        
        newStdBtn.addEventListener('click', function() {
            this.classList.add('active');
            document.getElementById('matchingModeBtn').classList.remove('active');
            console.log('Standard mode selected');
        });
        
        newMatchBtn.addEventListener('click', function() {
            this.classList.add('active');
            document.getElementById('standardModeBtn').classList.remove('active');
            console.log('Matching mode selected');
        });
    }

    console.log('Practice button fix initialization complete');
});
