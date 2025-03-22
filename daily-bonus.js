// New file to handle daily bonus functionality
import { CONFIG } from './config.js';

export class DailyBonusManager {
  constructor(walletManager) {
    this.walletManager = walletManager;
    this.lastCollectedDate = localStorage.getItem('lastBonusCollected') 
      ? new Date(localStorage.getItem('lastBonusCollected'))
      : null;
  }

  canCollectBonus() {
    if (!this.lastCollectedDate) return true;
    
    const now = new Date();
    const timeDiff = now - this.lastCollectedDate;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff >= 24;
  }

  getTimeUntilNextBonus() {
    if (!this.lastCollectedDate) return '00:00:00';
    
    const now = new Date();
    const nextBonus = new Date(this.lastCollectedDate);
    nextBonus.setHours(nextBonus.getHours() + 24);
    
    const timeDiff = nextBonus - now;
    if (timeDiff <= 0) return '00:00:00';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  collectBonus() {
    if (!this.canCollectBonus()) return false;
    
    this.walletManager.addBalance(CONFIG.DAILY_BONUS_AMOUNT);
    this.lastCollectedDate = new Date();
    localStorage.setItem('lastBonusCollected', this.lastCollectedDate.toISOString());
    return true;
  }
}