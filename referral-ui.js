// Updated referral UI components
export function createReferralSubmissionForm() {
  const form = document.createElement('div');
  form.className = 'referral-submission-form';
  form.innerHTML = `
    <div class="share-section">
      <h3>Share Your Referral Link</h3>
      <div class="referral-link-box">
        <input type="text" readonly class="referral-link-input" value="http://buzzflixearnmoney.vercel.app/" style="width: calc(100% - 120px); overflow: hidden; text-overflow: ellipsis;">
        <button class="copy-link-btn"><i class="fas fa-copy"></i> Copy Link</button>
      </div>
      <div class="share-buttons">
        <button class="whatsapp-share-btn">
          <i class="fab fa-whatsapp"></i> Share on WhatsApp
        </button>
      </div>
    </div>
    <div class="form-group">
      <label>Enter Friend's Referral Code</label>
      <input type="text" placeholder="Enter referral code" class="referral-input">
      <small class="referral-hint">Enter any referral code to earn ₹3</small>
      <button class="submit-referral-btn">Submit Code</button>
    </div>
  `;

  // Update WhatsApp share functionality
  const whatsappBtn = form.querySelector('.whatsapp-share-btn');
  whatsappBtn.addEventListener('click', () => {
    const text = `Join BUZZFlix and start earning! Use my referral code: ${localStorage.getItem('referralCode')}`;
    const url = 'http://buzzflixearnmoney.vercel.app/';
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
    window.open(whatsappUrl, '_blank');
  });

  return form;
}

export function showCopySuccess() {
  const successMessage = document.createElement('div');
  successMessage.className = 'copy-success-toast';
  successMessage.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>Copied!</span>
  `;
  document.body.appendChild(successMessage);
  
  setTimeout(() => {
    successMessage.remove();
  }, 2000);
}

export function showReferralSuccess() {
  const popup = document.createElement('div');
  popup.className = 'referral-success-popup';
  popup.innerHTML = `
    <i class="fas fa-coins"></i>
    <h3>Congratulations!</h3>
    <p>You've successfully joined the BUZZFlix community!</p>
    <div class="bonus-amount">₹3</div>
    <p>Bonus added to your wallet</p>
  `;

  // Add confetti effect
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'popup-confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = ['#ffd700', '#ff9800', '#4caf50', '#2196f3'][Math.floor(Math.random() * 4)];
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    popup.appendChild(confetti);
  }

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 3000);
}

export function updateReferralLink(code) {
  const linkInput = document.querySelector('.referral-link-input');
  if (linkInput) {
    const referralLink = `https://buzzflixearnmoney.vercel.app/?ref=${code}`;
    linkInput.value = referralLink;
    
    // Update mobile responsiveness
    const updateWidth = () => {
      if (window.innerWidth <= 480) {
        linkInput.style.fontSize = '12px';
        linkInput.style.width = 'calc(100% - 85px)';
      } else {
        linkInput.style.fontSize = '14px';
        linkInput.style.width = 'calc(100% - 120px)';
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
  }
}