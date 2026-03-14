// Data dummy untuk simulasi
const VALID_CREDENTIALS = {
    username: 'ivas_user',
    password: 'ivas123'
};

// State management
let timerInterval;
let timeLeft = 60;
let isLoggedIn = false;

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Move to next OTP input
function moveToNext(current, index) {
    const inputs = document.querySelectorAll('.otp-input');
    
    // Only allow numbers
    current.value = current.value.replace(/[^0-9]/g, '');
    
    if (current.value.length === 1) {
        // Move to next input
        if (index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    }
    
    // Check if all OTP fields are filled
    checkOTPComplete();
}

// Check if all OTP fields are filled
function checkOTPComplete() {
    const inputs = document.querySelectorAll('.otp-input');
    const verifyBtn = document.getElementById('verifyBtn');
    let isComplete = true;
    
    inputs.forEach(input => {
        if (input.value.length === 0) {
            isComplete = false;
        }
    });
    
    verifyBtn.disabled = !isComplete;
}

// Show alert message
function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.className = 'alert ' + type;
    alert.textContent = message;
    alert.style.display = 'block';
    
    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}

// Start timer for OTP
function startTimer() {
    const timer = document.getElementById('timer');
    const timerText = document.getElementById('timerText');
    const resendBtn = document.getElementById('resendBtn');
    
    timeLeft = 60;
    timer.textContent = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerText.style.display = 'none';
            timer.style.display = 'none';
            resendBtn.style.display = 'flex';
            
            // Disable OTP inputs
            document.querySelectorAll('.otp-input').forEach(input => {
                input.disabled = true;
            });
        }
    }, 1000);
}

// Reset OTP section
function resetOTP() {
    document.querySelectorAll('.otp-input').forEach(input => {
        input.value = '';
        input.disabled = false;
    });
    
    document.getElementById('verifyBtn').disabled = true;
    document.getElementById('timerText').style.display = 'inline';
    document.getElementById('timer').style.display = 'inline';
    document.getElementById('resendBtn').style.display = 'none';
    document.getElementById('timer').textContent = '60';
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    startTimer();
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    
    // Simulate loading
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    
    setTimeout(() => {
        if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
            showAlert('Login berhasil! Masukkan kode OTP', 'success');
            
            // Show OTP section
            document.getElementById('otpSection').style.display = 'block';
            document.getElementById('otpSection').scrollIntoView({ behavior: 'smooth' });
            
            // Reset and start OTP timer
            resetOTP();
            
            // Focus first OTP input
            document.querySelector('.otp-input').focus();
        } else {
            showAlert('Username atau password salah!', 'error');
        }
        
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<span>Masuk</span><i class="fas fa-arrow-right"></i>';
    }, 1500);
});

// Handle OTP verification
document.getElementById('verifyBtn').addEventListener('click', function() {
    const otpValues = [];
    document.querySelectorAll('.otp-input').forEach(input => {
        otpValues.push(input.value);
    });
    
    const otp = otpValues.join('');
    
    // Simulate OTP verification
    if (otp === '123456') {
        showAlert('Verifikasi OTP berhasil! Selamat datang di IVAS', 'success');
        
        // Reset form after success
        setTimeout(() => {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('otpSection').style.display = 'none';
            document.getElementById('alert').style.display = 'none';
            
            // Clear OTP inputs
            document.querySelectorAll('.otp-input').forEach(input => {
                input.value = '';
            });
        }, 2000);
    } else {
        showAlert('Kode OTP salah! Coba lagi', 'error');
    }
});

// Handle resend OTP
document.getElementById('resendBtn').addEventListener('click', function() {
    showAlert('Kode OTP baru telah dikirim', 'info');
    resetOTP();
});

// Auto-focus first input on page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('username').focus();
});

// Handle paste for OTP inputs
document.querySelectorAll('.otp-input').forEach((input, index) => {
    input.addEventListener('paste', function(e) {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const numbers = paste.replace(/[^0-9]/g, '').split('');
        
        if (numbers.length > 0) {
            const inputs = document.querySelectorAll('.otp-input');
            numbers.forEach((num, i) => {
                if (i < inputs.length) {
                    inputs[i].value = num;
                }
            });
            
            // Focus next empty input or last input
            const nextEmpty = Array.from(inputs).find(input => input.value === '');
            if (nextEmpty) {
                nextEmpty.focus();
            } else {
                inputs[inputs.length - 1].focus();
            }
            
            checkOTPComplete();
        }
    });
});

// Handle backspace for OTP inputs
document.querySelectorAll('.otp-input').forEach((input, index) => {
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
            const inputs = document.querySelectorAll('.otp-input');
            inputs[index - 1].focus();
        }
    });
});

// Add loading state to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        if (this.classList.contains('login-btn') || this.classList.contains('verify-btn')) {
            if (this.disabled) {
                e.preventDefault();
            }
        }
    });
});
