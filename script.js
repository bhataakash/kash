// Add to the existing script.js

// Performance optimizations for script.js

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Modal functionality
function setupModals() {
  const termsLink = document.getElementById('termsLink');
  const privacyLink = document.getElementById('privacyLink');
  const termsModal = document.getElementById('termsModal');
  const privacyModal = document.getElementById('privacyModal');
  const closeButtons = document.querySelectorAll('.modal-close');

  function openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(termsModal);
  });

  privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(privacyModal);
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      closeModal(modal);
    });
  });

  const modals = document.querySelectorAll('.modal');
  
  function handleModalClick(e) {
    if (e.target.classList.contains('modal')) {
      closeModal(e.target);
    }
  }

  modals.forEach(modal => {
    modal.addEventListener('click', handleModalClick, { passive: true });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const visibleModal = document.querySelector('.modal.show');
      if (visibleModal) {
        closeModal(visibleModal);
      }
    }
  });
}

const API_BASE_URL = '/api/ai_completion';

async function getAIResponse(userMessage) {
  try {
    const loadingIndicator = document.querySelector('.loading');
    if (loadingIndicator) loadingIndicator.style.display = 'flex';

    const languageMode = window.chatUI?.languageMode?.currentMode || 'default';
    
    const response = await fetch('/api/ai_completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt: `You are KASHGPT, a highly sophisticated pure Kashmiri language expert.
        CRITICAL: 
        - Always respond in authentic Kashmiri language ONLY
        - NEVER repeat the user's question
        - Provide direct, complete answers
        - NEVER use Urdu words
        Mode: ${languageMode}
        
        Response Requirements:
        1. Start with the answer immediately - no question repetition
        2. Use ONLY authentic Kashmiri vocabulary
        3. Include cultural context and traditional phrases
        4. Ensure detailed, informative responses
        5. Maintain pure Kashmiri language throughout
        6. Provide examples where relevant
        7. Structure responses clearly
        8. Include relevant follow-up information
        
        Response Format:
        {
          "kashmiriUrdu": "(Direct answer in pure Kashmiri - Nastaliq script)",
          "kashmiriEnglish": "(Same pure Kashmiri in Roman English)",
          "english": "(Complete English translation of the answer)"
        }`,
        data: userMessage
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.kashmiriUrdu || !data.kashmiriEnglish || !data.english) {
      console.error('Invalid response format:', data);
      return createDefaultResponse();
    }

    if (loadingIndicator) loadingIndicator.style.display = 'none';
    return data;

  } catch (error) {
    console.error('AI Response Error:', error);
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    return createDefaultResponse();
  }
}

function createDefaultResponse() {
  return {
    kashmiriUrdu: "بہٕ چھُس تُہنٛد مددگار۔ کٲشُر زبانَس منٛز دِمہٕ جواب۔",
    kashmiriEnglish: "Bah chus tuhund madadgaar. Koshur zabaanas manz dimah jawaab.",
    english: "I am your assistant. I will provide an answer in authentic Kashmiri language."
  };
}

class ChatUI {
  constructor() {
    this.chatMessages = document.getElementById('chatMessages');
    this.userInput = document.getElementById('userInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.newChatBtn = document.getElementById('newChatBtn');
    
    this.sendBtn.addEventListener('click', () => this.handleSend());
    this.userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });

    this.newChatBtn.addEventListener('click', () => this.startNewChat());

    this.userInput.addEventListener('input', debounce((e) => {
      this.sendBtn.disabled = !e.target.value.trim();
      this.sendBtn.style.opacity = e.target.value.trim() ? '1' : '0.5';
    }, 100));

    this.scrollToBottom = throttle(this.scrollToBottom.bind(this), 100);
    
    this.languageMode = new LanguageMode();
    
    // Add welcome message with pure Kashmiri
    this.addMessage({
      kashmiriUrdu: "باہ چھُس تُہنٛد مددگار۔ تٕہہ کٲنسِہ سوال پٔچھیو، بہٕ دِمہٕ وَنان کٲشُر زبانَس منٛز جواب۔",
      kashmiriEnglish: "Bah chus tuhund madad-gaar. Tehi kaensi sawal pechiv, bah dima wanaan Koshur zabaanas manz jawaab.",
      english: "I am your assistant. Please ask any question, and I will provide a comprehensive response in authentic Kashmiri language."
    }, 'bot');
    
    if ('ontouchstart' in window) {
      this.setupTouchHandlers();
    }
    
    this.chatHistory = new ChatHistory();
  }

  setupTouchHandlers() {
    let touchStartY = 0;
    const chatMessages = this.chatMessages;

    chatMessages.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    chatMessages.addEventListener('touchmove', (e) => {
      const touchY = e.touches[0].clientY;
      const scrollTop = chatMessages.scrollTop;
      
      // Prevent overscroll at boundaries
      if (scrollTop <= 0 && touchY > touchStartY) {
        e.preventDefault();
      }
      if (scrollTop + chatMessages.clientHeight >= chatMessages.scrollHeight && touchY < touchStartY) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  startNewChat() {
    while (this.chatMessages.children.length > 1) {
      this.chatMessages.removeChild(this.chatMessages.lastChild);
    }
    
    this.userInput.value = '';
    this.userInput.focus();
    
    this.sendBtn.disabled = true;
    this.sendBtn.style.opacity = '0.5';
  }

  handleSend = async () => {
    const message = this.userInput.value.trim();
    if (!message) return;

    this.userInput.disabled = true;
    this.sendBtn.disabled = true;

    this.addMessage(message, 'user');
    this.chatHistory.addToHistory(message); 
    this.userInput.value = '';

    const loadingElement = this.addLoading();

    try {
      const prompt = this.languageMode.getPromptForMode(message);
      const response = await getAIResponse(message);
      
      loadingElement.remove();
      this.addMessage(response, 'bot');
      
    } catch (error) {
      console.error('Chat Error:', error);
      loadingElement.remove();
      this.addMessage(createDefaultResponse(), 'bot');
    } finally {
      this.userInput.disabled = false;
      this.sendBtn.disabled = false;
      this.userInput.focus();
    }
  }

  addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    if (type === 'user') {
      messageDiv.textContent = content;
      this.chatMessages.appendChild(messageDiv);
      this.scrollToBottom();
    } else {
      requestAnimationFrame(() => {
        const fragment = document.createDocumentFragment();
        const answerSection = document.createElement('div');
        answerSection.className = 'answer-section';
        
        // Process and format detailed responses
        ['kashmiriUrdu', 'kashmiriEnglish', 'english'].forEach(lang => {
          const div = document.createElement('div');
          div.className = lang;
          
          // Split response into sections and format
          const formattedContent = this.formatDetailedResponse(content[lang]);
          div.innerHTML = formattedContent;
          
          answerSection.appendChild(div);
        });

        messageDiv.appendChild(answerSection);
        fragment.appendChild(messageDiv);
        this.chatMessages.appendChild(fragment);
        
        // Animate sections
        requestAnimationFrame(() => {
          const sections = messageDiv.querySelectorAll('.section');
          sections.forEach((section, index) => {
            setTimeout(() => {
              section.style.opacity = '1';
              if (index === sections.length - 1) {
                this.scrollToBottom();
              }
            }, index * 150);
          });
        });
      });
    }
  }

  formatDetailedResponse(text) {
    // Split text into sections
    const sections = text.split('\n\n');
    
    return sections.map(section => {
      // Format lists
      if (section.includes('•')) {
        const items = section.split('•').filter(item => item.trim());
        return `<div class="section" style="opacity: 0; transition: opacity 0.5s ease;">
          <ul>${items.map(item => `<li>${item.trim()}</li>`).join('')}</ul>
        </div>`;
      }
      
      // Format headers
      if (section.toUpperCase() === section) {
        return `<div class="section" style="opacity: 0; transition: opacity 0.5s ease;">
          <h3>${section}</h3>
        </div>`;
      }
      
      // Regular paragraphs
      return `<div class="section" style="opacity: 0; transition: opacity 0.5s ease;">
        <p>${section.trim()}</p>
      </div>`;
    }).join('');
  }

  addLoading() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-animation';
    typingDiv.textContent = 'KASHGPT is responding...';
    this.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
    return typingDiv;
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    });
  }
}

class LanguageMode {
  constructor() {
    this.currentMode = 'default';
    this.setupLanguageModes();
  }

  setupLanguageModes() {
    const modeOptions = document.querySelectorAll('.mode-option');

    modeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const mode = option.getAttribute('data-mode');
        this.setMode(mode);
        
        // Update UI
        modeOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        // Store the mode preference
        localStorage.setItem('kashgpt_mode', mode);
        
        // Optional: Show feedback toast
        this.showModeChangeToast(mode);
      });
    });

    // Load saved mode preference
    const savedMode = localStorage.getItem('kashgpt_mode');
    if (savedMode) {
      this.setMode(savedMode);
      const savedOption = document.querySelector(`[data-mode="${savedMode}"]`);
      if (savedOption) {
        modeOptions.forEach(opt => opt.classList.remove('selected'));
        savedOption.classList.add('selected');
      }
    }
  }

  setMode(mode) {
    this.currentMode = mode;
    console.log('Mode changed to:', mode);
  }

  showModeChangeToast(mode) {
    const toast = document.createElement('div');
    toast.className = 'mode-toast';
    toast.textContent = `Switched to ${mode.replace(/([A-Z])/g, ' $1').toLowerCase()} mode`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 2000);
    }, 100);
  }

  getPromptForMode(userMessage) {
    const basePrompt = `You are KASHGPT, a highly sophisticated pure Kashmiri language expert.
    CRITICAL: Always respond in authentic Kashmiri language ONLY - NEVER use Urdu words.
    
    Guidelines for responses:
    1. Use ONLY pure Kashmiri vocabulary
    2. Include authentic Kashmiri expressions and idioms
    3. Follow proper Kashmiri grammar and syntax
    4. Add rich cultural context using Kashmiri terms
    5. Provide multiple examples in pure Kashmiri
    6. Structure responses with clear paragraphs
    7. DO NOT repeat the user's question
    8. Focus on detailed scholarly explanations using Kashmiri vocabulary
    9. Include specific details about:
       - Historical context in Kashmiri terms
       - Geographic details using Kashmiri words
       - Cultural significance in pure Kashmiri
       - Local customs in authentic Kashmiri
       - Related traditions using Kashmiri vocabulary
       - Linguistic nuances of pure Kashmiri
    
    Response MUST be in this format:
    {
      "kashmiriUrdu": "(Pure Kashmiri response in Nastaliq script - NO URDU WORDS)",
      "kashmiriEnglish": "(Same pure Kashmiri response in Roman English)", 
      "english": "(Complete English translation)"
    }`;

    switch(this.currentMode) {
      case 'eng2kash':
        return `${basePrompt}\n\nThe user is writing in English. Translate and respond in pure Kashmiri only, ensuring NO Urdu words are used.`;
      case 'kash2kash':
        return `${basePrompt}\n\nThe user is writing in Kashmiri. Respond with an expanded, enriched pure Kashmiri response using authentic vocabulary and expressions only.`;
      default:
        return basePrompt;
    }
  }
}

class VoiceAssistant {
  constructor() {
    this.voices = {
      sulkak: {
        name: 'Sulkak',
        lang: 'ks-IN',  
        gender: 'male'
      },
      rubi: {
        name: 'Rubi', 
        lang: 'ks-IN',
        gender: 'female'  
      }
    };
    this.currentVoice = this.voices.sulkak;
    this.speaking = false;
    this.synthesis = window.speechSynthesis;
    this.setupVoiceButton();
    
    // Load voices when they are ready
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
    
    // Update voice button UI
    const voiceBtn = document.getElementById('voiceBtn');
    voiceBtn.setAttribute('title', 'Choose Kashmiri Voice Assistant (Sulkak/Rubi)');
  }

  loadVoices() {
    // Get all available voices
    this.availableVoices = this.synthesis.getVoices();
    console.log("Available voices:", this.availableVoices);
  }

  setupVoiceButton() {
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceMenu = document.getElementById('voiceMenu');
    
    // Voice button click handler
    voiceBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.speaking) {
        this.stop();
      } else {
        voiceMenu.classList.toggle('show');
      }
    });

    // Voice selection handlers
    document.querySelectorAll('.voice-option').forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const voiceKey = option.getAttribute('data-voice');
        this.currentVoice = this.voices[voiceKey];
        voiceMenu.classList.remove('show');
        
        // Update selected voice UI
        document.querySelectorAll('.voice-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        option.classList.add('selected');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', () => {
      voiceMenu.classList.remove('show');
    });
  }

  speak(text) {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }

    const kashmiriEnglishText = text;
    const utterance = new SpeechSynthesisUtterance(kashmiriEnglishText);
    
    // Set voice properties
    utterance.lang = 'ks-IN';  // Kashmiri language code
    utterance.pitch = 1;
    utterance.rate = 0.9;
    utterance.volume = 1;

    // Find an appropriate voice
    const voice = this.voices.find(v => v.lang === 'hi-IN' || v.lang === 'ur-PK');
    if (voice) {
      utterance.voice = voice;
    }

    // Speaking events
    utterance.onstart = () => {
      this.speaking = true;
      document.getElementById('voiceBtn').classList.add('speaking');
    };

    utterance.onend = () => {
      this.speaking = false;
      document.getElementById('voiceBtn').classList.remove('speaking');
    };

    this.synthesis.speak(utterance);
  }

  stop() {
    if (this.speaking) {
      this.synthesis.cancel();
      this.speaking = false;
      document.getElementById('voiceBtn').classList.remove('speaking');
      // Remove speaking class from any active message speaker
      const activeSpeaker = document.querySelector('.message-speaker.speaking');
      if (activeSpeaker) {
        activeSpeaker.classList.remove('speaking');
      }
    }
  }
}

class WebSearch {
  constructor() {
    this.searchBtn = document.getElementById('searchWebBtn');
    this.searchActive = false;
    this.setupListeners();
  }

  setupListeners() {
    this.searchBtn.addEventListener('click', () => {
      this.searchActive = !this.searchActive;
      this.toggleSearchMode();
      if (this.searchActive) {
        this.handleSearch();
      } else {
        this.clearResults();
      }
    });
  }

  toggleSearchMode() {
    const btn = this.searchBtn;
    if (this.searchActive) {
      btn.classList.add('active');
      btn.title = "Disable Web Search";
    } else {
      btn.classList.remove('active');
      btn.title = "Search the Web";
    }
  }

  clearResults() {
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
      existingResults.remove();
    }
  }

  async handleSearch() {
    if (!this.searchActive) return;
    
    try {
      const userInput = document.getElementById('userInput').value.trim();
      if (!userInput) return;

      const response = await fetch('/api/ai_completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate search suggestions for: ${userInput}
          
          interface Suggestion {
            text: string;
            description: string;
          }
          
          interface Response {
            suggestions: Suggestion[];
          }

          Example:
          {
            "suggestions": [
              {
                "text": "Kashmir history",
                "description": "Explore the rich historical timeline of Kashmir"
              },
              {
                "text": "Kashmir culture traditions",
                "description": "Learn about cultural practices and customs"
              }
            ]
          }
          `,
          data: userInput
        }),
      });

      const data = await response.json();
      this.displayResults(data.suggestions);
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  displayResults(suggestions) {
    if (!this.searchActive) return;
    
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    
    suggestions.forEach(suggestion => {
      const resultItem = document.createElement('div');
      resultItem.className = 'search-result-item';
      resultItem.innerHTML = `
        <div class="search-result-title">${suggestion.text}</div>
        <div class="search-result-snippet">${suggestion.description}</div>
      `;
      resultItem.addEventListener('click', () => {
        document.getElementById('userInput').value = suggestion.text;
        this.clearResults();
      });
      resultsContainer.appendChild(resultItem);
    });

    const inputContainer = document.querySelector('.input-container');
    this.clearResults();
    inputContainer.insertBefore(resultsContainer, document.getElementById('userInput'));
  }
}

