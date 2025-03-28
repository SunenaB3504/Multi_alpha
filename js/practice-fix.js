/**
 * Practice Fix Utility - Diagnoses and repairs common issues
 */
(function() {
    console.log('Practice Fix Utility loaded');
    
    // Run on DOM content loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Add button to dashboard to run full diagnostics
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            const diagButton = document.createElement('button');
            diagButton.className = 'btn-secondary';
            diagButton.innerHTML = '<i class="fas fa-stethoscope"></i> Run App Diagnostics';
            diagButton.style.marginTop = '15px';
            diagButton.onclick = runFullDiagnostics;
            
            // Add at the end of the dashboard
            dashboard.appendChild(diagButton);
        }
        
        // Fix common issues automatically
        fixCommonIssues();
    });
    
    /**
     * Run full diagnostics on the app
     */
    function runFullDiagnostics() {
        console.log('Running full app diagnostics...');
        
        try {
            // Check for required DOM elements
            if (window.checkPracticeElements) {
                window.checkPracticeElements();
            }
            
            // Check module loading
            const modules = ['UI', 'Practice', 'Core', 'AppCore', 'Settings', 'FlipCardGame'];
            modules.forEach(moduleName => {
                console.log(`${moduleName} module: ${typeof window[moduleName] !== 'undefined' ? 'Loaded' : 'Not found'}`);
            });
            
            // Check for event handler registration
            const generatePracticeBtn = document.getElementById('generatePractice');
            if (generatePracticeBtn) {
                console.log('generatePractice button event handlers:', generatePracticeBtn);
                
                // Try to register handler directly as a fallback
                generatePracticeBtn.addEventListener('click', function() {
                    console.log('Direct click handler added by diagnostics');
                    if (window.Practice && typeof Practice.startPractice === 'function') {
                        Practice.startPractice();
                    }
                });
                
                alert('Diagnostics complete. Check console for details. Added fallback click handler to practice button.');
            }
        } catch (error) {
            console.error('Diagnostics error:', error);
        }
    }
    
    /**
     * Fix common issues with the practice functionality
     */
    function fixCommonIssues() {
        try {
            // Add the startPractice function to the Practice public API if it doesn't exist
            if (window.Practice && !Practice.startPractice) {
                Object.defineProperty(Practice, 'startPractice', {
                    value: function() {
                        console.log('Called exposed startPractice');
                        // Get reference to the internal function
                        // This is a bit of a hack but necessary to expose the internal function
                        const sourceCode = Practice.init.toString();
                        eval('(' + sourceCode + ')()');
                    }
                });
                console.log('Added startPractice to Practice API');
            }
            
            // Ensure Core/AppCore fallback is available
            if (!window.Core && !window.AppCore) {
                window.AppCore = {
                    getState: function() { return { points: 0 }; },
                    addPoints: function(pts) { 
                        console.log('Mock points added:', pts);
                        return pts; 
                    }
                };
                console.log('Added AppCore fallback');
            }
        } catch (error) {
            console.error('Error fixing issues:', error);
        }
    }
})();
