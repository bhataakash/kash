// New file to handle course purchase UI and logic
export function createPurchaseModal(courseDetails) {
    const modal = document.createElement('div');
    modal.className = 'purchase-modal';
    modal.innerHTML = `
        <div class="purchase-container">
            <div class="purchase-header">
                <h2>Complete Your Purchase</h2>
                <button class="close-purchase"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="course-summary">
                <img src="${courseDetails.image}" alt="${courseDetails.title}" class="purchase-course-image">
                <div class="course-info">
                    <h3>${courseDetails.title}</h3>
                    <div class="price-info">
                        <span class="original">₹${courseDetails.originalPrice}</span>
                        <span class="discounted">₹${courseDetails.discountedPrice}</span>
                    </div>
                </div>
            </div>

            <form class="purchase-form">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" required placeholder="Enter your full name">
                </div>
                
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" required placeholder="Enter your email">
                </div>
                
                <div class="coupon-section">
                    <div class="form-group">
                        <label>Coupon Code</label>
                        <div class="coupon-input">
                            <input type="text" placeholder="Enter coupon code">
                            <button type="button" class="apply-coupon">Apply</button>
                        </div>
                    </div>
                    <div class="coupon-message"></div>
                </div>
                
                <div class="price-summary">
                    <div class="price-row">
                        <span>Original Price:</span>
                        <span>₹${courseDetails.originalPrice}</span>
                    </div>
                    <div class="price-row discount" style="display: none;">
                        <span>Discount (5%):</span>
                        <span>-₹0</span>
                    </div>
                    <div class="price-row total">
                        <span>Total:</span>
                        <span>₹${courseDetails.discountedPrice}</span>
                    </div>
                </div>

                <button type="submit" class="dm-order-btn">PLACE ORDER</button>
            </form>
        </div>
    `;

    return modal;
}

export function initializePurchaseHandlers(modal, courseDetails) {
    const form = modal.querySelector('.purchase-form');
    const closeBtn = modal.querySelector('.close-purchase');
    const applyBtn = modal.querySelector('.apply-coupon');
    const couponInput = modal.querySelector('.coupon-input input');
    const couponMessage = modal.querySelector('.coupon-message');
    const priceDisplay = modal.querySelector('.price-summary');
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    applyBtn.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        if (code === 'BUZZ07') {
            const discount = courseDetails.discountedPrice * 0.05;
            const newTotal = courseDetails.discountedPrice - discount;
            
            priceDisplay.querySelector('.discount').style.display = 'flex';
            priceDisplay.querySelector('.discount span:last-child').textContent = `-₹${discount.toFixed(2)}`;
            priceDisplay.querySelector('.total span:last-child').textContent = `₹${newTotal.toFixed(2)}`;
            
            couponMessage.textContent = 'Coupon applied successfully!';
            couponMessage.style.color = 'green';
        } else {
            couponMessage.textContent = 'Invalid coupon code';
            couponMessage.style.color = 'red';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
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
            // Remove popups
            successPopup.remove();
            modal.remove();
            
            // Open Telegram in new tab
            window.open('https://t.me/anonymousmrak', '_blank');
        }, 2000);
    });
}