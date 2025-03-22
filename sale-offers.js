// New file to handle seasonal offers
export class OfferManager {
  constructor() {
    this.offers = {
      ramadan: {
        discount: 35,
        title: 'Ramadan Special',
        endDate: new Date('March 31, 2025 23:59:59'),
        description: 'Special Ramadan discount on all courses!'
      },
      eid: {
        discount: 50,
        title: 'Eid Mubarak',
        duration: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
        description: 'Celebrate Eid with our biggest discount ever!'
      }
    };
  }

  calculateTimeRemaining(endDate) {
    const now = new Date().getTime();
    const distance = endDate - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    return {
      total: distance,
      days,
      hours,
      minutes,
      seconds
    };
  }

  getCurrentOffer() {
    const now = new Date().getTime();
    const ramadanEnd = this.offers.ramadan.endDate.getTime();
    
    if (now < ramadanEnd) {
      return {
        ...this.offers.ramadan,
        type: 'ramadan',
        timeRemaining: this.calculateTimeRemaining(ramadanEnd)
      };
    } else if (now < ramadanEnd + this.offers.eid.duration) {
      const eidEnd = new Date(ramadanEnd + this.offers.eid.duration);
      return {
        ...this.offers.eid,
        type: 'eid',
        timeRemaining: this.calculateTimeRemaining(eidEnd.getTime())
      };
    }
    return null;
  }
}
