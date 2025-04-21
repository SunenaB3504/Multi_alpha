/**
 * Settings management for Multiplication Adventure
 */

const Settings = (function() {
    // Default settings
    const defaultSettings = {
        highContrast: false,
        textSize: 'medium',
        timerDuration: 15,
        soundEnabled: true
    };
    
    // Current settings
    let currentSettings = { ...defaultSettings };
    
    /**
     * Initialize settings module
     */
    function init() {
        console.log('Initializing settings module');
        
        // Load saved settings
        loadSettings();
        
        // Apply current settings
        applySettings();
        
        // Set up event listeners
        setupEventListeners();
    }
    
    /**
     * Set up event listeners for settings controls
     */    function setupEventListeners() {
        // High contrast toggle
        const highContrastToggle = document.getElementById('highContrast');
        highContrastToggle.checked = currentSettings.highContrast;
        highContrastToggle.addEventListener('change', () => {
            currentSettings.highContrast = highContrastToggle.checked;
            UI.setHighContrast(currentSettings.highContrast);
        });
        
        // Text size dropdown
        const textSizeSelect = document.getElementById('textSize');
        textSizeSelect.value = currentSettings.textSize;
        textSizeSelect.addEventListener('change', () => {
            currentSettings.textSize = textSizeSelect.value;
            UI.setTextSize(currentSettings.textSize);
        });
        
        // Timer duration dropdown
        const timerDurationSelect = document.getElementById('timerDuration');
        timerDurationSelect.value = currentSettings.timerDuration.toString();
        timerDurationSelect.addEventListener('change', () => {
            currentSettings.timerDuration = parseInt(timerDurationSelect.value);
            MathUtils.setTimerDuration(currentSettings.timerDuration);
        });
        
        // Sound toggle
        const soundToggle = document.getElementById('soundEnabled');
        if (soundToggle) {
            soundToggle.checked = currentSettings.soundEnabled;
            soundToggle.addEventListener('change', () => {
                currentSettings.soundEnabled = soundToggle.checked;
            });
        }
        
        // Reset App Data button
        const resetAppDataBtn = document.getElementById('resetAppData');
        if (resetAppDataBtn) {
            resetAppDataBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all app data? This will clear cached files and may fix problems with the app. Your progress will not be lost.')) {
                    resetAppData();
                }
            });
        }
        
        // Save button
        const saveButton = document.getElementById('saveSettings');
        saveButton.addEventListener('click', () => {
            saveSettings();
            UI.showSection('dashboard');
        });
    }
    
    /**
     * Apply current settings to the app
     */
    function applySettings() {
        // Apply high contrast
        UI.setHighContrast(currentSettings.highContrast);
        
        // Apply text size
        UI.setTextSize(currentSettings.textSize);
        
        // Apply timer duration
        MathUtils.setTimerDuration(currentSettings.timerDuration);
        
        // Apply sound settings
        if (window.SoundManager && typeof SoundManager.setSoundEnabled === 'function') {
            SoundManager.setSoundEnabled(currentSettings.soundEnabled);
        }
    }
    
    /**
     * Save settings to localStorage
     */
    function saveSettings() {
        try {
            localStorage.setItem('multiplicationSettings', JSON.stringify(currentSettings));
            console.log('Settings saved');
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }
    
    /**
     * Load settings from localStorage
     */
    function loadSettings() {
        try {
            const savedSettings = localStorage.getItem('multiplicationSettings');
            
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                
                // Update current settings with saved values
                currentSettings = {
                    ...defaultSettings,
                    ...parsedSettings
                };
                
                console.log('Settings loaded');
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    /**
     * Get current settings
     * @return {Object} Current settings object
     */
    function getSettings() {
        return { ...currentSettings };
    }
      /**
     * Get sound setting
     * @return {boolean} Whether sound is enabled
     */
    function isSoundEnabled() {
        // Use SoundManager if available, otherwise fall back to settings
        if (window.SoundManager && typeof SoundManager.isSoundEnabled === 'function') {
            return SoundManager.isSoundEnabled();
        }
        return currentSettings.soundEnabled;
    }
    
    /**
     * Reset app data by clearing caches
     * This is especially useful for Android WebView browsers
     */
    function resetAppData() {
        try {
            // Show a loading message
            UI.showMessage('Clearing app data... Please wait.', 'info');
            
            // Clear service worker caches
            if ('caches' in window) {
                caches.keys().then(cacheNames => {
                    return Promise.all(
                        cacheNames.map(cacheName => {
                            console.log('Deleting cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                    );
                });
            }
            
            // Unregister service workers
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    for (let registration of registrations) {
                        console.log('Unregistering service worker');
                        registration.unregister();
                    }
                });
            }
            
            // Save current progress data before clearing
            const progressData = localStorage.getItem('multiplicationProgress');
            const settingsData = localStorage.getItem('multiplicationSettings');
            
            // Clear local storage except for progress data
            localStorage.clear();
            
            // Restore important data
            if (progressData) localStorage.setItem('multiplicationProgress', progressData);
            if (settingsData) localStorage.setItem('multiplicationSettings', settingsData);
            
            // Show success message and reload after short delay
            UI.showMessage('App data cleared successfully! Reloading app...', 'success');
            
            // Reload the page after a short delay to apply changes
            setTimeout(() => {
                window.location.reload(true); // Force reload from server, not cache
            }, 2000);
            
        } catch (error) {
            console.error('Error resetting app data:', error);
            UI.showMessage('There was a problem clearing app data. Please try again or contact support.', 'error');
        }
    }
    
    // Public API
    return {
        init,
        getSettings,
        saveSettings,
        isSoundEnabled
    };
})();

// Initialize settings module when document is ready
document.addEventListener('DOMContentLoaded', function() {
    Settings.init();
});
