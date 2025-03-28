/**
 * Card Display Fix Utility
 * Adds special debugging and fixes for the custom matching cards display
 */
(function() {
    console.log("Card Display Fix utility loaded");
    
    // Apply fixes when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Add a diagnostics button to the custom matching area
        setTimeout(addDiagnosticsButton, 500);
        
        // Add listener for the practice section to fix cards when shown
        const openGeneratorBtn = document.getElementById('openGenerator');
        if (openGeneratorBtn) {
            openGeneratorBtn.addEventListener('click', function() {
                setTimeout(fixCardDisplay, 500);
            });
        }
        
        // Add listener for start practice button 
        const generatePracticeBtn = document.getElementById('generatePractice');
        if (generatePracticeBtn) {
            generatePracticeBtn.addEventListener('click', function() {
                setTimeout(fixCardDisplay, 500);
            });
        }
    });
    
    /**
     * Add a diagnostics button to the custom matching area
     */
    function addDiagnosticsButton() {
        const matchingArea = document.querySelector('.custom-matching-area');
        if (!matchingArea) return;
        
        const diagButton = document.createElement('button');
        diagButton.textContent = "Fix Card Display";
        diagButton.className = "btn-secondary";
        diagButton.style.margin = "10px 0";
        diagButton.addEventListener('click', fixCardDisplay);
        
        matchingArea.insertBefore(diagButton, matchingArea.firstChild);
    }
    
    /**
     * Fix card display issues
     */
    function fixCardDisplay() {
        console.log("Running card display fixes");
        
        // Check if we're on the custom practice page
        const matchingArea = document.querySelector('.custom-matching-area');
        if (!matchingArea || matchingArea.classList.contains('hidden')) {
            console.log("Matching area not visible, skipping fix");
            return;
        }
        
        // Fix grid layout
        const grid = document.getElementById('customFlipCardGrid');
        if (!grid) {
            console.error("Could not find customFlipCardGrid");
            return;
        }
        
        // Count actual cards
        const cards = grid.querySelectorAll('.flip-card');
        console.log(`Found ${cards.length} cards in the grid`);
        
        // Apply appropriate grid class based on card count
        grid.className = 'flip-card-grid';
        if (cards.length <= 12) {
            grid.classList.add('grid-3x4');
        } else if (cards.length <= 16) {
            grid.classList.add('grid-4x4');
        } else if (cards.length <= 20) {
            grid.classList.add('grid-4x5');
        } else {
            grid.classList.add('grid-4x6');
        }
        
        // Ensure all cards are visible
        cards.forEach(card => {
            card.style.visibility = 'visible';
            card.style.display = 'block';
            card.style.opacity = '1';
        });
        
        // Force grid redisplay
        grid.style.display = 'none';
        setTimeout(() => {
            grid.style.display = 'grid';
            console.log("Fixed card grid display");
        }, 50);
    }
    
    // Expose utility functions
    window.CardFix = {
        fixCardDisplay: fixCardDisplay
    };
})();
