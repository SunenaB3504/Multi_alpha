/**
 * PWA Installation Handler
 * Manages the "Add to Home Screen" experience for Android tablets
 */

const PWAInstall = (function() {
    let deferredPrompt;
    let installButton;
    
    /**
     * Initialize the PWA install module
     */
    function init() {
        console.log('Initializing PWA Install module');
        
        // Create an install button
        createInstallButton();
        
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt event fired');
            
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            
            // Stash the event so it can be triggered later
            deferredPrompt = e;
            
            // Show the install button
            showInstallButton();
        });
        
        // Listen for app installed event
        window.addEventListener('appinstalled', (e) => {
            console.log('App installed successfully');
            
            // Hide the install button
            hideInstallButton();
            
            // Show confirmation to user
            showToast('Multiplication Adventure was installed successfully!');
            
            // Clear the deferredPrompt
            deferredPrompt = null;
            
            // Log the installation in analytics
            if (window.gtag) {
                gtag('event', 'pwa_install', {
                    'event_category': 'PWA',
                    'event_label': 'App Installed'
                });
            }
        });
        
        // Check if app is in standalone mode (already installed)
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            console.log('Application is running in standalone mode (installed)');
        }
    }
    
    /**
     * Create the install button
     */
    function createInstallButton() {
        // Check if we already created it
        installButton = document.getElementById('pwaInstallBtn');
        if (installButton) return;
        
        // Create the button
        installButton = document.createElement('button');
        installButton.id = 'pwaInstallBtn';
        installButton.className = 'pwa-install-btn';
        installButton.innerHTML = '<i class="fas fa-download"></i> Add to Home Screen';
        installButton.title = 'Install app on your device';
        installButton.setAttribute('aria-label', 'Install app on your device');
        
        // Style the button
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4285f4;
            color: white;
            border: none;
            border-radius: 50px;
            padding: 10px 16px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: none;
            z-index: 1000;
            font-family: 'Poppins', sans-serif;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        // Add hover effect
        installButton.addEventListener('mouseover', () => {
            installButton.style.backgroundColor = '#3367d6';
            installButton.style.transform = 'translateX(-50%) scale(1.05)';
        });
        
        installButton.addEventListener('mouseout', () => {
            installButton.style.backgroundColor = '#4285f4';
            installButton.style.transform = 'translateX(-50%)';
        });
        
        // Add click handler
        installButton.addEventListener('click', showInstallPrompt);
        
        // Add to body when DOM is ready
        if (document.body) {
            document.body.appendChild(installButton);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(installButton);
            });
        }
    }
    
    /**
     * Show the install button
     */
    function showInstallButton() {
        if (!installButton) createInstallButton();
        
        // Only show if not in standalone mode
        if (!window.matchMedia('(display-mode: standalone)').matches && 
            window.navigator.standalone !== true) {
            installButton.style.display = 'flex';
            
            // Animate in
            setTimeout(() => {
                installButton.style.transform = 'translateX(-50%) scale(1)';
                installButton.style.opacity = '1';
            }, 100);
        }
    }
    
    /**
     * Hide the install button
     */
    function hideInstallButton() {
        if (installButton) {
            installButton.style.transform = 'translateX(-50%) scale(0.9)';
            installButton.style.opacity = '0';
            
            setTimeout(() => {
                installButton.style.display = 'none';
            }, 300);
        }
    }
    
    /**
     * Show the install prompt
     */
    async function showInstallPrompt() {
        if (!deferredPrompt) {
            console.log('No installation prompt available');
            showToast('Installation not available');
            return;
        }
        
        // Show the browser install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        
        // We no longer need the prompt
        deferredPrompt = null;
        
        // Hide the install button regardless of outcome
        hideInstallButton();
    }
    
    /**
     * Show a toast message
     * @param {string} message - Message to display
     * @param {number} [duration=3000] - Duration in milliseconds
     */
    function showToast(message, duration = 3000) {
        // Create a toast element if it doesn't exist
        let toast = document.getElementById('pwa-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'pwa-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                font-family: 'Poppins', sans-serif;
                font-size: 14px;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(toast);
        }
        
        // Set message
        toast.textContent = message;
        
        // Show toast
        toast.style.opacity = '1';
        
        // Hide after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }
    
    // Return public API
    return {
        init,
        showInstallPrompt
    };
})();

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', PWAInstall.init);

console.log('PWA Install module loaded');
