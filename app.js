import { CONFIG } from './config.js';
import { createApp } from 'vue';
import { initializeLoadingScreen } from './loading.js';
import { WalletManager } from './wallet.js';
import { ReferralManager } from './referral.js';
import { createWalletModal, createReferralModal } from './financial-modals.js';
import { createPurchaseModal, initializePurchaseHandlers } from './course-purchase.js';
import { TaskManager } from './tasks.js';
import { createTasksModal } from './tasks-ui.js';
import { createProfileModal } from './profile-ui.js';
import { createPlansView } from './plans.js';
import { setupRouting } from './routing.js';
import { createEbooksView } from './ebooks.js';

// Initialize app configuration
const appConfig = {
  data() {
    return {
      showHomeContent: true,
      currentSection: 'featured',
      visibleProducts: 6,
      searchQuery: '',
      emailSubscription: '',
      subscriptionMessage: '',
      showCoursePage: false,
      isNavActive: false,
      showLoginModal: false,
      loginForm: {
        email: '',
        password: ''
      },
      loginError: false,
      activeLegalModal: null,
      walletManager: new WalletManager(),
      referralManager: null,
      taskManager: null,
      showEbooksPage: false,
      products: [
        {
          id: 1,
          name: 'Premium Wireless Headphones',
          price: 129.99,
          discount: 15,
          rating: 4.5,
          reviews: 256,
          category: 'tech',
          description: 'Noise-cancelling headphones with 30-hour battery life and premium sound quality.',
          affiliateLink: 'https://www.amazon.com',
          color: '#3f51b5',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 2,
          name: 'Smart Fitness Watch',
          price: 89.99,
          discount: 20,
          rating: 4,
          reviews: 189,
          category: 'tech',
          description: 'Track your health metrics, workouts, and receive notifications with this sleek smart watch.',
          affiliateLink: 'https://www.amazon.com',
          color: '#e91e63',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 3,
          name: 'Organic Skincare Set',
          price: 59.99,
          discount: 10,
          rating: 5,
          reviews: 112,
          category: 'lifestyle',
          description: 'All-natural, cruelty-free skincare products made with organic ingredients.',
          affiliateLink: 'https://www.amazon.com',
          color: '#4caf50',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 4,
          name: 'Portable Bluetooth Speaker',
          price: 49.99,
          discount: 0,
          rating: 4,
          reviews: 95,
          category: 'tech',
          description: 'Waterproof, compact speaker with powerful bass and 12-hour battery life.',
          affiliateLink: 'https://www.amazon.com',
          color: '#ff9800',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 5,
          name: 'Premium Coffee Subscription',
          price: 29.99,
          discount: 0,
          rating: 4.5,
          reviews: 78,
          category: 'lifestyle',
          description: 'Artisanal coffee beans delivered to your door monthly. Ethically sourced and freshly roasted.',
          affiliateLink: 'https://www.amazon.com',
          color: '#795548',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 6,
          name: 'Ultra HD Streaming Device',
          price: 69.99,
          discount: 15,
          rating: 4,
          reviews: 203,
          category: 'entertainment',
          description: 'Stream your favorite content in 4K with this easy-to-use streaming stick.',
          affiliateLink: 'https://www.amazon.com',
          color: '#009688',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 7,
          name: 'Ergonomic Home Office Chair',
          price: 199.99,
          discount: 25,
          rating: 4.5,
          reviews: 167,
          category: 'lifestyle',
          description: 'Adjustable, comfortable chair designed for long work sessions with lumbar support.',
          affiliateLink: 'https://www.amazon.com',
          color: '#607d8b',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 8,
          name: 'Smart Home Security Camera',
          price: 79.99,
          discount: 0,
          rating: 4,
          reviews: 91,
          category: 'tech',
          description: 'HD security camera with motion detection, night vision, and smartphone alerts.',
          affiliateLink: 'https://www.amazon.com',
          color: '#673ab7',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 9,
          name: 'Professional Blender',
          price: 149.99,
          discount: 20,
          rating: 5,
          reviews: 215,
          category: 'lifestyle',
          description: 'High-powered blender for smoothies, soups, and more with multiple speed settings.',
          affiliateLink: 'https://www.amazon.com',
          color: '#f44336',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 10,
          name: 'Wireless Gaming Controller',
          price: 59.99,
          discount: 10,
          rating: 4,
          reviews: 178,
          category: 'entertainment',
          description: 'Precision gaming controller compatible with PC and console with customizable buttons.',
          affiliateLink: 'https://www.amazon.com',
          color: '#2196f3',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 11,
          name: 'Smart Robot Vacuum',
          price: 249.99,
          discount: 15,
          rating: 4.5,
          reviews: 132,
          category: 'tech',
          description: 'Self-emptying robot vacuum with mapping technology and voice control.',
          affiliateLink: 'https://www.amazon.com',
          color: '#9c27b0',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 12,
          name: 'Online Yoga Class Subscription',
          price: 19.99,
          discount: 0,
          rating: 5,
          reviews: 89,
          category: 'lifestyle',
          description: 'Unlimited access to professional yoga classes for all levels. New classes added weekly.',
          affiliateLink: 'https://www.amazon.com',
          color: '#cddc39',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 13,
          name: 'Portable Game Console',
          price: 199.99,
          discount: 10,
          rating: 4,
          reviews: 156,
          category: 'entertainment',
          description: 'Handheld gaming device with HD display and hundreds of pre-loaded games.',
          affiliateLink: 'https://www.amazon.com',
          color: '#ff5722',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 14,
          name: 'Waterproof E-Reader',
          price: 129.99,
          discount: 15,
          rating: 4.5,
          reviews: 201,
          category: 'entertainment',
          description: 'Read anywhere with this waterproof e-reader featuring adjustable lighting and weeks of battery life.',
          affiliateLink: 'https://www.amazon.com',
          color: '#03a9f4',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        },
        {
          id: 15,
          name: 'Wireless Charging Pad',
          price: 34.99,
          discount: 0,
          rating: 4,
          reviews: 67,
          category: 'tech',
          description: 'Fast wireless charging for compatible smartphones and accessories with sleek design.',
          affiliateLink: 'https://www.amazon.com',
          color: '#ffc107',
          imageWidth: 200,
          imageHeight: 200,
          hovering: false
        }
      ],
      legalContent: {
        privacy: {
          icon: 'fas fa-shield-alt',
          title: 'Privacy Policy',
          content: `<p>At BUZZFlix, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.</p>
                   <p>We collect information to:</p>
                   <ul>
                       <li>Enhance your learning experience</li>
                       <li>Provide personalized content recommendations</li>
                       <li>Improve our services and platform</li>
                       <li>Communicate important updates</li>
                   </ul>
                   <p>Your data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent.</p>`
        },
        terms: {
          icon: 'fas fa-gavel',
          title: 'Terms of Service',
          content: `<p>Welcome to BUZZFlix! By using our platform, you agree to these terms of service.</p>
                   <p>Key points:</p>
                   <ul>
                       <li>You must be 18 years or older to purchase courses</li>
                       <li>Course content is for personal use only</li>
                       <li>Sharing account credentials is prohibited</li>
                       <li>We reserve the right to modify or terminate services</li>
                   </ul>
                   <p>Please read these terms carefully before using our platform.</p>`
        },
        affiliate: {
          icon: 'fas fa-handshake',
          title: 'Affiliate Disclosure',
          content: `<p>BUZZFlix believes in transparency. We may earn commissions through affiliate partnerships.</p>
                   <p>Our commitment:</p>
                   <ul>
                       <li>We only recommend products we believe in</li>
                       <li>Affiliate partnerships don't influence our content</li>
                       <li>All affiliate links are clearly marked</li>
                       <li>Commissions help support our platform</li>
                   </ul>
                   <p>Thank you for supporting BUZZFlix through our affiliate programs.</p>`
        },
        contact: {
          icon: 'fas fa-envelope',
          title: 'Contact Us',
          content: `<div class="contact-info">
                       <div class="contact-item">
                           <i class="fas fa-envelope"></i>
                           <div>
                               <h4>Email</h4>
                               <p>buzzflix9@gmail.com</p>
                           </div>
                       </div>
                       <div class="contact-item">
                           <i class="fas fa-map-marker-alt"></i>
                           <div>
                               <h4>Location</h4>
                               <p>Anantnag, Kashmir, 192210</p>
                           </div>
                       </div>
                   </div>`
        }
      }
    };
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) {
        return this.products;
      }
      const query = this.searchQuery.toLowerCase();
      return this.products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    },
    techProducts() {
      return this.products.filter(product => product.category === 'tech');
    },
    lifestyleProducts() {
      return this.products.filter(product => product.category === 'lifestyle');
    },
    entertainmentProducts() {
      return this.products.filter(product => product.category === 'entertainment');
    }
  },
  methods: {
    toggleNav() {
      this.isNavActive = !this.isNavActive;
      document.body.style.overflow = this.isNavActive ? 'hidden' : '';
    },
    navigateTo(page) {
      if (page === 'courses') {
        this.showCoursePage = true;
        this.currentSection = null;
      } else if (page === 'home') {
        this.showCoursePage = false;
        this.currentSection = 'featured';
      }
      this.isNavActive = false;
      document.body.style.overflow = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    showCourses() {
      this.showCoursePage = true;
      this.currentSection = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    subscribeNewsletter() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.emailSubscription) {
        this.subscriptionMessage = 'Please enter your email address.';
        return;
      }
      if (!emailRegex.test(this.emailSubscription)) {
        this.subscriptionMessage = 'Please enter a valid email address.';
        return;
      }
      
      this.subscriptionMessage = 'Thank you for subscribing!';
      this.emailSubscription = '';
      
      setTimeout(() => {
        this.subscriptionMessage = '';
      }, 3000);
    },
    toggleLoginModal() {
      this.showLoginModal = !this.showLoginModal;
      if (this.showLoginModal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        this.loginForm.email = '';
        this.loginForm.password = '';
        this.loginError = false;
      }
    },
    handleLogin() {
      if (!this.loginForm.email || !this.loginForm.password) {
        this.loginError = true;
        const container = document.querySelector('.login-container');
        container.classList.add('shake');
        setTimeout(() => {
          container.classList.remove('shake');
        }, 500);
        return;
      }
      // Here you would typically handle the login logic
      console.log('Login attempted with:', this.loginForm);
      this.toggleLoginModal();
    },
    loginWithGoogle() {
      // Create success popup
      const popup = document.createElement('div');
      popup.className = 'login-success-popup';
      popup.innerHTML = '<h3>Login Successful!</h3>';
      document.body.appendChild(popup);

      // Create balloons
      const colors = ['#ff5722', '#2196f3', '#4caf50', '#ffc107', '#9c27b0'];
      for (let i = 0; i < 5; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.setProperty('--balloon-color', colors[i]);
        balloon.style.left = `${Math.random() * 80 + 10}%`;
        balloon.style.top = `${Math.random() * 30 + 60}%`;
        document.body.appendChild(balloon);

        // Create particles for explosion effect
        balloon.addEventListener('animationend', () => {
          balloon.remove();
          for (let j = 0; j < 10; j++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.setProperty('--particle-color', colors[i]);
            particle.style.setProperty('--float-x', `${Math.random() * 200 - 100}px`);
            particle.style.setProperty('--float-y', `${Math.random() * 200 - 100}px`);
            particle.style.left = balloon.style.left;
            particle.style.top = balloon.style.top;
            document.body.appendChild(particle);
            
            particle.addEventListener('animationend', () => particle.remove());
          }
        });
      }

      // Remove popup after animation
      popup.addEventListener('animationend', () => {
        popup.remove();
        this.toggleLoginModal();
      });

      // Log the attempt
      console.log('Google login successful');
    },
    showLegalModal(type) {
      this.activeLegalModal = type;
      document.body.style.overflow = 'hidden';
    },
    closeLegalModal() {
      this.activeLegalModal = null;
      document.body.style.overflow = '';
    },
    showWallet() {
      const modal = createWalletModal(this.walletManager);
      document.body.appendChild(modal);
      
      // Add event listeners
      modal.querySelector('.close-button').addEventListener('click', () => {
        modal.remove();
      });
      
      modal.querySelector('select').addEventListener('change', (e) => {
        const bankDetails = modal.querySelector('.bank-details');
        const upiDetails = modal.querySelector('.upi-details');
        
        if (e.target.value.includes('bank')) {
          bankDetails.style.display = 'block';
          upiDetails.style.display = 'none';
        } else if (e.target.value === 'upi') {
          upiDetails.style.display = 'block';
          bankDetails.style.display = 'none';
        } else {
          bankDetails.style.display = 'none';
          upiDetails.style.display = 'none';
        }
      });
      
      modal.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          const result = await this.walletManager.initiateWithdrawal({
            amount: 450,
            // Add other form data here
          });
          
          // Show success popup
          const popup = document.createElement('div');
          popup.className = 'success-popup';
          popup.innerHTML = `
            <h3>Withdrawal Successful!</h3>
            <p>Your money will be transferred within 24 hours.</p>
          `;
          document.body.appendChild(popup);
          
          setTimeout(() => {
            popup.remove();
            modal.remove();
          }, 3000);
          
        } catch (error) {
          alert(error.message);
        }
      });
    },
    showReferEarn() {
      const modal = createReferralModal(this.referralManager);
      document.body.appendChild(modal);
      
      modal.querySelector('.close-button').addEventListener('click', () => {
        modal.remove();
      });
      
      modal.querySelector('.copy-button').addEventListener('click', () => {
        navigator.clipboard.writeText(this.referralManager.referralCode);
        alert('Referral code copied to clipboard!');
      });
    },
    initiatePurchase(courseDetails) {
      const modal = createPurchaseModal(courseDetails);
      document.body.appendChild(modal);
      initializePurchaseHandlers(modal, courseDetails);
    },
    showTasks() {
      const modal = createTasksModal(this.taskManager);
      document.body.appendChild(modal);
    },
    showProfile() {
      const profileModal = createProfileModal();
      document.body.appendChild(profileModal);
    },
    ...setupRouting()
  },
  mounted() {
    initializeLoadingScreen();
    
    // Initialize managers and event listeners
    this.referralManager = new ReferralManager(this.walletManager);
    this.taskManager = new TaskManager(this.walletManager, this.referralManager);
    
    // Watch for course page changes
    this.$watch('showCoursePage', (newVal) => {
      if (newVal) {
        this.$nextTick(() => {
          const coursePageElement = document.querySelector('#course-page');
          if (coursePageElement) {
            const plansView = createPlansView();
            coursePageElement.appendChild(plansView);
          }
        });
      }
    });
    
    // Update ebooks page handling
    this.$watch('showEbooksPage', (newVal) => {
      if (newVal) {
        this.$nextTick(() => {
          const ebooksContainer = document.querySelector('#ebooks-page');
          if (ebooksContainer) {
            ebooksContainer.innerHTML = '';
            ebooksContainer.appendChild(createEbooksView());
          }
        });
      }
    });
    
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    if (referralCode) {
      this.referralManager.processReferral(referralCode);
    }
  }
};

// Create and mount the app
const app = createApp(appConfig);
app.mount('#app');