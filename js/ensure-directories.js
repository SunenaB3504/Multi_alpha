/**
 * Script to ensure required directories exist
 */
(function() {
    try {
        if ('serviceWorker' in navigator) {
            // Fetch the icon URLs from the manifest to create directories if needed
            fetch('/manifest.json')
                .then(response => response.json())
                .then(manifest => {
                    if (manifest && manifest.icons) {
                        manifest.icons.forEach(icon => {
                            const iconPath = new URL(icon.src, window.location.origin).pathname;
                            const directory = iconPath.substring(0, iconPath.lastIndexOf('/'));
                            
                            console.log(`Ensuring directory exists: ${directory}`);
                            makeDirectoryRequest(directory);
                        });
                    }
                })
                .catch(error => console.error('Error fetching manifest:', error));
        }
    } catch (error) {
        console.error('Error in directory setup:', error);
    }
    
    // Helper function to request directory creation
    function makeDirectoryRequest(directory) {
        fetch(`/ensure-directory.php?dir=${encodeURIComponent(directory.substring(1))}`)
            .then(response => {
                if (response.ok) {
                    console.log(`Directory ${directory} is ready`);
                } else {
                    console.warn(`Could not ensure directory ${directory}`);
                }
            })
            .catch(() => {
                // Silently fail - the PHP endpoint might not exist
                console.log(`Directory check for ${directory} failed silently`);
            });
    }
})();