class ChatHistory {
  constructor() {
    this.storageKey = 'kashgpt_chat_history';
    this.maxHistoryItems = 50;
    this.historyList = document.getElementById('historyList');
    this.loadHistory();
  }

  loadHistory() {
    try {
      const history = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      this.renderHistory(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
      this.renderHistory([]);
    }
  }

  saveHistory(history) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(history));
      this.renderHistory(history);
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  addToHistory(message) {
    try {
      const history = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const newItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
        fullMessage: message
      };

      history.unshift(newItem);
      if (history.length > this.maxHistoryItems) {
        history.pop();
      }

      this.saveHistory(history);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  }

  deleteHistoryItem(id) {
    try {
      const history = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const updatedHistory = history.filter(item => item.id !== id);
      this.saveHistory(updatedHistory);
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  }

  renderHistory(history) {
    if (!this.historyList) return;

    if (history.length === 0) {
      this.historyList.innerHTML = `
        <div class="empty-history">
          No chat history yet
        </div>
      `;
      return;
    }

    this.historyList.innerHTML = history.map(item => `
      <div class="history-item" data-id="${item.id}">
        <div class="history-item-content">
          <div class="history-timestamp">${new Date(item.timestamp).toLocaleString()}</div>
          <div class="history-preview">${this.escapeHtml(item.message)}</div>
        </div>
        <button class="history-delete" title="Delete this conversation">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
          </svg>
        </button>
      </div>
    `).join('');

    this.setupHistoryListeners();
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  setupHistoryListeners() {
    const historyItems = document.querySelectorAll('.history-item');
    
    historyItems.forEach(item => {
      const deleteBtn = item.querySelector('.history-delete');
      const itemContent = item.querySelector('.history-item-content');
      
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(item.dataset.id);
        
        // Add delete animation
        item.style.transform = 'translateX(100%)';
        item.style.opacity = '0';
        
        setTimeout(() => {
          this.deleteHistoryItem(id);
        }, 300);
      });

      itemContent.addEventListener('click', () => {
        const history = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const historyItem = history.find(h => h.id === parseInt(item.dataset.id));
        
        if (historyItem) {
          // Load this conversation into the chat
          document.getElementById('userInput').value = historyItem.fullMessage;
          
          // Switch to chat page
          document.querySelector('a[data-page="chat"]').click();
          
          // Focus on input
          document.getElementById('userInput').focus();
        }
      });
    });
  }
}

