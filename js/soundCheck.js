/**
 * Sound Check Utility for Multiplication Adventure
 * Helps diagnose and fix sound playback issues
 */
(function() {
    console.log('Sound Check Utility loaded');
    
    // List of expected sound files
    const expectedSounds = [
        'sounds/click.mp3',
        'sounds/complete.mp3',
        'sounds/correct.mp3',
        'sounds/error.mp3',
        'sounds/incorrect.mp3',
        'sounds/points.mp3',
        'sounds/card-flip.mp3',
        'sounds/match.mp3',
        'sounds/mismatch.mp3',
        'sounds/victory.mp3',
        'sounds/background.mp3'
    ];
    
    // Check if files exist when utility loads
    checkSoundFiles();
    
    /**
     * Check if sound files exist
     */
    function checkSoundFiles() {
        console.log('Checking sound files...');
        
        // Array to track missing files
        const missing = [];
        let allFilesExist = true;
        let checkedCount = 0;
        
        // Check each file
        expectedSounds.forEach(soundFile => {
            fetch(soundFile, { method: 'HEAD' })
                .then(response => {
                    checkedCount++;
                    
                    if (!response.ok) {
                        console.error(`❌ Sound file missing: ${soundFile}`);
                        missing.push(soundFile);
                        allFilesExist = false;
                    } else {
                        console.log(`✓ Sound file exists: ${soundFile}`);
                    }
                    
                    // When all checks complete
                    if (checkedCount === expectedSounds.length) {
                        reportSoundFileStatus(allFilesExist, missing);
                    }
                })
                .catch(error => {
                    checkedCount++;
                    console.error(`❌ Error checking sound file ${soundFile}:`, error);
                    missing.push(soundFile);
                    allFilesExist = false;
                    
                    // When all checks complete
                    if (checkedCount === expectedSounds.length) {
                        reportSoundFileStatus(allFilesExist, missing);
                    }
                });
        });
    }
    
    /**
     * Report status of sound files
     * @param {boolean} allExist - Whether all files exist
     * @param {Array} missing - Array of missing files
     */
    function reportSoundFileStatus(allExist, missing) {
        if (allExist) {
            console.log('✅ All sound files exist');
        } else {
            console.error(`❌ Missing ${missing.length} sound files:`, missing);
            
            // Create sounds directory structure if it doesn't exist
            createSoundsDirectory();
            
            // Show missing files alert
            showMissingFilesAlert(missing);
        }
    }
    
    /**
     * Create sounds directory if it doesn't exist
     */
    function createSoundsDirectory() {
        console.log('Checking for sounds directory...');
        
        fetch('sounds/', { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    console.error('❌ Sounds directory does not exist!');
                } else {
                    console.log('✓ Sounds directory exists');
                }
            })
            .catch(() => {
                console.error('❌ Sounds directory does not exist or is inaccessible!');
            });
    }
    
    /**
     * Show alert about missing sound files
     * @param {Array} missing - List of missing files
     */
    function showMissingFilesAlert(missing) {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => showMissingFilesAlert(missing));
            return;
        }
        
        // Create alert
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: #f44336;
            color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: sans-serif;
            max-width: 300px;
        `;
        
        alert.innerHTML = `
            <h4 style="margin-top: 0; margin-bottom: 10px;">Missing Sound Files</h4>
            <p>Some sound files are missing. Please check the console for details.</p>
            <button id="dismissSoundAlert" style="padding: 5px 10px; cursor: pointer;">Dismiss</button>
            <button id="downloadSoundPack" style="padding: 5px 10px; cursor: pointer; margin-left: 5px; background-color: #4CAF50; color: white; border: none; border-radius: 3px;">Fix Sounds</button>
        `;
        
        // Add to document
        document.body.appendChild(alert);
        
        // Add dismiss handler
        document.getElementById('dismissSoundAlert').addEventListener('click', () => {
            alert.remove();
        });
        
        // Add download handler
        document.getElementById('downloadSoundPack').addEventListener('click', () => {
            createFallbackSounds();
            alert.remove();
        });
    }
    
    /**
     * Create fallback sounds in the browser
     * This generates base64 encoded sounds using the Web Audio API
     */
    function createFallbackSounds() {
        console.log('Creating fallback sounds...');
        
        // Check if Web Audio API is supported
        if (!window.AudioContext && !window.webkitAudioContext) {
            console.error('Web Audio API not supported');
            alert('Your browser does not support Web Audio API');
            return;
        }
        
        // Create audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        
        // Generate sounds
        generateAndSaveSounds(audioCtx);
    }
    
    /**
     * Generate and save basic sounds
     * @param {AudioContext} audioCtx - Audio context
     */
    function generateAndSaveSounds(audioCtx) {
        try {
            // Create "click" sound (short beep)
            createBeepSound(audioCtx, 200, 180, 880)
                .then(blob => {
                    window.SoundManager.addSound('click', blob);
                    window.SoundManager.addSound('flip', blob);
                })
                .catch(err => console.error('Error creating click sound:', err));
            
            // Create "correct" sound (happy beep)
            createBeepSound(audioCtx, 300, 250, 1760)
                .then(blob => {
                    window.SoundManager.addSound('correct', blob);
                    window.SoundManager.addSound('match', blob);
                })
                .catch(err => console.error('Error creating correct sound:', err));
            
            // Create "incorrect" sound (sad beep)
            createBeepSound(audioCtx, 300, 300, 220)
                .then(blob => {
                    window.SoundManager.addSound('incorrect', blob);
                    window.SoundManager.addSound('mismatch', blob);
                    window.SoundManager.addSound('error', blob);
                })
                .catch(err => console.error('Error creating incorrect sound:', err));
                
            // Create "complete" sound (victory tune)
            createVictorySound(audioCtx)
                .then(blob => {
                    window.SoundManager.addSound('complete', blob);
                    window.SoundManager.addSound('victory', blob);
                })
                .catch(err => console.error('Error creating victory sound:', err));
            
            // Alert user
            alert('Fallback sounds created! Try playing the game now.');
        } catch (error) {
            console.error('Error generating fallback sounds:', error);
        }
    }
    
    /**
     * Create a simple beep sound
     * @param {AudioContext} audioCtx - Audio context
     * @param {number} duration - Duration in ms
     * @param {number} fadeOut - Fade out duration in ms
     * @param {number} frequency - Frequency in Hz
     * @return {Promise<Blob>} Sound as blob
     */
    function createBeepSound(audioCtx, duration = 200, fadeOut = 50, frequency = 440) {
        return new Promise((resolve, reject) => {
            try {
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.value = frequency;
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                
                const startTime = audioCtx.currentTime;
                const stopTime = startTime + duration / 1000;
                
                oscillator.start(startTime);
                oscillator.stop(stopTime);
                
                // Fade out
                gainNode.gain.setValueAtTime(0.5, startTime);
                gainNode.gain.setValueAtTime(0.5, stopTime - fadeOut / 1000);
                gainNode.gain.linearRampToValueAtTime(0, stopTime);
                
                // Record the sound
                const dest = audioCtx.createMediaStreamDestination();
                gainNode.connect(dest);
                
                const recorder = new MediaRecorder(dest.stream);
                const chunks = [];
                
                recorder.ondataavailable = e => chunks.push(e.data);
                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/wav' });
                    resolve(blob);
                };
                
                recorder.start();
                setTimeout(() => {
                    recorder.stop();
                }, duration + 100);
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * Create a victory sound (simple ascending notes)
     * @param {AudioContext} audioCtx - Audio context
     * @return {Promise<Blob>} Sound as blob
     */
    function createVictorySound(audioCtx) {
        return new Promise((resolve, reject) => {
            try {
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                
                oscillator.type = 'sine';
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                
                const startTime = audioCtx.currentTime;
                
                // Create ascending notes
                oscillator.frequency.setValueAtTime(440, startTime);
                oscillator.frequency.setValueAtTime(523.25, startTime + 0.2);
                oscillator.frequency.setValueAtTime(659.25, startTime + 0.4);
                oscillator.frequency.setValueAtTime(880, startTime + 0.6);
                
                gainNode.gain.setValueAtTime(0.5, startTime);
                gainNode.gain.setValueAtTime(0.5, startTime + 0.7);
                gainNode.gain.linearRampToValueAtTime(0, startTime + 0.8);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.8);
                
                // Record the sound
                const dest = audioCtx.createMediaStreamDestination();
                gainNode.connect(dest);
                
                const recorder = new MediaRecorder(dest.stream);
                const chunks = [];
                
                recorder.ondataavailable = e => chunks.push(e.data);
                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/wav' });
                    resolve(blob);
                };
                
                recorder.start();
                setTimeout(() => {
                    recorder.stop();
                }, 1000);
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // Add global test function
    window.testSounds = function() {
        console.log('Testing sounds...');
        checkSoundFiles();
        
        // Play a test sound if SoundManager exists
        if (window.SoundManager) {
            window.SoundManager.test();
        } else {
            console.error('SoundManager not found!');
            alert('SoundManager not found! Sound may not work.');
        }
    };
})();
