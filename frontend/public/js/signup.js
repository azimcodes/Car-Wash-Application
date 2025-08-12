console.log("signup.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      const messageEl = document.getElementById("message");

      if (res.ok) {
        messageEl.style.color = "green";
        messageEl.textContent = "✅ Signup successful!";
        e.target.reset();
      } else {
        messageEl.style.color = "red";
        messageEl.textContent = `❌ ${data.message || "Signup failed"}`;
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("message").textContent = "❌ Something went wrong.";
    }
  });
});
