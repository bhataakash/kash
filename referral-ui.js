// Updated referral UI components
export function createReferralSubmissionForm() {
  const form = document.createElement('div');
  form.className = 'referral-submission-form';
  form.innerHTML = `
    <div class="share-section">
      <h3>Share Your Referral Link</h3>
      <div class="referral-link-box">
        <input type="text" readonly class="referral-link-input" style="width: calc(100% - 120px); overflow: hidden; text-overflow: ellipsis;">
        <button class="copy-link-btn"><i class="fas fa-copy"></i> Copy Link</button>
      </div>
    </div>
    <div class="form-group">
      <label>Enter Friend's Referral Code</label>
      <input type="text" placeholder="Enter referral code" class="referral-input">
      <button class="submit-referral-btn">Submit Code</button>
    </div>
  `;
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