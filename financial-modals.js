import { CONFIG } from './config.js';
import { DailyBonusManager } from './daily-bonus.js';
import { createReferralSubmissionForm } from './referral-ui.js';

export function createWalletModal(walletManager) {
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'wallet-modal';
    modal.innerHTML = `
        <div class="wallet-container">
            <div class="wallet-header">
                <h2>My Wallet</h2>
                <button class="close-button"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="balance-card">
                <h3>Available Balance</h3>
                <div class="balance-amount">₹${walletManager.balance}</div>
            </div>

            <form class="withdraw-form">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" required placeholder="Enter your full name">
                </div>
                
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" required placeholder="Enter your email">
                </div>
                
                <div class="form-group">
                    <label>Payment Method</label>
                    <select required>
                        <option value="">Select payment method</option>
                        <option value="upi">UPI</option>
                        <option value="jk-bank">J&K Bank</option>
                        <option value="state-bank">State Bank</option>
                        <option value="sbi">SBI Bank</option>
                    </select>
                </div>
                
                <div class="form-group bank-details" style="display:none;">
                    <label>Account Number</label>
                    <input type="text" placeholder="Enter account number">
                    
                    <label>IFSC Code</label>
                    <input type="text" placeholder="Enter IFSC code">
                </div>
                
                <div class="form-group upi-details" style="display:none;">
                    <label>UPI ID</label>
                    <input type="text" placeholder="Enter UPI ID">
                </div>
                
                <button type="submit" class="submit-button">Withdraw</button>
            </form>
        </div>
    `;

    return modal;
}

