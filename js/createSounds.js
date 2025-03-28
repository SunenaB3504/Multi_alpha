/**
 * Create placeholder sound files if they don't exist
 * This script helps ensure basic functionality even when sound files are missing
 */

(function() {
    console.log('Sound creation utility loaded');
    
    // Create base64-encoded sound data for basic audio feedback
    const soundData = {
        'click': "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjEwLjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAABPQAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/4zDEAAIuCEZBiaEBKK4GBwA4AFZVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
        'correct': "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjEwLjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAABPQAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/4zjEAALeNVJlgJAAI7OPkGRjgBlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
        'incorrect': "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjEwLjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAABPQAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/4zjEAAK+GVJVAJAAI3AIkGJDgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
        'complete': "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjEwLjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAABPQAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/4zjEAAK+GVJVAJAAI3AIkGJDgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
        'victory': "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjEwLjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAABPQAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/4zjEAAK+GVJVAJAAI3AIkGJDgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"
    };
    
    // List of required sound files
    const requiredSounds = [
        'click.mp3', 
        'complete.mp3', 
        'correct.mp3', 
        'error.mp3', 
        'incorrect.mp3',
        'points.mp3',
        'card-flip.mp3',
        'match.mp3',
        'mismatch.mp3',
        'victory.mp3',
        'background.mp3'
    ];
    
    /**
     * Initialize and create any missing sound files
     */
    function init() {
        console.log('Initializing sound creation utility');
        
        // Create sounds directory structure if needed
        checkAndCreateSoundsDirectory();
        
        // Apply immediate fix by adding sounds directly to SoundManager
        createAllMemorySounds();
        
        // Override SoundManager to use in-memory sounds if file loading fails
        overrideSoundManager();
        
        // Add button to dismiss sound alerts
        setTimeout(addDismissSoundAlertsButton, 1000);
    }
    
    /**
     * Add a button to dismiss sound alerts
     */
    function addDismissSoundAlertsButton() {
        const existingButton = document.getElementById('dismissSoundsBtn');
        if (existingButton) return;
        
        // Find any sound alert that might be shown
        const soundAlerts = document.querySelectorAll('div[style*="background-color: #f44336"]');
        if (soundAlerts.length === 0) return;
        
        soundAlerts.forEach(alert => {
            const dismissBtn = document.createElement('button');
            dismissBtn.id = 'dismissSoundsBtn';
            dismissBtn.textContent = 'Dismiss';
            dismissBtn.title = 'Dismiss Alert';
            dismissBtn.setAttribute('aria-label', 'Dismiss Alert');
            dismissBtn.style.cssText = `
                padding: 5px 10px;
                margin-right: 10px;
                background-color: #ddd;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            `;
            
            const fixBtn = document.createElement('button');
            fixBtn.textContent = 'Fix Sounds';
            fixBtn.title = 'Fix Sound Issues';
            fixBtn.setAttribute('aria-label', 'Fix Sound Issues');
            fixBtn.style.cssText = `
                padding: 5px 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            `;
            
            dismissBtn.onclick = () => alert.remove();
            fixBtn.onclick = () => {
                createAllMemorySounds();
                alert.remove();
            };
            
            // Clear any existing content and add our buttons
            alert.innerHTML = '<p>Some sound files are missing. Using in-memory sounds instead.</p>';
            alert.appendChild(dismissBtn);
            alert.appendChild(fixBtn);
        });
    }
    
    /**
     * Create all memory sounds immediately
     */
    function createAllMemorySounds() {
        if (!window.SoundManager || typeof SoundManager.addSound !== 'function') {
            console.error('SoundManager not available for creating memory sounds');
            return;
        }
        
        console.log('Creating all in-memory sounds');
        
        // Add all basic sounds to SoundManager
        for (const [soundId, base64Data] of Object.entries(soundData)) {
            SoundManager.addSound(soundId, base64Data);
            console.log(`Added in-memory sound: ${soundId}`);
        }
        
        // Map additional sounds as aliases to the basic sounds
        const additionalSounds = {
            'card-flip': 'click',
            'match': 'correct',
            'mismatch': 'incorrect',
            'error': 'incorrect',
            'points': 'correct',
            'background': 'complete'
        };
        
        for (const [soundId, baseSound] of Object.entries(additionalSounds)) {
            if (soundData[baseSound]) {
                SoundManager.addSound(soundId, soundData[baseSound]);
                console.log(`Added in-memory sound alias: ${soundId} → ${baseSound}`);
            }
        }
    }
    
    /**
     * Check if sounds directory exists and create if needed
     */
    function checkAndCreateSoundsDirectory() {
        console.log('Checking for sounds directory...');
        
        // Try to access sounds directory
        fetch('sounds/')
            .then(response => {
                if (response.ok) {
                    console.log('✓ Sounds directory exists');
                    checkRequiredSoundFiles();
                } else {
                    console.warn('Sounds directory not found - using in-memory sounds');
                    showDirectoryCreationInstructions();
                }
            })
            .catch(() => {
                console.warn('Could not access sounds directory - using in-memory sounds');
                showDirectoryCreationInstructions();
            });
    }
    
    /**
     * Check if all required sound files exist
     */
    function checkRequiredSoundFiles() {
        let missingCount = 0;
        let checkCount = 0;
        
        requiredSounds.forEach(sound => {
            fetch(`sounds/${sound}`, { method: 'HEAD' })
                .then(response => {
                    checkCount++;
                    if (!response.ok) {
                        missingCount++;
                    }
                    
                    if (checkCount === requiredSounds.length && missingCount > 0) {
                        console.warn(`Missing ${missingCount} sound files - using fallbacks`);
                    }
                })
                .catch(() => {
                    checkCount++;
                    missingCount++;
                    
                    if (checkCount === requiredSounds.length && missingCount > 0) {
                        console.warn(`Missing ${missingCount} sound files - using fallbacks`);
                    }
                });
        });
    }
    
    /**
     * Show instructions for creating the sounds directory
     */
    function showDirectoryCreationInstructions() {
        console.info('To create sound files, run the create-sounds-directory.bat file in the app folder');
        
        // Create a small UI notice if in browser context
        if (typeof document !== 'undefined') {
            const notice = document.createElement('div');
            notice.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                background-color: #2196F3;
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 14px;
                z-index: 9999;
                max-width: 300px;
            `;
            
            notice.innerHTML = `
                <div>Using in-memory sounds</div>
                <div style="font-size: 12px; margin-top: 5px;">
                    Run create-sounds-directory.bat to create sound files
                </div>
                <button id="closeNoticeBtn" style="
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    font-size: 16px;
                " title="Close Notification" aria-label="Close Notification">×</button>
            `;
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                if (notice.parentNode) {
                    notice.parentNode.removeChild(notice);
                }
            }, 5000);
            
            document.body.appendChild(notice);
            
            // Add close button functionality
            document.getElementById('closeNoticeBtn').addEventListener('click', () => {
                document.body.removeChild(notice);
            });
        }
    }
    
    /**
     * Override SoundManager to use in-memory sounds if file loading fails
     */
    function overrideSoundManager() {
        if (!window.SoundManager) {
            console.warn('SoundManager not found - cannot override');
            return;
        }
        
        // Keep a reference to the original play function
        const originalPlay = SoundManager.play;
        
        // Override the play function to use our in-memory sounds as fallback
        SoundManager.play = function(soundId) {
            try {
                // Try original function first
                originalPlay.call(SoundManager, soundId);
                
                // If we detect a sound error happened, use our in-memory sound
                const handleError = setTimeout(() => {
                    // Check if we have a matching base sound
                    const baseSound = getSoundNameMapping(soundId);
                    if (baseSound && soundData[baseSound]) {
                        console.log(`Using fallback in-memory sound for ${soundId}`);
                        
                        try {
                            const audio = new Audio(soundData[baseSound]);
                            audio.volume = 0.6;
                            audio.play().catch(err => {
                                console.warn(`Fallback sound play error (${soundId}):`, err);
                            });
                        } catch (error) {
                            console.error(`Error playing fallback sound for ${soundId}:`, error);
                        }
                    }
                }, 100); // Short delay to let original play try first
                
                // Clear timeout after 1 second
                setTimeout(() => clearTimeout(handleError), 1000);
                
            } catch (error) {
                console.error('Sound play error:', error);
                
                // Handle error by playing fallback sound
                const baseSound = getSoundNameMapping(soundId);
                if (baseSound && soundData[baseSound]) {
                    try {
                        const audio = new Audio(soundData[baseSound]);
                        audio.volume = 0.6;
                        audio.play().catch(err => {
                            console.warn(`Fallback sound play error (${soundId}):`, err);
                        });
                    } catch (error) {
                        console.error(`Error playing fallback sound for ${soundId}:`, error);
                    }
                }
            }
        };
        
        console.log('SoundManager play function overridden with fallback support');
    }
    
    /**
     * Map sound names to base sound types
     * @param {string} soundId - Sound ID to map
     * @return {string} Base sound type
     */
    function getSoundNameMapping(soundId) {
        const mapping = {
            'click': 'click',
            'flip': 'click',
            'card-flip': 'click',
            
            'correct': 'correct',
            'match': 'correct',
            'points': 'correct',
            
            'incorrect': 'incorrect',
            'mismatch': 'incorrect',
            'error': 'incorrect',
            
            'complete': 'complete',
            'victory': 'victory',
            'background': 'complete'
        };
        
        return mapping[soundId] || 'click'; // Default to click for unknown sounds
    }
    
    // Initialize on DOM content loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also make it available globally
    window.SoundFix = {
        createAllMemorySounds,
        dismissSoundAlerts: () => {
            const alerts = document.querySelectorAll('div[style*="background-color: #f44336"]');
            alerts.forEach(alert => alert.remove());
        }
    };
    
})();
