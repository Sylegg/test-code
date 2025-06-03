// Function to update user profile in navbar
function updateUserProfile() {
    // Update desktop profile
    const userProfile = document.getElementById('userProfile');
    const userInitials = document.getElementById('userInitials');
    const userFullName = document.getElementById('userFullName');
    const userEmail = document.getElementById('userEmail');
    const userBloodType = document.getElementById('userBloodType');
    
    // Update mobile profile
    const mobileUserProfile = document.getElementById('mobileUserProfile');
    const mobileUserInitials = document.getElementById('mobileUserInitials');
    const mobileUserFullName = document.getElementById('mobileUserFullName');
    const mobileUserEmail = document.getElementById('mobileUserEmail');
    const mobileUserBloodType = document.getElementById('mobileUserBloodType');
    
    const currentUser = auth.getCurrentUser();

    if (currentUser) {
        // Calculate initials
        const initials = (currentUser.firstName[0] + currentUser.lastName[0]).toUpperCase();
        const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
        const email = currentUser.email;
        const bloodType = `Nhóm máu: ${currentUser.bloodType}`;

        // Update desktop profile
        if (userProfile) {
            userProfile.style.display = 'block';
            if (userInitials) userInitials.textContent = initials;
            if (userFullName) userFullName.textContent = fullName;
            if (userEmail) userEmail.textContent = email;
            if (userBloodType) userBloodType.textContent = bloodType;
        }

        // Update mobile profile
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
            if (mobileUserInitials) mobileUserInitials.textContent = initials;
            if (mobileUserFullName) mobileUserFullName.textContent = fullName;
            if (mobileUserEmail) mobileUserEmail.textContent = email;
            if (mobileUserBloodType) mobileUserBloodType.textContent = bloodType;
        }
    } else {
        // Hide profiles
        if (userProfile) userProfile.style.display = 'none';
        if (mobileUserProfile) mobileUserProfile.style.display = 'none';
    }
}

// Initialize navbar functionality
function initNavbar() {
    // Check for logout message
    const logoutMessage = sessionStorage.getItem('logoutMessage');
    if (logoutMessage) {
        alert(logoutMessage);
        sessionStorage.removeItem('logoutMessage');
    }

    // Toggle user dropdown
    const userIcon = document.getElementById('userIcon');
    if (userIcon) {
        userIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('userDropdown').classList.toggle('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('userDropdown');
        const userIcon = document.getElementById('userIcon');
        if (dropdown && userIcon && !userIcon.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });

    // Handle navbar logout button
    const navbarLogoutBtn = document.getElementById('navbarLogoutBtn');
    if (navbarLogoutBtn) {
        navbarLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                auth.logout();
            }
        });
    }

    // Handle dropdown logout button
    const dropdownLogoutBtn = document.getElementById('logoutBtn');
    if (dropdownLogoutBtn) {
        dropdownLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                auth.logout();
            }
        });
    }

    // Update user profile on page load
    updateUserProfile();

    // Check if user is on a protected page
    const currentPath = window.location.pathname;
    const protectedPages = ['/donate.html', '/blood-compatibility.html', '/blood-search.html', '/emergency-request.html', '/profile.html', '/donation-history.html'];
    
    if (protectedPages.some(page => currentPath.includes(page))) {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            localStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
        }
    }
}

// Add navbar styles
function addNavbarStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .user-profile {
            position: relative;
            display: none;
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .user-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #ff4d4d;
            font-weight: bold;
            font-size: 1.2rem;
            border: 2px solid #fff;
            transition: all 0.3s ease;
        }

        .user-icon:hover {
            transform: scale(1.1);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .logout-button {
            background-color: transparent;
            color: white;
            border: 2px solid white;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .logout-button:hover {
            background-color: white;
            color: #ff4d4d;
        }

        .logout-button i {
            font-size: 1.1rem;
        }

        .user-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            min-width: 200px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            margin-top: 0.5rem;
            display: none;
            z-index: 1000;
        }

        .user-dropdown.active {
            display: block;
        }

        .user-info {
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
            margin-bottom: 1rem;
        }

        .user-info h3 {
            color: #333;
            font-size: 1rem;
            margin-bottom: 0.5rem;
        }

        .user-info p {
            color: #666;
            font-size: 0.9rem;
            margin: 0.2rem 0;
        }

        .user-dropdown a {
            color: #333;
            text-decoration: none;
            display: block;
            padding: 0.5rem 0;
            transition: color 0.3s ease;
        }

        .user-dropdown a:hover {
            color: #ff4d4d;
        }

        .logout-btn {
            color: #ff4d4d !important;
            border-top: 1px solid #eee;
            margin-top: 0.5rem;
            padding-top: 0.5rem;
        }
    `;
    document.head.appendChild(style);
}

// Add navbar HTML
function addNavbarHTML() {
    const navLinks = document.querySelector('.nav-links');
    const mobileNavLinks = document.querySelector('.mobile-nav-links');
    
    // Only add desktop profile if it doesn't exist
    if (navLinks && !document.getElementById('userProfile')) {
        const userProfileHTML = `
            <div class="user-profile" id="userProfile">
                <div class="user-icon" id="userIcon">
                    <span id="userInitials"></span>
                </div>
                <div class="user-dropdown" id="userDropdown">
                    <div class="user-info">
                        <h3 id="userFullName"></h3>
                        <p id="userEmail"></p>
                        <p id="userBloodType"></p>
                    </div>
                    <a href="profile.html">Thông tin cá nhân</a>
                    <a href="donation-history.html">Lịch sử hiến máu</a>
                    <a href="#" class="logout-btn" id="logoutBtn">Đăng xuất</a>
                </div>
            </div>
        `;
        navLinks.insertAdjacentHTML('beforeend', userProfileHTML);
    }

    // Only add mobile profile if it doesn't exist
    if (mobileNavLinks && !document.getElementById('mobileUserProfile')) {
        const mobileUserProfileHTML = `
            <div class="user-profile" id="mobileUserProfile">
                <div class="user-icon" id="mobileUserIcon">
                    <span id="mobileUserInitials"></span>
                </div>
                <div class="user-dropdown" id="mobileUserDropdown">
                    <div class="user-info">
                        <h3 id="mobileUserFullName"></h3>
                        <p id="mobileUserEmail"></p>
                        <p id="mobileUserBloodType"></p>
                    </div>
                    <a href="profile.html">Thông tin cá nhân</a>
                    <a href="donation-history.html">Lịch sử hiến máu</a>
                    <a href="#" class="logout-btn" id="mobileLogoutBtn">Đăng xuất</a>
                </div>
            </div>
        `;
        mobileNavLinks.insertAdjacentHTML('beforeend', mobileUserProfileHTML);
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addNavbarStyles();
    addNavbarHTML();
    initNavbar();
}); 