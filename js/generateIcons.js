/**
 * Generate placeholder PWA icons if they don't exist
 */
(function() {
    console.log('Icon generator utility loaded');
    
    // Check if icons exist
    const icons = [
        'images/icon-512.png',
        'images/icon-192.png',
        'images/maskable-icon.png'
    ];
    
    // Check for icon directory
    fetch('images/')
        .then(response => {
            if (!response.ok) {
                console.warn('Images directory not found');
                // Create an alert to inform user
                createMissingIconsAlert('Images directory not found.');
            } else {
                console.log('Images directory exists, checking for icons');
                checkForIcons();
            }
        })
        .catch(() => {
            console.warn('Could not access images directory');
            createMissingIconsAlert('Could not access images directory.');
        });
    
    /**
     * Check if required icons exist
     */
    function checkForIcons() {
        Promise.all(icons.map(icon => 
            fetch(icon, { method: 'HEAD' })
                .then(response => ({ icon, exists: response.ok }))
                .catch(() => ({ icon, exists: false }))
        )).then(results => {
            const missing = results.filter(result => !result.exists);
            
            if (missing.length > 0) {
                console.warn('Missing icons:', missing.map(m => m.icon).join(', '));
                createMissingIconsAlert(`Missing icons: ${missing.map(m => m.icon.split('/').pop()).join(', ')}`);
            } else {
                console.log('All required icons exist');
            }
        });
    }
    
    /**
     * Create an alert to inform the user about missing icons
     */
    function createMissingIconsAlert(message) {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => createMissingIconsAlert(message));
            return;
        }
        
        // Create alert
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #ff9800;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-family: sans-serif;
            max-width: 300px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        alert.innerHTML = `
            <h4 style="margin-top: 0; margin-bottom: 5px;">Missing PWA Icons</h4>
            <p style="margin: 0 0 10px 0;">
                ${message} Create the icons for the best PWA experience.
            </p>
            <div style="display: flex; justify-content: space-between;">
                <button id="generatePlaceholderIcons" style="padding: 5px 10px; background: #4CAF50; border: none; color: white; cursor: pointer; border-radius: 3px;">Generate Icons</button>
                <button id="dismissIconsAlert" style="padding: 5px 10px; background: transparent; border: 1px solid white; color: white; cursor: pointer; border-radius: 3px; margin-left: 10px;">Dismiss</button>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(alert);
        
        // Add button handlers
        document.getElementById('dismissIconsAlert').addEventListener('click', () => {
            alert.remove();
        });
        
        document.getElementById('generatePlaceholderIcons').addEventListener('click', () => {
            alert.remove();
            generatePlaceholderIcons();
        });
    }
    
    /**
     * Generate placeholder icons using canvas
     */
    function generatePlaceholderIcons() {
        console.log('Generating placeholder icons...');
        
        // We can't actually create files from the browser
        // So we'll show instructions on how to create them
        
        const instructionAlert = document.createElement('div');
        instructionAlert.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            color: #333;
            padding: 20px;
            border-radius: 10px;
            font-family: sans-serif;
            max-width: 90%;
            width: 500px;
            z-index: 10001;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        
        instructionAlert.innerHTML = `
            <h2 style="margin-top: 0; color: #4285f4;">PWA Icon Instructions</h2>
            <p>Create these icons for PWA compatibility:</p>
            <ul>
                <li><strong>icon-192.png</strong>: 192×192 pixels</li>
                <li><strong>icon-512.png</strong>: 512×512 pixels</li>
                <li><strong>maskable-icon.png</strong>: 512×512 pixels with content within 80% of center</li>
            </ul>
            <p>
                For now, here's a temporary visual icon you can download 
                and use to create your icons:
            </p>
            <div id="tempIconContainer" style="margin: 15px 0; text-align: center;"></div>
            <div style="text-align: right;">
                <button id="closeIconInstructions" style="padding: 8px 15px; background-color: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(instructionAlert);
        
        // Create a temporary icon
        const tempIconContainer = document.getElementById('tempIconContainer');
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        // Draw icon background
        ctx.fillStyle = '#4285f4';
        ctx.fillRect(0, 0, 200, 200);
        
        // Draw calculator icon
        ctx.fillStyle = 'white';
        ctx.fillRect(40, 40, 120, 40);
        ctx.fillRect(40, 90, 120, 70);
        
        // Draw number buttons
        ctx.fillStyle = '#4285f4';
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                ctx.fillRect(50 + x * 30, 100 + y * 20, 20, 15);
            }
        }
        
        // "x" symbol for multiplication
        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = '#4285f4';
        ctx.fillText('×', 140, 70);
        
        tempIconContainer.appendChild(canvas);
        
        // Add download links
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download Example Icon';
        downloadBtn.style.cssText = `
            padding: 8px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        `;
        
        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'temp-icon.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
        
        tempIconContainer.appendChild(downloadBtn);
        
        // Close button handler
        document.getElementById('closeIconInstructions').addEventListener('click', () => {
            instructionAlert.remove();
        });
    }
})();
