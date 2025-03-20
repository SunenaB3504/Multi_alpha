/**
 * Rewards system for Multiplication Adventure
 */

const Rewards = (function() {
    // Available rewards configuration
    const availableRewards = [
        {
            id: 'lollypop',
            name: 'Lollypop',
            description: 'A sweet treat for your hard work',
            icon: 'fa-candy-cane',
            cost: 500
        },
        {
            id: 'ice-cream',
            name: 'Ice Cream',
            description: 'A delicious ice cream cone',
            icon: 'fa-ice-cream',
            cost: 1000
        },
        {
            id: 'burger',
            name: 'Burger',
            description: 'A tasty burger of your choice',
            icon: 'fa-hamburger',
            cost: 2000
        },
        {
            id: 'fried-chicken',
            name: 'Fried Chicken',
            description: 'Crispy fried chicken meal',
            icon: 'fa-drumstick-bite',
            cost: 3000
        },
        {
            id: 'pizza',
            name: 'Pizza',
            description: 'Your favorite pizza flavor',
            icon: 'fa-pizza-slice',
            cost: 4000
        },
        {
            id: 'book',
            name: 'Book',
            description: 'A book of your choice',
            icon: 'fa-book',
            cost: 5000
        },
        {
            id: 'toy',
            name: 'Toy',
            description: 'A special toy of your choice',
            icon: 'fa-gamepad',
            cost: 10000
        }
    ];
    
    /**
     * Initialize rewards system
     */
    function init() {
        // Populate rewards grid
        updateRewardsDisplay();
        
        // Set up click handlers for rewards
        document.getElementById('rewardsGrid').addEventListener('click', (e) => {
            const rewardItem = e.target.closest('.reward-item');
            if (rewardItem && !rewardItem.classList.contains('locked')) {
                const rewardId = rewardItem.dataset.rewardId;
                claimReward(rewardId);
            }
        });
    }
    
    /**
     * Update the rewards display
     * @param {Number} currentPoints - User's current points
     */
    function updateRewardsDisplay(currentPoints) {
        const rewardsGrid = document.getElementById('rewardsGrid');
        const points = currentPoints || AppCore.getState().points;
        
        // Clear existing content
        rewardsGrid.innerHTML = '';
        
        // Add each reward
        availableRewards.forEach(reward => {
            const isLocked = points < reward.cost;
            
            const rewardElem = document.createElement('div');
            rewardElem.className = `reward-item ${isLocked ? 'locked' : ''}`;
            rewardElem.dataset.rewardId = reward.id;
            
            rewardElem.innerHTML = `
                <div class="reward-icon"><i class="fas ${reward.icon}"></i></div>
                <div class="reward-name">${reward.name}</div>
                <div class="reward-description">${reward.description}</div>
                <div class="reward-cost">${reward.cost} points</div>
                <div class="reward-status">${isLocked ? 'Locked' : 'Available'}</div>
            `;
            
            rewardsGrid.appendChild(rewardElem);
        });
    }
    
    /**
     * Claim a reward
     * @param {String} rewardId - ID of the reward to claim
     */
    function claimReward(rewardId) {
        // Find the reward
        const reward = availableRewards.find(r => r.id === rewardId);
        if (!reward) return;
        
        // Check if user has enough points
        const userState = AppCore.getState();
        if (userState.points < reward.cost) {
            alert('Not enough points to claim this reward!');
            return;
        }
        
        // Show confirmation dialog
        if (confirm(`Redeem ${reward.name} for ${reward.cost} points?`)) {
            // Process the reward
            processReward(reward);
            
            // Update points and save
            const newPoints = userState.points - reward.cost;
            userState.points = newPoints;
            AppCore.saveUserData();
            
            // Update UI
            UI.updatePoints(newPoints);
            updateRewardsDisplay(newPoints);
            
            // Show success message
            showRewardConfirmation(reward);
        }
    }
    
    /**
     * Process a claimed reward
     * @param {Object} reward - The reward object
     */
    function processReward(reward) {
        // Add reward to user's collection
        const userState = AppCore.getState();
        userState.rewards.push({
            id: reward.id,
            name: reward.name,
            claimedAt: new Date().toISOString()
        });
        
        // Handle different reward types
        switch (reward.id) {
            case 'extra-time':
                // Implementation for extra time reward
                break;
            case 'hint-pass':
                // Implementation for hint pass
                break;
            case 'skip-pass':
                // Implementation for skip pass
                break;
            // Add more cases as needed
        }
        
        console.log(`Reward claimed: ${reward.name}`);
    }
    
    /**
     * Show reward confirmation screen
     * @param {Object} reward - The reward object
     */
    function showRewardConfirmation(reward) {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'reward-modal';
        modal.innerHTML = `
            <div class="reward-modal-content">
                <h2>Reward Claimed!</h2>
                <div class="reward-icon"><i class="fas ${reward.icon} fa-3x"></i></div>
                <h3>${reward.name}</h3>
                <p>${reward.description}</p>
                <p class="reward-confirmation-text">Show this to your parent or teacher!</p>
                <button class="btn-primary">Close</button>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(modal);
        
        // Add animation class
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Remove when button clicked
        modal.querySelector('button').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    }
    
    // Public API
    return {
        init,
        updateRewardsDisplay,
        claimReward
    };
})();

// Initialize rewards when document is ready
document.addEventListener('DOMContentLoaded', function() {
    Rewards.init();
});
