const formTitle = document.getElementById('formTitle');
const toggleLink = document.querySelector('.toggle-link');
const formType = document.getElementById('formType');
const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
const form = document.getElementById('authForm');

let isSignUp = false;

function toggleForm() {
  isSignUp = !isSignUp;
  formTitle.textContent = isSignUp ? 'Sign Up' : 'Sign In';
  toggleLink.textContent = isSignUp
    ? 'Already have an account? Sign In'
    : "Don't have an account? Sign Up";
  formType.value = isSignUp ? "Sign Up" : "Sign In";
  confirmPasswordGroup.style.display = isSignUp ? 'block' : 'none';
}

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword')?.value.trim();

  if (isSignUp) {
    if (!confirmPassword || password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Save to localStorage (for demo purposes)
    localStorage.setItem(`user_${email}`, password);

    // 🔁 Send data to Formcarry
    const FORMCARRY_ENDPOINT = "https://formcarry.com/s/AYwj_OXdzKo"; // Replace if needed
    try {
      const response = await fetch(FORMCARRY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json(); // 👈 read Formcarry's JSON response

      if (response.ok) {
        alert("✅ Account created successfully via Formcarry!");
        toggleForm();
      } else {
        console.error(result);
        alert("❌ Formcarry error: " + (result.message || "Something went wrong"));
      }
    } catch (err) {
      alert("⚠️ Formcarry submission failed: " + err.message);
    }

  } else {
    // Sign In logic
    const storedPassword = localStorage.getItem(`user_${email}`);
    if (!storedPassword) {
      alert("User not found. Please sign up.");
      toggleForm();
      return;
    }

    if (storedPassword !== password) {
      alert("Incorrect password.");
      return;
    }

    alert("Login successful! 🎉");
    setTimeout(() => {
      localStorage.setItem("currentUser", email); // store user info
      window.location.href = "Main.html"; // Redirect
    }, 1000);
  }
});
