// Separate file for notification functionality 
export class NotificationManager {
    constructor() {
        this.notifications = [];
        this.notificationDisplay = null;
        this.bellIcon = null;
        this.notificationCount = 0;
        
        // Sample user names for notifications
        this.users = [
            'Danish', 'Mohammad Kaif', 'Rahil', 'Aadil', 'Sara', 
            'Zainab', 'Nida', 'Arshad', 'Omar', 'Sana', 'Mehreen',
            'Yasir', 'Bilal', 'Asma', 'Fatima'
        ];

        // Sample notification templates
        this.templates = [
            {
                type: 'course',
                messages: [
                    'New Course Launch: Advanced Digital Marketing 2025',
                    'Just Added: Mastering AI Programming',
                    'New Course: E-commerce Success Blueprint',
                    'Fresh Content: Social Media Mastery Course'
                ]
            },
            {
                type: 'update',
                messages: [
                    'Website Update: New Features Added',
                    'Platform Enhancement: Improved Course Navigation',
                    'System Update: Better Performance',
                    'New Feature: Enhanced Learning Dashboard'
                ]
            },
            {
                type: 'earning',
                template: 'USER_NAME just earned ₹AMOUNT from BUZZFlix!'
            }
        ];
    }

    initialize() {
        this.createNotificationElements();
        this.startNotificationCycle();
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
        return Math.floor(Math.random() * (942 - 300 + 1)) + 300;
    }

    getRandomUser() {
        return this.users[Math.floor(Math.random() * this.users.length)];
    }

    generateNotification() {
        const types = ['course', 'update', 'earning'];
        const type = types[Math.floor(Math.random() * types.length)];
        const template = this.templates.find(t => t.type === type);
        
        if (type === 'earning') {
            const user = this.getRandomUser();
            const amount = this.generateRandomAmount();
            return template.template
                .replace('USER_NAME', user)
                .replace('AMOUNT', amount.toFixed(2));
        } else {
            const messages = template.messages;
            return messages[Math.floor(Math.random() * messages.length)];
        }
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

    startNotificationCycle() {
        // Generate random delays between 10 minutes and 1 hour
        const generateDelay = () => Math.random() * (3600000 - 600000) + 600000;
        
        const showNextNotification = () => {
            if (this.notifications.length < 10) { // Limit to 10 stored notifications
                const message = this.generateNotification();
                this.showNotification(message);
                
                // Schedule next notification
                setTimeout(showNextNotification, generateDelay());
            }
        };
        
        // Start the cycle
        setTimeout(showNextNotification, 5000); // First notification after 5 seconds
    }
}