// Initialize the new features
document.addEventListener('DOMContentLoaded', () => {
  // Defer non-critical initializations
  requestIdleCallback(() => {
    const chat = new ChatUI();
    setupModals();
    const webSearch = new WebSearch();
  });
});

// Hamburger menu functionality
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const container = document.querySelector('.container');

hamburger.addEventListener('touchstart', (e) => {
  e.preventDefault();
  toggleSidebar();
}, { passive: false });

function toggleSidebar() {
  requestAnimationFrame(() => {
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('active');
    container.classList.toggle('shifted');
  });
}

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  sidebar.classList.toggle('active');
  container.classList.toggle('shifted');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && 
      !hamburger.contains(e.target) && 
      sidebar.classList.contains('active')) {
    hamburger.classList.remove('active');
    sidebar.classList.remove('active');
    container.classList.remove('shifted');
  }
});

// Prevent sidebar from closing when clicking inside it
sidebar.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Theme handling
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', debounce(() => {
  const newTheme = themeToggle.checked ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}, 100));

// Page navigation
const navLinks = document.querySelectorAll('.sidebar nav a');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetPage = link.getAttribute('data-page');
    
    // Update active states
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    pages.forEach(page => {
      const pageId = page.id.replace('Section', '');
      page.classList.toggle('active', pageId === targetPage);
    });

    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      hamburger.classList.remove('active');
      sidebar.classList.remove('active');
      container.classList.remove('shifted');
    }
  });
});

// Add some CSS for the toast notification
const style = document.createElement('style');
style.textContent = `
  .mode-toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    background: var(--secondary-color);
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    font-size: 1rem;
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s ease;
  }

  .mode-toast.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
`;
document.head.appendChild(style);