import { CONFIG } from './config.js';

export class WalletManager {
    constructor() {
        this.balance = localStorage.getItem('walletBalance') || CONFIG.INITIAL_WALLET_BALANCE;
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.withdrawalHistory = JSON.parse(localStorage.getItem('withdrawalHistory')) || [];
    }

    addBalance(amount) {
        this.balance = parseFloat(this.balance) + parseFloat(amount);
        this.saveToStorage();
        this.addTransaction('Credit', amount, 'Referral Bonus');
    }

    async initiateWithdrawal(data) {
        if (this.balance < 450) {
            throw new Error('Minimum withdrawal amount is ₹450');
        }
        if (this.balance < data.amount) {
            throw new Error('Insufficient balance');
        }

        // Process withdrawal
        this.balance -= data.amount;
        this.addTransaction('Debit', data.amount, 'Withdrawal');
        this.withdrawalHistory.push({
            ...data,
            status: 'Processing',
            date: new Date().toISOString(),
            id: Date.now()
        });
        this.saveToStorage();

        return {
            success: true,
            message: 'Withdrawal successful! Your money will be transferred within 24 hours.'
        };
    }

    addTransaction(type, amount, description) {
        this.transactions.push({
            type,
            amount,
            description,
            date: new Date().toISOString(),
            id: Date.now()
        });
        this.saveToStorage();
    }

    saveToStorage() {
        localStorage.setItem('walletBalance', this.balance);
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        localStorage.setItem('withdrawalHistory', JSON.stringify(this.withdrawalHistory));
    }
}