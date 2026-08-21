/**
 * Instagram Login Page Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements - Inputs & Form
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const clearUsernameBtn = document.getElementById('clearUsernameBtn');
    const pwToggleBtn = document.getElementById('pwToggleBtn');
    const loginBtn = document.getElementById('loginBtn');
    const loginSpinner = document.getElementById('loginSpinner');
    const btnText = loginBtn.querySelector('.btn-text');

    // UI Elements - Cards & Toggle Links
    const loginCard = document.getElementById('loginCard');
    const signupCard = document.getElementById('signupCard');
    const signupPromptCard = document.getElementById('signupPromptCard');
    const loginPromptCard = document.getElementById('loginPromptCard');
    const signupLink = document.getElementById('signupLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const createNewAccountLink = document.getElementById('createNewAccountLink');

    // UI Elements - Theme Toggle
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const sunIcon = themeToggleBtn.querySelector('.sun-icon');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');

    // UI Elements - Modals
    const fbLoginBtn = document.getElementById('fbLoginBtn');
    const fbSignupBtn = document.getElementById('fbSignupBtn');
    const fbModal = document.getElementById('fbModal');
    const closeFbModalBtn = document.getElementById('closeFbModalBtn');
    const cancelFbLoginBtn = document.getElementById('cancelFbLoginBtn');
    const confirmFbLoginBtn = document.getElementById('confirmFbLoginBtn');

    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotModal = document.getElementById('forgotModal');
    const closeForgotModalBtn = document.getElementById('closeForgotModalBtn');
    const sendResetBtn = document.getElementById('sendResetBtn');
    const forgotInput = document.getElementById('forgotInput');

    const toastContainer = document.getElementById('toastContainer');

    // --- 1. FLOATING LABELS & INPUT VALIDATION --- //
    const updateInputState = (input, wrapper) => {
        if (input.value.trim().length > 0) {
            wrapper.classList.add('has-value');
        } else {
            wrapper.classList.remove('has-value');
        }
        validateForm();
    };

    const validateForm = () => {
        const userVal = usernameInput.value.trim();
        const passVal = passwordInput.value;

        // Toggle clear button for username
        if (userVal.length > 0) {
            clearUsernameBtn.classList.remove('hidden');
        } else {
            clearUsernameBtn.classList.add('hidden');
        }

        // Toggle password show/hide button
        if (passVal.length > 0) {
            pwToggleBtn.classList.remove('hidden');
        } else {
            pwToggleBtn.classList.add('hidden');
        }

        // Enable login button if username is filled and password has >= 6 chars
        if (userVal.length > 0 && passVal.length >= 6) {
            loginBtn.removeAttribute('disabled');
        } else {
            loginBtn.setAttribute('disabled', 'true');
        }
    };

    // Attach listeners to username field
    const userWrapper = usernameInput.parentElement;
    usernameInput.addEventListener('input', () => updateInputState(usernameInput, userWrapper));
    usernameInput.addEventListener('focus', () => userWrapper.classList.add('has-value'));
    usernameInput.addEventListener('blur', () => {
        if (usernameInput.value.trim() === '') {
            userWrapper.classList.remove('has-value');
        }
    });

    clearUsernameBtn.addEventListener('click', () => {
        usernameInput.value = '';
        updateInputState(usernameInput, userWrapper);
        usernameInput.focus();
    });

    // Attach listeners to password field
    const passWrapper = passwordInput.parentElement;
    passwordInput.addEventListener('input', () => updateInputState(passwordInput, passWrapper));
    passwordInput.addEventListener('focus', () => passWrapper.classList.add('has-value'));
    passwordInput.addEventListener('blur', () => {
        if (passwordInput.value === '') {
            passWrapper.classList.remove('has-value');
        }
    });

    // --- 2. SHOW / HIDE PASSWORD --- //
    pwToggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        pwToggleBtn.textContent = isPassword ? 'Hide' : 'Show';
        pwToggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });

    // --- 3. LOGIN SUBMISSION SIMULATION --- //
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userVal = usernameInput.value.trim();
        const passVal = passwordInput.value;

        if (!userVal || passVal.length < 6) {
            loginCard.classList.add('shake');
            setTimeout(() => loginCard.classList.remove('shake'), 450);
            return;
        }

        // Start loading state
        loginBtn.setAttribute('disabled', 'true');
        btnText.classList.add('hidden');
        loginSpinner.classList.remove('hidden');

        setTimeout(() => {
            // Reset loading state
            loginSpinner.classList.add('hidden');
            btnText.classList.remove('hidden');
            loginBtn.removeAttribute('disabled');

            // Show toast feedback
            showToast(`Demo Mode: Welcome back, @${userVal}! Log in simulated successfully.`);
        }, 1200);
    });

    // --- 4. SIGN UP CARD SWITCHER --- //
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginCard.classList.add('hidden');
        signupPromptCard.classList.add('hidden');
        signupCard.classList.remove('hidden');
        loginPromptCard.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupCard.classList.add('hidden');
        loginPromptCard.classList.add('hidden');
        loginCard.classList.remove('hidden');
        signupPromptCard.classList.remove('hidden');
    });

    createNewAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(forgotModal);
        signupLink.click();
    });

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.querySelectorAll('.form-input').forEach(input => {
            const wrapper = input.parentElement;
            input.addEventListener('input', () => {
                if (input.value.trim().length > 0) {
                    wrapper.classList.add('has-value');
                } else {
                    wrapper.classList.remove('has-value');
                }
            });
        });

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Demo Mode: Account registration simulated successfully!');
            showLoginLink.click();
        });
    }

    // --- 5. THEME TOGGLE (LIGHT / DARK) --- //
    const savedTheme = localStorage.getItem('insta_theme') || 'light';
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    });

    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('insta_theme', theme);
        if (theme === 'dark') {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }

    // --- 6. PHONE SHOWCASE SLIDESHOW --- //
    const slides = document.querySelectorAll('.phone-screen .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000);
    }

    // --- 7. MODALS & FACEBOOK AUTH --- //
    const openModal = (modal) => modal.classList.remove('hidden');
    const closeModal = (modal) => modal.classList.add('hidden');

    fbLoginBtn.addEventListener('click', () => openModal(fbModal));
    if (fbSignupBtn) fbSignupBtn.addEventListener('click', () => openModal(fbModal));
    closeFbModalBtn.addEventListener('click', () => closeModal(fbModal));
    cancelFbLoginBtn.addEventListener('click', () => closeModal(fbModal));

    confirmFbLoginBtn.addEventListener('click', () => {
        closeModal(fbModal);
        showToast('Demo Mode: Facebook Single Sign-On authenticated!');
    });

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(forgotModal);
    });

    closeForgotModalBtn.addEventListener('click', () => closeModal(forgotModal));

    sendResetBtn.addEventListener('click', () => {
        const val = forgotInput.value.trim();
        if (!val) {
            forgotInput.focus();
            return;
        }
        closeModal(forgotModal);
        showToast(`Login link sent to "${val}". Check your inbox!`);
        forgotInput.value = '';
    });

    // Close modal on clicking backdrop
    [fbModal, forgotModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // --- 8. TOAST NOTIFICATIONS --- //
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-out');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3500);
    }
});
