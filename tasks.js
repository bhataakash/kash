import { CONFIG } from './config.js';
import { TaskActionHandler } from './tasks-handler.js';

export class TaskManager {
    constructor(walletManager, referralManager) {
        this.walletManager = walletManager;
        this.referralManager = referralManager;
        this.actionHandler = new TaskActionHandler(this);
        this.lastTaskUpdate = localStorage.getItem('lastTaskUpdate');
        
        // Initialize tasks
        this.initializeTasks();
    }

    initializeTasks() {
        const today = new Date().toDateString();
        const isFirstVisit = !localStorage.getItem('firstVisit');
        
        if (isFirstVisit) {
            // First visit - mark it
            localStorage.setItem('firstVisit', 'true');
            this.lastTaskUpdate = today;
            localStorage.setItem('lastTaskUpdate', today);
            
            // Show initial tasks
            this.tasks = this.getInitialTasks();
        } else if (this.lastTaskUpdate !== today) {
            // New day - update tasks
            this.tasks = this.getNewDailyTasks();
            this.lastTaskUpdate = today;
            localStorage.setItem('lastTaskUpdate', today);
        } else {
            // Load saved tasks for today
            this.tasks = JSON.parse(localStorage.getItem('currentTasks') || '[]');
            if (!this.tasks.length) {
                this.tasks = this.getNewDailyTasks();
            }
        }

        // Save current tasks
        localStorage.setItem('currentTasks', JSON.stringify(this.tasks));
    }

    getInitialTasks() {
        return [
            {
                id: 'daily_login',
                title: 'Daily Login',
                reward: 1,
                description: 'Login daily to earn rewards',
                isCompleted: this.checkDailyLoginStatus(),
                icon: 'fas fa-sign-in-alt',
                type: 'daily'
            },
            {
                id: 'youtube_sub',
                title: 'Subscribe on YouTube',
                reward: 2,
                description: 'Subscribe to our YouTube channel',
                isCompleted: false,
                icon: 'fab fa-youtube',
                type: 'onetime'
            },
            {
                id: 'facebook_follow',
                title: 'Follow on Facebook',
                reward: 2,
                description: 'Follow us on Facebook',
                isCompleted: false,
                icon: 'fab fa-facebook',
                type: 'onetime'
            }
        ];
    }

    getNewDailyTasks() {
        // Always include daily login
        const tasks = [{
            id: 'daily_login',
            title: 'Daily Login',
            reward: 1,
            description: 'Login daily to earn rewards',
            isCompleted: this.checkDailyLoginStatus(),
            icon: 'fas fa-sign-in-alt',
            type: 'daily'
        }];

        // Pool of possible tasks
        const taskPool = [
            {
                id: 'youtube_sub',
                title: 'Subscribe on YouTube',
                reward: 2,
                description: 'Subscribe to our YouTube channel',
                icon: 'fab fa-youtube',
                type: 'onetime'
            },
            {
                id: 'facebook_follow',
                title: 'Follow on Facebook',
                reward: 2,
                description: 'Follow us on Facebook',
                icon: 'fab fa-facebook',
                type: 'onetime'
            },
            {
                id: 'instagram_follow',
                title: 'Follow on Instagram',
                reward: 2,
                description: 'Follow us on Instagram',
                icon: 'fab fa-instagram',
                type: 'onetime'
            },
            {
                id: 'share_app',
                title: 'Share App',
                reward: 3,
                description: 'Share BUZZFlix with friends',
                icon: 'fas fa-share-alt',
                type: 'daily'
            }
        ];

        // Filter out completed one-time tasks
        const completedTasks = new Set(JSON.parse(localStorage.getItem('completedTasks') || '[]'));
        const availableTasks = taskPool.filter(task => 
            task.type === 'daily' || !completedTasks.has(task.id)
        );

        // Randomly select 2 more tasks
        for(let i = 0; i < 2 && availableTasks.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableTasks.length);
            const selectedTask = availableTasks.splice(randomIndex, 1)[0];
            tasks.push({
                ...selectedTask,
                isCompleted: false
            });
        }

        return tasks;
    }

    checkDailyLoginStatus() {
        const lastLogin = localStorage.getItem('lastLoginDate');
        if (!lastLogin) return false;
        const today = new Date().toDateString();
        return lastLogin === today;
    }

    async completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || task.isCompleted) return false;

        let success = false;
        switch (taskId) {
            case 'daily_login':
                localStorage.setItem('lastLoginDate', new Date().toDateString());
                success = true;
                break;
            case 'youtube_sub':
                success = await this.actionHandler.handleYouTubeTask();
                break;
            case 'facebook_follow':
                success = await this.actionHandler.handleFacebookTask();
                break;
            case 'instagram_follow':
                success = await this.actionHandler.handleInstagramTask();
                break;
            case 'share_app':
                success = await this.actionHandler.handleShareTask();
                break;
            case 'profile_complete':
                success = await this.actionHandler.handleProfileTask();
                break;
        }

        if (success) {
            task.isCompleted = true;
            this.walletManager.addBalance(task.reward);
            
            // For one-time tasks, add to completed list
            if (task.type === 'onetime') {
                const completedTasks = new Set(JSON.parse(localStorage.getItem('completedTasks') || '[]'));
                completedTasks.add(taskId);
                localStorage.setItem('completedTasks', JSON.stringify([...completedTasks]));
            }
            
            // Update current tasks in storage
            localStorage.setItem('currentTasks', JSON.stringify(this.tasks));
            return true;
        }
        return false;
    }
}