export function createReferralModal(referralManager) {
    const dailyBonusManager = new DailyBonusManager(referralManager.walletManager);
    const modal = document.createElement('div');
    modal.className = 'refer-modal';
    modal.innerHTML = `
        <div class="refer-container">
            <div class="refer-header">
                <h2>Refer & Earn</h2>
                <button class="close-button"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="referral-card">
                <h3>Your Referral Code</h3>
                <div class="referral-code">${referralManager.referralCode}</div>
                <div class="referral-actions">
                    <button class="copy-button">
                        <i class="fas fa-copy"></i> Copy Code
                    </button>
                    <button class="share-button">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
            </div>
            
            <div class="daily-bonus-card">
                <h3><i class="fas fa-gift"></i> Daily Bonus</h3>
                <p>Collect ₹${CONFIG.DAILY_BONUS_AMOUNT} every 24 hours!</p>
                <div class="timer" id="bonus-timer">Next bonus in: ${dailyBonusManager.getTimeUntilNextBonus()}</div>
                <button class="collect-button" ${!dailyBonusManager.canCollectBonus() ? 'disabled' : ''}>
                    <i class="fas fa-coins"></i> 
                    ${dailyBonusManager.canCollectBonus() ? 'Collect Bonus' : 'Already Collected'}
                </button>
            </div>
            
            <div class="telegram-bonus-card">
                <h3><i class="fab fa-telegram"></i> Join Telegram</h3>
                <p>Join our Telegram channel and earn ₹${CONFIG.TELEGRAM_BONUS}!</p>
                <button class="telegram-join-btn">
                    <i class="fab fa-telegram"></i> Join Telegram
                </button>
                <button class="telegram-claim-btn" style="display:none;">
                    <i class="fas fa-gift"></i> Claim Bonus
                </button>
            </div>
            
            <div class="referral-info">
                <h3>How it works</h3>
                <ul>
                    <li>Share your referral code with friends</li>
                    <li>When they join using your code, you earn ₹${CONFIG.REFERRAL_BONUS}</li>
                    <li>Collect daily bonus of ₹${CONFIG.DAILY_BONUS_AMOUNT}</li>
                    <li>Withdraw earnings when balance reaches ₹${CONFIG.MIN_WITHDRAWAL}</li>
                </ul>
            </div>
        </div>
    `;

    const referralCard = modal.querySelector('.referral-card');
    referralCard.innerHTML = `
        <h3>Your Referral Code</h3>
        <div class="referral-code">${referralManager.referralCode}</div>
        <div class="referral-actions">
            <button class="copy-button">
                <i class="fas fa-copy"></i> Copy Code
            </button>
            <button class="share-button">
                <i class="fas fa-share-alt"></i> Share
            </button>
        </div>
    `;

    const submissionForm = createReferralSubmissionForm();
    modal.querySelector('.refer-container').insertBefore(
        submissionForm, 
        modal.querySelector('.daily-bonus-card')
    );

    updateReferralLink(referralManager.referralCode);

    const copyLinkBtn = modal.querySelector('.copy-link-btn');
    copyLinkBtn?.addEventListener('click', async () => {
        await referralManager.copyReferralLink();
    });

    const copyButton = referralCard.querySelector('.copy-button');
    copyButton.addEventListener('click', async () => {
        await referralManager.copyReferralCode();
    });

    const submitButton = submissionForm.querySelector('.submit-referral-btn');
    const referralInput = submissionForm.querySelector('.referral-input');
    
    submitButton.addEventListener('click', () => {
        const result = referralManager.processReferral(referralInput.value);
        if (result.success) {
            alert('Referral bonus added successfully!');
            referralInput.value = '';
        } else {
            alert(result.message);
        }
    });

    const collectButton = modal.querySelector('.collect-button');
    collectButton.addEventListener('click', () => {
        if (dailyBonusManager.collectBonus()) {
            collectButton.disabled = true;
            collectButton.innerHTML = '<i class="fas fa-check"></i> Already Collected';
            
            // Show success message
            const popup = document.createElement('div');
            popup.className = 'bonus-collected-popup';
            popup.innerHTML = `
                <i class="fas fa-coins"></i>
                <h3>Daily Bonus Collected!</h3>
                <p>₹${CONFIG.DAILY_BONUS_AMOUNT} added to your wallet</p>
            `;
            document.body.appendChild(popup);
            
            setTimeout(() => popup.remove(), 3000);
        }
    });

    // Update the Telegram claim functionality
    const joinBtn = modal.querySelector('.telegram-join-btn');
    const claimBtn = modal.querySelector('.telegram-claim-btn');
    
    // Check if already claimed
    const hasClaimed = localStorage.getItem('telegramBonusClaimed') === 'true';
    if (hasClaimed) {
        joinBtn.style.display = 'none';
        claimBtn.style.display = 'block';
        claimBtn.disabled = true;
        claimBtn.innerHTML = '<i class="fas fa-check"></i> Already Claimed';
    }

    joinBtn.addEventListener('click', () => {
        window.open(CONFIG.TELEGRAM_LINK, '_blank');
        joinBtn.style.display = 'none';
        if (!hasClaimed) {
            claimBtn.style.display = 'block';
        }
    });

    claimBtn.addEventListener('click', () => {
        if (!hasClaimed) {
            // Add bonus to wallet
            referralManager.walletManager.addBalance(CONFIG.TELEGRAM_BONUS);
            
            // Store claim status
            localStorage.setItem('telegramBonusClaimed', 'true');
            
            // Show success popup
            const popup = document.createElement('div');
            popup.className = 'claim-success-popup';
            popup.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Bonus Claimed!</h3>
                <p>₹${CONFIG.TELEGRAM_BONUS} added to your wallet</p>
            `;
            document.body.appendChild(popup);
            
            // Remove popup after 3 seconds
            setTimeout(() => popup.remove(), 3000);
            
            // Disable claim button
            claimBtn.disabled = true;
            claimBtn.innerHTML = '<i class="fas fa-check"></i> Claimed';
        }
    });

    const timerElement = modal.querySelector('#bonus-timer');
    const timerInterval = setInterval(() => {
        timerElement.textContent = `Next bonus in: ${dailyBonusManager.getTimeUntilNextBonus()}`;
    }, 1000);
    
    modal.querySelector('.close-button').addEventListener('click', () => {
        clearInterval(timerInterval);
    });

    return modal;
}

function updateReferralLink(referralCode) {
    // This function is not defined in the plan, so we'll leave it empty for now.
    // If you need to update the referral link, you can add the necessary code here.
}