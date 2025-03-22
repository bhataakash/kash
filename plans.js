import { createPurchaseModal, initializePurchaseHandlers } from './course-purchase.js';
import { OfferManager } from './sale-offers.js';

export function createPlansView() {
  const offerManager = new OfferManager();
  const plansSection = document.createElement('div');
  plansSection.className = 'plans-section';

  // Add title section
  const titleSection = document.createElement('div');
  titleSection.className = 'plans-title-section';
  titleSection.innerHTML = `
    <h2>Take Your Skills To The Next Level</h2>
    <p>Unlock expertise with exclusive packages. Empower with industry-leading courses.</p>
  `;
  plansSection.appendChild(titleSection);

  // Add offer banner if active offer exists
  const currentOffer = offerManager.getCurrentOffer();
  if (currentOffer) {
    const offerBanner = document.createElement('div');
    offerBanner.className = `offer-banner ${currentOffer.type}-offer`;
    
    const decorations = currentOffer.type === 'eid' ? `
      <div class="eid-decoration">✨</div>
      <div class="eid-decoration">🌙</div>
      <div class="eid-decoration">⭐</div>
      <div class="eid-decoration">✨</div>
    ` : '';

    offerBanner.innerHTML = `
      ${decorations}
      <h3 class="offer-title">${currentOffer.title}</h3>
      <div class="offer-discount">${currentOffer.discount}% OFF</div>
      <p class="offer-description">${currentOffer.description}</p>
      <div class="offer-timer">
        <div class="timer-unit">
          <div class="timer-value" id="days">${currentOffer.timeRemaining.days}</div>
          <div class="timer-label">Days</div>
        </div>
        <div class="timer-unit">
          <div class="timer-value" id="hours">${currentOffer.timeRemaining.hours}</div>
          <div class="timer-label">Hours</div>
        </div>
        <div class="timer-unit">
          <div class="timer-value" id="minutes">${currentOffer.timeRemaining.minutes}</div>
          <div class="timer-label">Minutes</div>
        </div>
        <div class="timer-unit">
          <div class="timer-value" id="seconds">${currentOffer.timeRemaining.seconds}</div>
          <div class="timer-label">Seconds</div>
        </div>
      </div>
    `;
    plansSection.appendChild(offerBanner);

    // Update timer
    const timerInterval = setInterval(() => {
      const offer = offerManager.getCurrentOffer();
      if (!offer) {
        clearInterval(timerInterval);
        offerBanner.remove();
        return;
      }

      const { days, hours, minutes, seconds } = offer.timeRemaining;
      offerBanner.querySelector('#days').textContent = days;
      offerBanner.querySelector('#hours').textContent = hours;
      offerBanner.querySelector('#minutes').textContent = minutes;
      offerBanner.querySelector('#seconds').textContent = seconds;
    }, 1000);
  }

  // Continue with existing plans grid code...
  const plansGrid = document.createElement('div');
  plansGrid.className = 'plans-grid';
  
  const plans = [
    {
      name: 'Starter',
      price: 299,
      features: [
        'Access to 2+ Courses',
        'Live Support',
        'BUZZFlix Certificate',
        'Basic Earning Features'
      ],
      courses: 2
    },
    {
      name: 'Basic',
      price: 499,
      features: [
        'Access to 4+ Courses',
        'Priority Support', 
        'BUZZFlix Certificate',
        'Advanced Earning Tools',
        'Community Access'
      ],
      courses: 4
    },
    {
      name: 'Gold',
      price: 799,
      features: [
        'Access to 6+ Courses',
        '24/7 Priority Support',
        'Premium Certificate',
        'Premium Earning Tools', 
        'Private Community',
        'Monthly Webinars'
      ],
      courses: 6
    },
    {
      name: 'Platinum',
      price: 1299,
      features: [
        'Access to 8+ Courses',
        'VIP Support',
        'Elite Certificate',
        'Elite Earning Tools',
        'VIP Community',
        'Weekly Webinars',
        'One-on-One Mentoring'
      ],
      courses: 8
    },
    {
      name: 'Heroic',
      price: 1999,
      features: [
        'Access to 10+ Courses',
        'Dedicated Support Manager',
        'Elite+ Certificate',
        'Premium+ Earning Tools',
        'Elite Community',
        'Daily Webinars',
        'Priority Mentoring',
        'Early Access Features'
      ],
      courses: 10
    },
    {
      name: 'Prime',
      price: 2499,
      features: [
        'Access to 14+ Courses',
        'Executive Support',
        'Ultimate Certificate',
        'Ultimate Earning Tools',
        'Founder\'s Circle Access',
        'Private Webinars',
        'Executive Mentoring',
        'Beta Features Access',
        'Custom Learning Path'
      ],
      courses: 14
    }
  ];

  function showPlanDetails(plan) {
    const modal = document.createElement('div');
    modal.className = 'plan-details-modal';
    modal.innerHTML = `
      <div class="plan-details-container">
        <div class="plan-header">
          <div class="plan-name">
            <h2>${plan.name} Plan</h2>
            <img src="Purple and Green Modern How to Money Investment Techniques Instagram Post (1).png" alt="Investment Plan" class="plan-header-image">
            <div class="plan-price">₹${plan.price}</div>
          </div>
        </div>
        <div class="plan-content">
          <div class="plan-courses">
            <i class="fas fa-graduation-cap"></i>
            <span>Access to ${plan.courses}+ Premium Courses</span>
          </div>
          <div class="plan-features">
            ${plan.features.map(feature => `
              <div class="feature-item">
                <i class="fas fa-check-circle"></i>
                <span>${feature}</span>
              </div>
            `).join('')}
          </div>
          <button class="purchase-plan-btn" onclick="window.showPurchaseModal({
            title: '${plan.name} Plan Subscription',
            originalPrice: ${Math.round(plan.price * 1.2)},
            discountedPrice: ${plan.price},
            image: 'Purple and Green Modern How to Money Investment Techniques Instagram Post (1).png'
          })">
            Purchase Plan
          </button>
        </div>
        <button class="close-plan-details">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close-plan-details');
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
  }

  plans.forEach(plan => {
    const planCard = document.createElement('div');
    planCard.className = 'plan-card';
    planCard.innerHTML = `
      <img src="Purple and Green Modern How to Money Investment Techniques Instagram Post (1).png" alt="Investment Plan" class="plan-image">
      <div class="plan-tier">
        <h3>${plan.name}</h3>
      </div>
      <div class="plan-price">₹${plan.price}</div>
      <p>${plan.courses}+ Courses</p>
      <button class="view-plan-btn">View Plan</button>
    `;

    planCard.querySelector('.view-plan-btn').onclick = () => showPlanDetails(plan);
    plansGrid.appendChild(planCard);
  });

  plansSection.appendChild(plansGrid);
  
  // Add to global scope for the onclick handler 
  if (!window.showPurchaseModal) {
    window.showPurchaseModal = (details) => {
      const modal = createPurchaseModal(details);
      document.body.appendChild(modal);
      initializePurchaseHandlers(modal, details);
    };
  }

  return plansSection;
}