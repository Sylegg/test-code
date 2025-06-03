class AuthService {
    constructor() {
        this.users = [];
        this.loadUsers();
    }

    // Load users from localStorage
    loadUsers() {
        try {
            const usersStr = localStorage.getItem('users');
            this.users = usersStr ? JSON.parse(usersStr) : [];
        } catch (error) {
            console.error('Error loading users:', error);
            this.users = [];
        }
    }

    // Save users to localStorage
    saveUsers() {
        try {
            localStorage.setItem('users', JSON.stringify(this.users));
        } catch (error) {
            console.error('Error saving users:', error);
            throw error;
        }
    }

    // Register a new user
    async register(userData) {
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'password', 'bloodType', 'phone', 'address'];
        for (const field of requiredFields) {
            if (!userData[field]) {
                throw new Error(`${field} is required`);
            }
        }

        // Check if email already exists
        if (this.users.some(user => user.email === userData.email)) {
            throw new Error('Email already registered');
        }

        // Validate password
        if (userData.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        // Create new user object
        const newUser = {
            id: Date.now().toString(), // Simple unique ID
            ...userData,
            password: await this.hashPassword(userData.password), // Hash password before storing
            createdAt: new Date().toISOString()
        };

        // Add user to array
        this.users.push(newUser);

        // Save to localStorage
        this.saveUsers();

        return { success: true, message: 'Registration successful' };
    }

    // Login user
    async login(email, password) {
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await this.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        // Create session
        const session = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            bloodType: user.bloodType
        };

        // Store session in localStorage
        localStorage.setItem('currentUser', JSON.stringify(session));
        localStorage.setItem('isLoggedIn', 'true');

        return { success: true, user: session };
    }

    // Logout user
    logout() {
        try {
            // Clear all user-related data from localStorage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('redirectAfterLogin');
            
            // Clear any session data
            sessionStorage.clear();
            
            // Update navbar if it exists
            if (typeof updateUserProfile === 'function') {
                updateUserProfile();
            }

            // Show logout success message
            const message = 'Đăng xuất thành công!';
            
            // If we're on a protected page, redirect to home
            const currentPath = window.location.pathname;
            const protectedPages = ['/donate.html', '/blood-compatibility.html', '/blood-search.html', '/emergency-request.html', '/profile.html', '/donation-history.html'];
            
            if (protectedPages.some(page => currentPath.includes(page))) {
                // Store message in sessionStorage to show after redirect
                sessionStorage.setItem('logoutMessage', message);
                window.location.href = 'index.html';
            } else {
                // Show message and redirect
                alert(message);
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.');
        }
    }

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Simple password hashing (in a real app, use a proper hashing library)
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Verify password
    async verifyPassword(password, hashedPassword) {
        const hashedInput = await this.hashPassword(password);
        return hashedInput === hashedPassword;
    }
}

// Create global auth instance
const auth = new AuthService(); 