/**
 * Settings management for Multiplication Adventure
 */

const Settings = (function() {
    // Default settings
    const defaultSettings = {
        highContrast: false,
        textSize: 'medium',
        timerDuration: 15
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
     */
    function setupEventListeners() {
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
    
    // Public API
    return {
        init,
        getSettings,
        saveSettings
    };
})();

// Initialize settings module when document is ready
document.addEventListener('DOMContentLoaded', function() {
    Settings.init();
});
