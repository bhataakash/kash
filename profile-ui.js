export function createProfileModal() {
    // Generate random ID
    const generateUserId = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';
        for(let i = 0; i < 8; i++) {
            id += chars[Math.floor(Math.random() * chars.length)];
        }
        return id;
    };

    // Get or generate user ID
    const userId = localStorage.getItem('userId') || generateUserId();
    localStorage.setItem('userId', userId);

    const modal = document.createElement('div');
    modal.className = 'profile-modal';
    modal.innerHTML = `
        <div class="profile-container">
            <div class="profile-header">
                <h2><i class="fas fa-user-circle"></i> Edit Profile</h2>
                <button class="close-button"><i class="fas fa-times"></i></button>
            </div>
            
            <form class="profile-form">
                <div class="profile-photo-section">
                    <div class="profile-photo-container">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" 
                             alt="Profile Photo" 
                             class="profile-photo"
                             id="profile-photo">
                        <div class="photo-overlay">
                            <i class="fas fa-camera"></i>
                            <span>Change Photo</span>
                        </div>
                    </div>
                    <div class="user-id">
                        <span class="status-dot"></span>
                        <span class="user-id-text">ID: ${userId}</span>
                    </div>
                    <input type="file" 
                           id="photo-upload" 
                           accept="image/*" 
                           style="display: none;">
                </div>

                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" required placeholder="Enter username">
                </div>
                
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" required placeholder="Enter full name">
                </div>
                
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required placeholder="Enter email">
                </div>
                
                <button type="submit" class="update-profile-btn">
                    <i class="fas fa-check"></i> Update Profile
                </button>
            </form>
        </div>
    `;

    const photoContainer = modal.querySelector('.profile-photo-container');
    const fileInput = modal.querySelector('#photo-upload');
    const profileImage = modal.querySelector('#profile-photo');
    const form = modal.querySelector('.profile-form');

    // Load existing profile data
    const savedProfileData = JSON.parse(localStorage.getItem('profileData') || '{}');
    
    // Set saved photo if exists
    if (savedProfileData.photo) {
        profileImage.src = savedProfileData.photo;
    }
    
    // Set saved form values if they exist
    if (savedProfileData.username) {
        form.querySelector('input[name="username"]').value = savedProfileData.username;
    }
    if (savedProfileData.fullName) {
        form.querySelector('input[name="fullName"]').value = savedProfileData.fullName;
    }
    if (savedProfileData.email) {
        form.querySelector('input[name="email"]').value = savedProfileData.email;
    }

    photoContainer.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            username: form.querySelector('input[name="username"]').value,
            fullName: form.querySelector('input[name="fullName"]').value,
            email: form.querySelector('input[name="email"]').value,
            photo: profileImage.src
        };

        // Save profile data
        localStorage.setItem('profileData', JSON.stringify(formData));

        // Show success popup
        const popup = document.createElement('div');
        popup.className = 'profile-success-popup';
        popup.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Profile Updated!</h3>
            <p>Your profile has been successfully updated.</p>
        `;
        document.body.appendChild(popup);

        // Remove popup after animation
        setTimeout(() => {
            popup.remove();
            modal.remove();
        }, 2000);
    });

    modal.querySelector('.close-button').addEventListener('click', () => {
        modal.remove();
    });

    return modal;
}