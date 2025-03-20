import { showCopySuccess, updateReferralLink } from './referral-ui.js';

export class ReferralManager {
    constructor(walletManager) {
        this.walletManager = walletManager;
        this.referralCode = localStorage.getItem('referralCode') || this.generateReferralCode();
        this.referrals = JSON.parse(localStorage.getItem('referrals')) || [];
        this.processedCodes = new Set(JSON.parse(localStorage.getItem('processedCodes') || '[]'));
        
        // Initialize sharing functionality
        this.initializeSharing();
    }

    generateReferralCode() {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        localStorage.setItem('referralCode', code);
        return code;
    }

    processReferral(referrerCode) {
        if (!referrerCode || this.processedCodes.has(referrerCode)) {
            return { success: false, message: 'Invalid or already used code' };
        }
        
        // Add referral bonus to referrer
        this.walletManager.addBalance(3);
        
        // Store referral record
        this.referrals.push({
            date: new Date().toISOString(),
            code: referrerCode,
            status: 'Completed'
        });
        
        // Mark code as processed
        this.processedCodes.add(referrerCode);
        localStorage.setItem('processedCodes', JSON.stringify([...this.processedCodes]));
        localStorage.setItem('referrals', JSON.stringify(this.referrals));
        
        return { success: true, message: 'Referral bonus added successfully!' };
    }

    async copyReferralLink() {
        const link = `https://buzzflixearnmoney.vercel.app/?ref=${this.referralCode}`;
        try {
            await navigator.clipboard.writeText(link);
            showCopySuccess();
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    }

    async copyReferralCode() {
        try {
            await navigator.clipboard.writeText(this.referralCode);
            showCopySuccess();
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    }

    initializeSharing() {
        this.shareData = {
            title: 'Join BUZZFlix',
            text: `Use my referral code ${this.referralCode} to join BUZZFlix and start earning!`,
            url: `https://buzzflixearnmoney.vercel.app/?ref=${this.referralCode}`
        };
        
        // Update UI with referral link
        updateReferralLink(this.referralCode);
    }

    async shareReferralCode() {
        try {
            if (navigator.share) {
                await navigator.share(this.shareData);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Share failed:', err);
            return false;
        }
    }
}