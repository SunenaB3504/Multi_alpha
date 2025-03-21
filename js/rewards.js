/**
 * Rewards module for Multiplication Adventure
 */

const Rewards = (function() {
    // Reward definitions - each with name, description, icon, and required points
    const availableRewards = [
        {
            id: 'lollypop',
            name: 'Lollipop',
            description: 'Earn a sweet lollipop treat',
            icon: 'candy-cane', 
            requiredPoints: 500,
            color: '#ff4081' // Pink color for candy
        },
        {
            id: 'ice_cream',
            name: 'Ice Cream',
            description: 'Cool off with an ice cream treat',
            icon: 'ice-cream',
            requiredPoints: 1000,
            color: '#64b5f6' // Light blue
        },
        {
            id: 'burger',
            name: 'Burger',
            description: 'Enjoy a tasty burger',
            icon: 'hamburger',
            requiredPoints: 2000,
            color: '#8d6e63' // Brown
        },
        {
            id: 'fried_chicken',
            name: 'Fried Chicken',
            description: 'Crunch into some fried chicken',
            icon: 'drumstick-bite',
            requiredPoints: 3000,
            color: '#ffb74d' // Orange/gold
        },
        {
            id: 'pizza',
            name: 'Pizza',
            description: 'Treat yourself to a pizza',
            icon: 'pizza-slice',
            requiredPoints: 4000,
            color: '#ff7043' // Red/orange
        },
        {
            id: 'book',
            name: 'Book',
            description: 'Pick out a new book to read',
            icon: 'book',
            requiredPoints: 5000,
            color: '#4caf50' // Green
        },
        {
            id: 'toy',
            name: 'Toy',
            description: 'Choose a special toy',
            icon: 'gamepad',
            requiredPoints: 10000,
            color: '#9c27b0' // Purple
        }
    ];
    
    /**
     * Initialize the rewards module
     */
    function init() {
        console.log('Initializing rewards module');
        
        // Update rewards based on current points
        updateRewardsBasedOnPoints();
        
        // Update the badges display
        updateBadgesDisplay();
    }
    
    /**
     * Check and update earned rewards based on current points
     */
    function updateRewardsBasedOnPoints() {
        console.log('Checking for new rewards based on points');
        
        if (!window.AppCore || !window.AppCore.getState) {
            console.error('AppCore not available for rewards check');
            return;
        }
        
        const state = AppCore.getState();
        const currentPoints = state.points;
        const userLevel = state.userLevel;
        const earnedRewards = state.rewards || [];
        
        let newRewardsEarned = false;
        
        // Check each reward to see if it should be unlocked
        availableRewards.forEach(reward => {
            const alreadyEarned = earnedRewards.some(r => r.id === reward.id);
            
            if (!alreadyEarned && currentPoints >= reward.requiredPoints) {
                // Check level requirement if applicable
                if (!reward.requireLevel || userLevel >= reward.requireLevel) {
                    console.log(`New reward earned: ${reward.name}`);
                    earnedRewards.push({
                        id: reward.id,
                        name: reward.name,
                        earnedAt: new Date().toISOString()
                    });
                    newRewardsEarned = true;
                    
                    // Show notification for new reward
                    showRewardNotification(reward);
                }
            }
        });
        
        // If new rewards were earned, update state and save
        if (newRewardsEarned) {
            state.rewards = earnedRewards;
            if (window.AppCore && window.AppCore.saveUserData) {
                AppCore.saveUserData();
            }
        }
        
        return earnedRewards;
    }
    
    /**
     * Show a notification for a new reward
     * @param {Object} reward - The earned reward
     */
    function showRewardNotification(reward) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'reward-notification';
        notification.innerHTML = `
            <div class="reward-notification-content">
                <i class="fas fa-${reward.icon}" style="color: ${reward.color};"></i>
                <h3>New Reward Unlocked!</h3>
                <p>${reward.name}</p>
                <p class="reward-description">${reward.description}</p>
                <button class="btn-primary">Awesome!</button>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Display with animation
        setTimeout(() => {
            notification.classList.add('active');
        }, 100);
        
        // Remove when button clicked
        notification.querySelector('button').addEventListener('click', () => {
            notification.classList.remove('active');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Play celebration sound if available
        if (window.Audio) {
            try {
                const celebrationSound = new Audio('sounds/reward.mp3');
                celebrationSound.volume = 0.5;
                celebrationSound.play().catch(e => console.log('Sound autoplay blocked by browser'));
            } catch (e) {
                console.log('Sound playback error:', e);
            }
        }
    }
    
    /**
     * Update the rewards center display
     * @param {Number} points - Current points total
     */
    function updateRewardsDisplay(points) {
        console.log('Updating rewards display with points:', points);
        
        // First check for any new rewards based on current points
        const earnedRewards = updateRewardsBasedOnPoints();
        
        // Update the badges display
        updateBadgesDisplay();
        
        // Get the rewards grid
        const rewardsGrid = document.getElementById('rewardsGrid');
        if (!rewardsGrid) {
            console.error('Rewards grid not found');
            return;
        }
        
        // Clear existing rewards
        rewardsGrid.innerHTML = '';
        
        // Get claimed rewards
        const state = AppCore.getState();
        const claimedRewards = state.claimedRewards || [];
        
        // Build rewards display
        availableRewards.forEach(reward => {
            const isEarned = earnedRewards.some(r => r.id === reward.id);
            const isClaimed = claimedRewards.some(r => r.id === reward.id);
            const currentPoints = state.points;
            const canClaim = currentPoints >= reward.requiredPoints;
            
            const rewardItem = document.createElement('div');
            rewardItem.className = `reward-item${isEarned ? ' earned' : ' locked'}${isClaimed ? ' claimed' : ''}`;
            
            rewardItem.innerHTML = `
                <div class="reward-icon">
                    <i class="fas fa-${reward.icon}" style="color: ${isEarned ? reward.color : '#bbbbbb'};"></i>
                </div>
                <div class="reward-name">${reward.name}</div>
                <div class="reward-cost">${reward.requiredPoints} points required</div>
                <div class="reward-status">
                    ${isClaimed ? 'Claimed!' : (isEarned ? 'Unlocked!' : 'Locked')}
                </div>
                ${isEarned && !isClaimed && canClaim ? 
                    `<button class="btn-claim">Claim Now</button>` : ''}
            `;
            
            rewardsGrid.appendChild(rewardItem);
            
            // Add click handler for earned rewards
            if (isEarned) {
                rewardItem.addEventListener('click', () => {
                    showRewardDetails(reward);
                });
                
                // Add specific handler for claim button
                const claimBtn = rewardItem.querySelector('.btn-claim');
                if (claimBtn) {
                    claimBtn.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent triggering the parent click
                        showRewardDetails(reward);
                    });
                }
            }
        });
    }
    
    /**
     * Update the badges display in the dashboard
     */
    function updateBadgesDisplay() {
        console.log('Updating badges display');
        
        const badgesDisplay = document.getElementById('badges');
        if (!badgesDisplay) {
            console.error('Badges display element not found');
            return;
        }
        
        // Get earned rewards from app state
        let earnedRewards = [];
        if (window.AppCore && window.AppCore.getState) {
            earnedRewards = AppCore.getState().rewards || [];
        }
        
        // Update the badges display
        if (earnedRewards.length === 0) {
            badgesDisplay.textContent = 'None';
            badgesDisplay.className = 'stat-value'; // Reset any custom classes
        } else {
            // Clear text content
            badgesDisplay.textContent = '';
            
            // Add class for icon display
            badgesDisplay.className = 'stat-value rewards-icons';
            
            // Display all earned rewards icons
            earnedRewards.forEach(reward => {
                // Find the full reward definition
                const rewardDef = availableRewards.find(r => r.id === reward.id);
                if (rewardDef) {
                    const icon = document.createElement('i');
                    icon.className = `fas fa-${rewardDef.icon}`;
                    icon.style.color = rewardDef.color;
                    icon.title = rewardDef.name;
                    
                    badgesDisplay.appendChild(icon);
                }
            });
        }
    }
    
    /**
     * Show details for an earned reward
     * @param {Object} reward - The reward to show details for
     */
    function showRewardDetails(reward) {
        // Find the full reward definition to get required points
        const rewardDefinition = availableRewards.find(r => r.id === reward.id) || reward;
        const requiredPoints = rewardDefinition.requiredPoints;
        
        // Check if the user has enough points
        const state = AppCore.getState();
        const currentPoints = state.points;
        const canClaim = currentPoints >= requiredPoints;
        
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'reward-modal';
        modal.innerHTML = `
            <div class="reward-modal-content">
                <i class="fas fa-${rewardDefinition.icon}" style="color: ${rewardDefinition.color}; font-size: 3rem;"></i>
                <h3>${rewardDefinition.name}</h3>
                <p>${rewardDefinition.description}</p>
                <p class="reward-points">Cost: ${requiredPoints} points</p>
                <div class="reward-buttons">
                    ${canClaim ? 
                        `<button class="btn-primary claim-btn">Claim Reward</button>` : 
                        `<button class="btn-primary claim-btn" disabled style="opacity: 0.5; cursor: not-allowed;">Not Enough Points</button>`
                    }
                    <button class="btn-secondary close-btn">Close</button>
                </div>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(modal);
        
        // Display with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 100);
        
        // Add claim handler
        const claimBtn = modal.querySelector('.claim-btn');
        if (claimBtn && canClaim) {
            claimBtn.addEventListener('click', () => {
                claimReward(rewardDefinition, modal);
            });
        }
        
        // Remove when close button clicked
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    }
    
    /**
     * Claim a reward and deduct points
     * @param {Object} reward - The reward to claim
     * @param {Element} modal - The modal element to update
     */
    function claimReward(reward, modal) {
        console.log(`Claiming reward: ${reward.name}, cost: ${reward.requiredPoints} points`);
        
        // Get current state
        const state = AppCore.getState();
        const currentPoints = state.points;
        
        // Verify user has enough points
        if (currentPoints < reward.requiredPoints) {
            console.error('Not enough points to claim reward');
            
            // Show error message
            const contentDiv = modal.querySelector('.reward-modal-content');
            contentDiv.innerHTML += `
                <p class="error-message" style="color: red; margin-top: 10px;">
                    You don't have enough points to claim this reward.
                </p>
            `;
            
            return;
        }
        
        // Add to claimed rewards if not already tracked
        if (!state.claimedRewards) {
            state.claimedRewards = [];
        }
        
        // Record this claim
        state.claimedRewards.push({
            id: reward.id,
            name: reward.name,
            points: reward.requiredPoints,
            claimedAt: new Date().toISOString()
        });
        
        // Deduct points
        const newPointsTotal = currentPoints - reward.requiredPoints;
        state.points = newPointsTotal;
        
        // Update UI
        if (window.UI && UI.updatePoints) {
            UI.updatePoints(newPointsTotal);
        }
        
        // Save the updated state
        if (AppCore.saveUserData) {
            AppCore.saveUserData();
        }
        
        // Update modal to show confirmation
        const modalContent = modal.querySelector('.reward-modal-content');
        modalContent.innerHTML = `
            <div class="confirmation-message">
                <i class="fas fa-check-circle" style="color: #4CAF50; font-size: 3rem;"></i>
                <h3>Reward Claimed!</h3>
                <p>You have successfully claimed the ${reward.name}.</p>
                <p>Your new points balance: <strong>${newPointsTotal}</strong></p>
                <p class="reward-claim-instructions">Show this screen to your parent or teacher to receive your reward.</p>
                <button class="btn-primary print-btn">
                    <i class="fas fa-print"></i> Print Confirmation
                </button>
                <button class="btn-secondary done-btn">Done</button>
            </div>
        `;
        
        // Add event listeners to new buttons
        const printBtn = modalContent.querySelector('.print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
        
        const doneBtn = modalContent.querySelector('.done-btn');
        if (doneBtn) {
            doneBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                    
                    // Refresh rewards display
                    updateRewardsDisplay(newPointsTotal);
                }, 300);
            });
        }
    }
    
    // Public API
    return {
        init,
        updateRewardsDisplay,
        updateBadgesDisplay,
        updateRewardsBasedOnPoints
    };
})();

// Initialize rewards module when document is ready
document.addEventListener('DOMContentLoaded', function() {
    Rewards.init();
    
    // Check for rewards when points change
    if (window.AppCore && window.AppCore.addPoints) {
        // Save the original addPoints function
        const originalAddPoints = AppCore.addPoints;
        
        // Replace with a new function that also updates rewards
        AppCore.addPoints = function(points) {
            // Call the original function
            const result = originalAddPoints(points);
            
            // Update rewards based on new points
            Rewards.updateRewardsBasedOnPoints();
            
            // Update badges display
            Rewards.updateBadgesDisplay();
            
            return result;
        };
    }
});

console.log('Rewards module loaded');
