import { auth, db, FieldValue } from '../services/firebase.js';

export function initAuthUI() {
    const loginOverlay = document.getElementById('loginOverlay');
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');

    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');

    const regNameInput = document.getElementById('regName');
    const regEmailInput = document.getElementById('regEmail');
    const regPasswordInput = document.getElementById('regPassword');
    const registerSubmitBtn = document.getElementById('registerSubmitBtn');

    const logoutBtn = document.getElementById('logoutBtn');
    const navUserName = document.getElementById('navUserName');
    const navUserRole = document.getElementById('navUserRole');

    // Toggle views
    showRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    });

    showLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        registerView.style.display = 'none';
        loginView.style.display = 'block';
    });

    // Login logic
    loginSubmitBtn?.addEventListener('click', async () => {
        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            loginSubmitBtn.disabled = true;
            loginSubmitBtn.textContent = 'Signing in...';
            await auth.signInWithEmailAndPassword(email, password);
            loginOverlay.style.display = 'none';
        } catch (error) {
            console.error("Login error:", error);
            alert(error.message);
        } finally {
            loginSubmitBtn.disabled = false;
            loginSubmitBtn.textContent = 'Sign In';
        }
    });

    // Register logic
    registerSubmitBtn?.addEventListener('click', async () => {
        const name = regNameInput.value.trim();
        const email = regEmailInput.value.trim();
        const password = regPasswordInput.value;

        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            registerSubmitBtn.disabled = true;
            registerSubmitBtn.textContent = 'Creating account...';
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Initialize user doc in Firestore
            await db.collection('users').doc(user.uid).set({
                displayName: name,
                email: email,
                xp: 0,
                level: 1,
                badges: [],
                role: 'user',
                createdAt: FieldValue.serverTimestamp()
            });

            loginOverlay.style.display = 'none';
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.message);
        } finally {
            registerSubmitBtn.disabled = false;
            registerSubmitBtn.textContent = 'Create Account';
        }
    });

    // Logout logic
    logoutBtn?.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.reload();
        });
    });

    // Auth state listener for UI updates
    auth.onAuthStateChanged(user => {
        if (user) {
            loginOverlay.style.display = 'none';
            db.collection('users').doc(user.uid).get().then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    navUserName.textContent = data.displayName || user.email;
                    navUserRole.textContent = data.role === 'admin' ? 'Admin' : 'User';
                    if (data.role === 'admin') {
                        navUserRole.style.background = 'var(--lac)';
                    }
                }
            });
        } else {
            loginOverlay.style.display = 'flex';
            navUserName.textContent = 'Guest';
            navUserRole.textContent = 'User';
        }
    });
}
