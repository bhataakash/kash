// New file to handle loading animation logic
export function initializeLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  
  // Hide loading screen after 3 seconds
  setTimeout(() => {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 3000);
}