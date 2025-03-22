// Updating the NotificationManager class with more notifications and names
export class NotificationManager {
    constructor() {
        this.notifications = [];
        this.notificationDisplay = null;
        this.bellIcon = null;
        this.notificationCount = 0;
        
        // Expanded list of user names
        this.users = [
            'Danish', 'Mohammad Kaif', 'Rahil', 'Aadil', 'Sara', 
            'Zainab', 'Nida', 'Arshad', 'Omar', 'Sana', 'Mehreen',
            'Yasir', 'Bilal', 'Asma', 'Fatima', 'Hassan', 'Imran',
            'Ayesha', 'Farhan', 'Maryam', 'Taha', 'Kamran', 'Lubna',
            'Nasir', 'Rabia', 'Saad', 'Uzma', 'Waseem', 'Yusra', 'Zain',
            'Aisha', 'Hamza', 'Noor', 'Usman', 'Zara', 'Ali', 'Sofia',
            'Ibrahim', 'Laiba', 'Ahmad', 'Dania', 'Faraz', 'Hina', 'Junaid'
        ];

        // Expanded notification templates with higher earnings
        this.templates = [
            {
                type: 'earning',
                messages: [
                    'USER_NAME just earned ₹AMOUNT from Advanced Tasks!',
                    'USER_NAME completed special project and earned ₹AMOUNT!',
                    'USER_NAME earned ₹AMOUNT from premium referrals!',
                    'USER_NAME received ₹AMOUNT bonus from course completion!',
                    'USER_NAME unlocked ₹AMOUNT achievement bonus!',
                    'USER_NAME earned ₹AMOUNT from premium membership!',
                    'USER_NAME received ₹AMOUNT from weekly challenge!',
                    'USER_NAME got ₹AMOUNT from streak bonus!'
                ]
            },
            {
                type: 'achievement',
                messages: [
                    'USER_NAME unlocked Elite Partner status!',
                    'USER_NAME reached 50 successful referrals!',
                    'USER_NAME achieved Diamond membership!',
                    'USER_NAME completed all premium courses!',
                    'USER_NAME earned Master Influencer badge!',
                    'USER_NAME reached Top Earner status!',
                    'USER_NAME unlocked VIP rewards tier!',
                    'USER_NAME achieved Platinum membership!'
                ]
            },
            {
                type: 'milestone',
                messages: [
                    'USER_NAME reached ₹3000 in earnings!',
                    'USER_NAME completed 90 days streak!',
                    'USER_NAME invited 100 friends successfully!',
                    'USER_NAME achieved Platinum member status!',
                    'USER_NAME earned Elite Performer badge!',
                    'USER_NAME reached ₹2500 milestone!',
                    'USER_NAME achieved ₹2000 weekly target!',
                    'USER_NAME hit ₹1500 daily goal!'
                ]
            }
        ];
    }

    initialize() {
        this.createNotificationElements();
        this.startEnhancedNotificationCycle();
    }

    createNotificationElements() {
        // Create bell icon
        this.bellIcon = document.createElement('div');
        this.bellIcon.className = 'notification-bell';
        this.bellIcon.innerHTML = `
            <i class="fas fa-bell"></i>
            <span class="notification-count">0</span>
        `;
        
        // Create notification display
        this.notificationDisplay = document.createElement('div');
        this.notificationDisplay.className = 'notification-display';
        
        // Add to document - update target element
        document.querySelector('.logo').appendChild(this.bellIcon);
        document.body.appendChild(this.notificationDisplay);
        
        // Add click listener to bell
        this.bellIcon.addEventListener('click', () => this.showStoredNotifications());
    }

    generateRandomAmount() {
        // Updated amounts between 500-3000
        const amounts = [500, 750, 1000, 1200, 1500, 1800, 2000, 2200, 2500, 2800, 3000];
        return amounts[Math.floor(Math.random() * amounts.length)];
    }

    getRandomUser() {
        return this.users[Math.floor(Math.random() * this.users.length)];
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification-item';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        
        this.notificationDisplay.appendChild(notification);
        this.updateNotificationCount(1);
        
        // Store notification
        this.notifications.push({
            message,
            timestamp: new Date()
        });
        
        // Remove after animation
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode === this.notificationDisplay) {
                    this.notificationDisplay.removeChild(notification);
                }
            }, 500);
        }, 5000);
        
        // Remove from storage after 10 minutes
        setTimeout(() => {
            this.notifications = this.notifications.filter(n => n.message !== message);
            this.updateNotificationCount(-1);
        }, 600000);
    }

    updateNotificationCount(change) {
        this.notificationCount += change;
        const countElement = this.bellIcon.querySelector('.notification-count');
        countElement.textContent = this.notificationCount;
        countElement.style.display = this.notificationCount > 0 ? 'block' : 'none';
    }

    showStoredNotifications() {
        const modal = document.createElement('div');
        modal.className = 'notifications-modal';
        
        const content = document.createElement('div');
        content.className = 'notifications-content';
        
        content.innerHTML = `
            <h3>Notifications</h3>
            <div class="notifications-list">
                ${this.notifications.map(n => `
                    <div class="notification-item">
                        <i class="fas fa-info-circle"></i>
                        <span>${n.message}</span>
                        <small>${this.timeAgo(n.timestamp)}</small>
                    </div>
                `).join('')}
            </div>
            <button class="close-notifications">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        modal.querySelector('.close-notifications').addEventListener('click', () => {
            modal.remove();
        });
    }

    timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    }

    startEnhancedNotificationCycle() {
        const generateDelay = () => Math.random() * (3600000/20 - 120000) + 120000; // 20 notifications per hour
        
        const showNextNotification = () => {
            if (this.notifications.length < 30) { // Increased storage limit
                const message = this.generateEnhancedNotification();
                this.showNotification(message);
                
                setTimeout(showNextNotification, generateDelay());
            }
        };
        
        setTimeout(showNextNotification, 5000);
    }

    generateEnhancedNotification() {
        const types = ['earning', 'achievement', 'milestone'];
        const type = types[Math.floor(Math.random() * types.length)];
        const template = this.templates.find(t => t.type === type);
        
        if (type === 'earning') {
            const user = this.getRandomUser();
            const amount = this.generateRandomAmount();
            const message = template.messages[Math.floor(Math.random() * template.messages.length)];
            return message
                .replace('USER_NAME', user)
                .replace('AMOUNT', amount.toFixed(2));
        } else {
            const user = this.getRandomUser();
            const message = template.messages[Math.floor(Math.random() * template.messages.length)];
            return message.replace('USER_NAME', user);
        }
    }
}