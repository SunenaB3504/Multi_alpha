/**
 * Sound Manager for Multiplication Adventure
 * Handles loading and playing sound effects and background music
 */

const SoundManager = (function() {
    // Sound collection
    const sounds = {
        click: new Audio('sounds/click.mp3'),
        complete: new Audio('sounds/complete.mp3'),
        correct: new Audio('sounds/correct.mp3'),
        error: new Audio('sounds/error.mp3'),
        incorrect: new Audio('sounds/incorrect.mp3'),
        points: new Audio('sounds/points.mp3'),
        victory: new Audio('sounds/complete.mp3'), // Alias for backward compatibility
        match: new Audio('sounds/correct.mp3'),    // Alias for backward compatibility
        mismatch: new Audio('sounds/incorrect.mp3'), // Alias for backward compatibility
        flip: new Audio('sounds/click.mp3')        // Alias for backward compatibility
    };
    
    // Additional game-specific sounds
    const gameSounds = {
        'card-flip': 'sounds/card-flip.mp3',
        'match': 'sounds/match.mp3',
        'mismatch': 'sounds/mismatch.mp3',
        'victory': 'sounds/victory.mp3'
    };
    
    // Background music
    const backgroundMusic = new Audio('sounds/background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3; // Start at 30% volume
    
    let isMusicPlaying = false;
    let isSoundEnabled = true;
    let isInitialized = false;
    let pendingUserInteraction = false;
    
    /**
     * Initialize the sound manager
     */
    function init() {
        console.log('Initializing Sound Manager');

        // Preload all sounds
        preloadSounds();
        
        // Check settings
        if (window.Settings && typeof Settings.getSettings === 'function') {
            const settings = Settings.getSettings();
            isSoundEnabled = settings.soundEnabled;
            console.log(`Sound enabled from settings: ${isSoundEnabled}`);
        } else {
            console.log('Settings not available, using default sound setting');
        }
        
        // Load game-specific sounds
        loadGameSounds();
        
        // Add UI button to toggle background music
        addMusicToggle();
        
        // Add sound test panel
        addSoundTestPanel();
        
        // Add user interaction tracker to handle autoplay restrictions
        addUserInteractionTracker();
        
        isInitialized = true;
        console.log('Sound Manager initialized');
    }
    
    /**
     * Load additional game-specific sounds
     */
    function loadGameSounds() {
        console.log('Loading game-specific sounds');
        
        // Add all game sounds with error handling
        for (const [id, path] of Object.entries(gameSounds)) {
            try {
                // Don't overwrite if we already have this sound
                if (!sounds[id]) {
                    const sound = new Audio(path);
                    sound.volume = 0.6;
                    sound.load();
                    
                    sound.onerror = () => {
                        console.error(`Error loading sound: ${id} (${path})`);
                    };
                    
                    sounds[id] = sound;
                    console.log(`Loaded game sound: ${id} (${path})`);
                }
            } catch (error) {
                console.error(`Error setting up sound: ${id}`, error);
            }
        }
    }
    
    /**
     * Preload all sounds to avoid delays
     */
    function preloadSounds() {
        console.log('Preloading sounds');
        
        // Try to load each sound, with error handling
        for (const key in sounds) {
            if (sounds.hasOwnProperty(key) && sounds[key] instanceof Audio) {
                try {
                    // Set lower volume for sound effects
                    sounds[key].volume = 0.6;
                    
                    // Force load
                    sounds[key].load();
                    
                    // Add error handling
                    sounds[key].onerror = () => {
                        console.error(`Error loading sound: ${key}`);
                        // Replace with new Audio object to try again later
                        sounds[key] = new Audio(sounds[key].src);
                        sounds[key].volume = 0.6;
                    };
                    
                    console.log(`Preloaded sound: ${key}`);
                } catch (error) {
                    console.error(`Error preloading sound: ${key}`, error);
                }
            }
        }
        
        // Preload background music
        try {
            backgroundMusic.load();
            backgroundMusic.onerror = () => console.error('Error loading background music');
            console.log('Preloaded background music');
        } catch (error) {
            console.error('Error preloading background music:', error);
        }
    }
    
    /**
     * Add an Audio object directly to the sounds collection
     * For use with dynamically created sounds
     * @param {string} id - Sound identifier
     * @param {Blob|string} source - Sound source (blob or url)
     */
    function addSound(id, source) {
        try {
            console.log(`Adding sound: ${id}`);
            
            // Create sound from blob or string
            let sound;
            if (source instanceof Blob) {
                const url = URL.createObjectURL(source);
                sound = new Audio(url);
            } else {
                sound = new Audio(source);
            }
            
            // Add to collection
            sound.volume = 0.6;
            sounds[id] = sound;
            
            console.log(`Added sound: ${id}`);
            
            // Return the sound object
            return sound;
        } catch (error) {
            console.error(`Error adding sound: ${id}`, error);
            return null;
        }
    }
    
    /**
     * Track user interaction to handle autoplay restrictions
     */
    function addUserInteractionTracker() {
        console.log('Adding user interaction tracker');
        
        // Most browsers require user interaction before playing audio
        const userInteractionEvents = ['click', 'touchstart', 'keydown'];
        
        const handleUserInteraction = () => {
            console.log('User interaction detected');
            
            // Remove event listeners after first interaction
            userInteractionEvents.forEach(event => {
                document.removeEventListener(event, handleUserInteraction);
            });
            
            // Play a silent sound to unlock audio
            unlockAudio();
            
            // User has interacted, flag it
            pendingUserInteraction = false;
        };
        
        // Add event listeners for user interaction
        userInteractionEvents.forEach(event => {
            document.addEventListener(event, handleUserInteraction);
        });
        
        pendingUserInteraction = true;
    }
    
    /**
     * Unlock audio on iOS/Safari by playing a silent sound
     */
    function unlockAudio() {
        console.log('Unlocking audio...');
        
        try {
            // Create short silent sound
            const silentSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYbLsNlmAAAAAAD/+xBkAA/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
            silentSound.volume = 0.001;
            silentSound.play().then(() => {
                console.log('Audio unlocked successfully');
            }).catch(err => {
                console.log('Audio unlock failed, will try again on next interaction:', err);
                pendingUserInteraction = true;
            });
        } catch (error) {
            console.error('Error unlocking audio:', error);
        }
    }
    
    /**
     * Play a sound effect if sound is enabled
     * @param {string} soundId - ID of the sound to play (from the sounds object)
     */
    function play(soundId) {
        // Early return if sounds are disabled
        if (!isSoundEnabled) return;
        
        console.log(`Attempting to play sound: ${soundId}`);
        
        // Wait for user interaction if needed
        if (pendingUserInteraction) {
            console.log('Waiting for user interaction before playing sounds');
            return;
        }
        
        // Check if sound exists
        if (!sounds[soundId]) {
            console.warn(`Sound ${soundId} not found, trying fallback...`);
            
            // Try alternative name mappings
            const mappings = {
                'flip': ['click', 'card-flip'],
                'match': ['correct'],
                'mismatch': ['incorrect', 'error'],
                'victory': ['complete', 'points']
            };
            
            // Look for a fallback sound
            let fallbackSound = null;
            
            if (mappings[soundId]) {
                for (const alt of mappings[soundId]) {
                    if (sounds[alt]) {
                        fallbackSound = sounds[alt];
                        console.log(`Using ${alt} as fallback for ${soundId}`);
                        break;
                    }
                }
            }
            
            if (!fallbackSound) {
                console.error(`No sound found for ${soundId} and no fallbacks available`);
                return;
            }
            
            // Use the fallback sound
            try {
                fallbackSound.currentTime = 0;
                fallbackSound.play().catch(err => {
                    console.log(`Fallback sound play error (${soundId}):`, err);
                });
            } catch (error) {
                console.error(`Error playing fallback sound for ${soundId}:`, error);
            }
            
            return;
        }
        
        // Try to play the requested sound
        try {
            // Clone the sound for overlapping plays
            const sound = sounds[soundId].cloneNode();
            
            // Ensure volume is set
            sound.volume = 0.6;
            
            // Play the sound
            sound.play().catch(err => {
                console.log(`Sound play error (${soundId}):`, err);
                
                // If autoplay was prevented, flag for next user interaction
                if (err.name === 'NotAllowedError') {
                    pendingUserInteraction = true;
                }
            });
            
            // Clean up cloned sound when done
            sound.onended = () => sound.remove();
        } catch (error) {
            console.error(`Error playing sound ${soundId}:`, error);
        }
    }
    
    /**
     * Toggle background music
     * @param {boolean} [forceState] - Optional state to force (true for on, false for off)
     * @return {boolean} New music state
     */
    function toggleMusic(forceState) {
        const newState = forceState !== undefined ? forceState : !isMusicPlaying;
        
        try {
            if (newState && isSoundEnabled) {
                backgroundMusic.play().catch(err => {
                    console.error('Music play error:', err);
                    
                    // If autoplay was prevented, flag for next user interaction
                    if (err.name === 'NotAllowedError') {
                        pendingUserInteraction = true;
                    }
                });
                console.log('Background music started');
            } else {
                backgroundMusic.pause();
                console.log('Background music paused');
            }
            
            isMusicPlaying = newState && isSoundEnabled;
            
            // Update music button if it exists
            updateMusicButton();
            
            return isMusicPlaying;
        } catch (error) {
            console.error('Error toggling music:', error);
            return false;
        }
    }

    /**
     * Update the music button icon to reflect current state
     */
    function updateMusicButton() {
        const musicBtn = document.getElementById('musicToggleBtn');
        if (!musicBtn) return;
        
        if (isMusicPlaying) {
            musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            musicBtn.style.color = '#4caf50';
        } else {
            musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            musicBtn.style.color = '#666';
        }
    }
    
    /**
     * Add a music toggle button to the UI
     */
    function addMusicToggle() {
        try {
            // Wait for DOM to be fully loaded
            if (document.readyState !== 'complete') {
                window.addEventListener('load', addMusicToggle);
                return;
            }
            
            // Find footer
            const footer = document.querySelector('.app-footer');
            if (!footer) return;
            
            // Create music toggle button with accessibility attributes
            const musicBtn = document.createElement('button');
            musicBtn.id = 'musicToggleBtn';
            musicBtn.className = 'music-toggle-btn';
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
            musicBtn.title = 'Toggle Background Music';
            musicBtn.setAttribute('aria-label', 'Toggle Background Music');
            
            // Add button styles
            musicBtn.style.cssText = `
                background: none;
                border: none;
                color: #666;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 10px;
                opacity: 0.7;
                transition: all 0.3s ease;
            `;
            
            // Add hover effects
            musicBtn.addEventListener('mouseover', () => {
                musicBtn.style.opacity = '1';
                musicBtn.style.transform = 'scale(1.1)';
            });
            
            musicBtn.addEventListener('mouseout', () => {
                musicBtn.style.opacity = '0.7';
                musicBtn.style.transform = 'scale(1)';
            });
            
            // Add click handler
            musicBtn.addEventListener('click', () => {
                toggleMusic();
                play('click');
            });
            
            // Add to footer
            footer.appendChild(musicBtn);
            
            // Set initial icon
            updateMusicButton();
            
        } catch (error) {
            console.error('Error adding music toggle:', error);
        }
    }
    
    /**
     * Add sound test panel for debugging
     */
    function addSoundTestPanel() {
        // Wait for DOM to be fully loaded
        if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
            window.addEventListener('load', addSoundTestPanel);
            return;
        }
        
        try {
            // Create sound test button in footer
            const footer = document.querySelector('.app-footer');
            if (!footer) return;
            
            const soundTestBtn = document.createElement('button');
            soundTestBtn.innerHTML = '<i class="fas fa-volume-up"></i> Test Sound';
            soundTestBtn.title = 'Test Sound System';
            soundTestBtn.setAttribute('aria-label', 'Test Sound System');
            soundTestBtn.style.cssText = `
                background: none;
                border: none;
                color: #666;
                font-size: 0.8rem;
                cursor: pointer;
                margin-left: 10px;
                padding: 2px 5px;
                opacity: 0.7;
                transition: all 0.3s ease;
                display: none; /* Hidden by default, show in debug mode */
            `;
            
            // Add click handler to show test panel
            soundTestBtn.addEventListener('click', () => {
                // Play test sound directly
                test();
                
                // Show test panel
                showSoundTestPanel();
            });
            
            // Add to footer
            footer.appendChild(soundTestBtn);
            
            // Show sound test button in development or if URL parameter is present
            if (window.location.href.includes('localhost') || 
                window.location.href.includes('debug=true') || 
                window.location.href.includes('test=true')) {
                soundTestBtn.style.display = 'inline-block';
            }
        } catch (error) {
            console.error('Error adding sound test panel button:', error);
        }
    }
    
    /**
     * Show sound test panel
     */
    function showSoundTestPanel() {
        // Create panel
        const panel = document.createElement('div');
        panel.className = 'sound-test-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            min-width: 300px;
            max-width: 80%;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        // Panel header
        panel.innerHTML = `
            <h3 style="margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                Sound Test Panel
            </h3>
            <div id="soundTestStatus" style="margin-bottom: 15px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
                Sound Enabled: <span style="font-weight: bold; color: ${isSoundEnabled ? 'green' : 'red'}">
                    ${isSoundEnabled ? 'YES' : 'NO'}
                </span><br>
                Waiting for User Interaction: <span style="font-weight: bold; color: ${pendingUserInteraction ? 'red' : 'green'}">
                    ${pendingUserInteraction ? 'YES' : 'NO'}
                </span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                <button id="testClickSound" class="sound-test-btn" title="Test Click Sound" aria-label="Test Click Sound">Test Click</button>
                <button id="testCorrectSound" class="sound-test-btn" title="Test Correct Sound" aria-label="Test Correct Sound">Test Correct</button>
                <button id="testIncorrectSound" class="sound-test-btn" title="Test Incorrect Sound" aria-label="Test Incorrect Sound">Test Incorrect</button>
                <button id="testVictorySound" class="sound-test-btn" title="Test Victory Sound" aria-label="Test Victory Sound">Test Victory</button>
            </div>
            <div style="text-align: right;">
                <button id="closeSoundTest" style="padding: 8px 15px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;" title="Close Sound Test" aria-label="Close Sound Test">
                    Close
                </button>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(panel);
        
        // Add event listeners to buttons
        panel.querySelector('#testClickSound').addEventListener('click', () => play('click'));
        panel.querySelector('#testCorrectSound').addEventListener('click', () => play('correct'));
        panel.querySelector('#testIncorrectSound').addEventListener('click', () => play('incorrect'));
        panel.querySelector('#testVictorySound').addEventListener('click', () => play('victory'));
        
        // Close button
        panel.querySelector('#closeSoundTest').addEventListener('click', () => {
            panel.remove();
        });
    }

    /**
     * Test all sound functionality
     */
    function test() {
        console.log('Testing sound manager functionality');
        showSoundTestPanel();
        return true;
    }
    
    return {
        init,
        play,
        toggleMusic,
        addSound,
        test
    };
})();

SoundManager.init();