// New file to handle tutorial ads
export function createTutorialAd() {
  const adModal = document.createElement('div');
  adModal.className = 'tutorial-ad-modal';
  adModal.innerHTML = `
    <div class="tutorial-ad-container">
      <div class="ad-timer">5</div>
      <div class="ad-content">
        <div class="ad-logo">
          <img src="Abstract_Growth_Property_Investment_Free_Logo__1_-removebg-preview.png" alt="BUZZFlix Logo">
          <h1><span class="buzz">BUZZ</span><span class="flix">Flix</span></h1>
        </div>
        <div class="ad-text">
          <h2>Transform Your Future with BUZZFlix</h2>
          <div class="feature-list">
            <div class="feature">
              <i class="fas fa-graduation-cap"></i>
              <p>Premium Courses</p>
            </div>
            <div class="feature">
              <i class="fas fa-wallet"></i>
              <p>Earn While Learning</p>
            </div>
            <div class="feature">
              <i class="fas fa-users"></i>
              <p>Global Community</p>
            </div>
          </div>
          <p class="ad-cta">Join thousands of successful learners today!</p>
        </div>
      </div>
    </div>
  `;

  return new Promise((resolve) => {
    document.body.appendChild(adModal);
    
    let timeLeft = 5;
    const timer = adModal.querySelector('.ad-timer');
    
    const countdown = setInterval(() => {
      timeLeft--;
      timer.textContent = timeLeft;
      
      if (timeLeft <= 0) {
        clearInterval(countdown);
        adModal.classList.add('fade-out');
        setTimeout(() => {
          adModal.remove();
          resolve(true);
        }, 500);
      }
    }, 1000);
  });
}

