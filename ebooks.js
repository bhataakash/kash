export function createEbooksView() {
  const ebooksSection = document.createElement('section');
  ebooksSection.className = 'ebooks-page';
  
  const books = [
    {
      title: 'ChatGPT For Beginners: A Step-By-Step Guide To Mastering AI Conversations',
      pages: 139,
      originalPrice: 99,
      discountedPrice: 49,
      image: '67db05f6976a6-chatgpt-for-beginners-a-step-by-step-guide-to-mast-screenshot1.webp'
    },
    {
      title: 'Mastering the Art of Faceless Marketing',
      pages: 115,
      originalPrice: 99,
      discountedPrice: 49,
      image: '67d0a3c35ada9-mastering-the-art-of-faceless-marketing-building-a-screenshot1.webp'
    },
    {
      title: 'Mastering Kali Linux: The Ultimate Guide to Penetration Testing',
      pages: 582,
      originalPrice: 199,
      discountedPrice: 99,
      image: '67d0a379357df-mastering-kali-linux-the-ultimate-guide-to-penetra-screenshot1.webp'
    },
    {
      title: 'Master Prompt Engineering',
      pages: 197,
      originalPrice: 99,
      discountedPrice: 49,
      image: '67cb5f0758062-master-prompt-engineering-kindle-edition-screenshot1.webp'
    }
  ];

  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'ebook-card';
    bookCard.innerHTML = `
      <div class="crown-icon">
        <i class="fas fa-crown"></i>
      </div>
      <img src="${book.image}" alt="${book.title}" class="ebook-image">
      <div class="ebook-content">
        <h2 class="ebook-title">${book.title}</h2>
        <div class="ebook-details">
          <span class="pages"><i class="fas fa-book-open"></i> ${book.pages} pages</span>
        </div>
        <div class="ebook-price">
          <span class="original-price">₹${book.originalPrice}</span>
          <span class="discounted-price">₹${book.discountedPrice}</span>
        </div>
        <button class="download-button" onclick="window.openTelegramChat()">
          <i class="fas fa-shopping-cart"></i> Buy
        </button>
      </div>
    `;
    
    ebooksSection.appendChild(bookCard);
  });

  // Add global function for Telegram redirect
  window.openTelegramChat = () => {
    // Show success message
    const successPopup = document.createElement('div');
    successPopup.className = 'purchase-success-popup';
    successPopup.innerHTML = `
      <div class="success-content">
        <i class="fas fa-check-circle"></i>
        <h3>Order Placed Successfully!</h3>
        <p>Redirecting you to our Telegram for further instructions...</p>
      </div>
    `;
    document.body.appendChild(successPopup);
    
    // Wait a moment before redirecting
    setTimeout(() => {
      successPopup.remove();
      window.open('https://t.me/anonymousmrak', '_blank');
    }, 2000);
  };

  return ebooksSection;
}