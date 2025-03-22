import { createProfileModal } from './profile-ui.js';

export class TaskActionHandler {
    constructor(taskManager) {
        this.taskManager = taskManager;
    }

    async handleProfileTask() {
        // Show profile modal  
        const profileModal = createProfileModal();
        document.body.appendChild(profileModal);

        return new Promise((resolve) => {
            profileModal.querySelector('form').addEventListener('submit', async (e) => {
                e.preventDefault();
                localStorage.setItem('profileComplete', 'true');
                
                setTimeout(() => {
                    profileModal.remove();
                    resolve(true);
                }, 2000);
            });
        });
    }

    async handleYouTubeTask() {
        window.open('http://www.youtube.com/@ANONYMOUSWHAT', '_blank');
        
        // Show confirmation popup
        const popup = document.createElement('div');
        popup.className = 'task-complete-popup';
        popup.innerHTML = `
            <i class="fab fa-youtube"></i>
            <h3>YouTube Task Complete!</h3>
            <p>Thank you for subscribing!</p>
        `;
        document.body.appendChild(popup);

        setTimeout(() => popup.remove(), 2000);
        return true;
    }

    async handleFacebookTask() {
        window.open('https://facebook.com/bhatakash07', '_blank');
        
        const popup = document.createElement('div');
        popup.className = 'task-complete-popup';
        popup.innerHTML = `
            <i class="fab fa-facebook"></i>
            <h3>Facebook Task Complete!</h3>
            <p>Thank you for following!</p>
        `;
        document.body.appendChild(popup);

        setTimeout(() => popup.remove(), 2000);
        return true;
    }

    async handleInstagramTask() {
        window.open('https://instagram.com/anonymouswhat', '_blank');
        
        const popup = document.createElement('div');
        popup.className = 'task-complete-popup';
        popup.innerHTML = `
            <i class="fab fa-instagram"></i>
            <h3>Instagram Task Complete!</h3>
            <p>Thank you for following!</p>
        `;
        document.body.appendChild(popup);

        setTimeout(() => popup.remove(), 2000);
        return true;
    }

    async handleShareTask() {
        const shareUrl = 'https://buzzflixearnmoney.vercel.app/';
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('Join BUZZFlix and start earning! ' + shareUrl)}`;
        window.open(whatsappUrl, '_blank');

        const popup = document.createElement('div');
        popup.className = 'task-complete-popup';
        popup.innerHTML = `
            <i class="fas fa-share-alt"></i>
            <h3>Share Successful!</h3>
            <p>Thank you for sharing BUZZFlix!</p>
        `;
        document.body.appendChild(popup);

        setTimeout(() => popup.remove(), 2000);
        return true;
    }
}