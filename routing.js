// Update routing.js to import the createEbooksView function
import { createEbooksView } from './ebooks.js';

export function setupRouting() {
  return {
    navigateTo(route) {
      switch(route) {
        case 'ebooks':
          this.showCoursePage = false;
          this.showEbooksPage = true; 
          this.showHomeContent = false; 
          this.currentSection = null;
          
          // Add slight delay to ensure DOM is ready
          setTimeout(() => {
            const ebooksContainer = document.querySelector('#ebooks-page');
            if (ebooksContainer) {
              ebooksContainer.innerHTML = '';
              const ebooksView = createEbooksView();
              ebooksContainer.appendChild(ebooksView);
            }
          }, 100);
          break;
          
        case 'courses':
          this.showCoursePage = true;
          this.showEbooksPage = false;
          this.showHomeContent = false; 
          this.currentSection = null;
          break;
          
        case 'home':
          this.showCoursePage = false;
          this.showEbooksPage = false;
          this.showHomeContent = true; 
          this.currentSection = 'featured';
          break;
      }
      
      this.isNavActive = false;
      document.body.style.overflow = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
}