    document.addEventListener("DOMContentLoaded", () => {
      const bmiValue = 38.1;
      const calorieValue = 1824;
      const waterLiters = 3.3;

      // Animate BMI Pointer
      const pointer = document.querySelector(".pointer");
      const bmiText = document.getElementById("bmi-value");
      pointer.style.transition = "left 1.5s ease";
      pointer.style.left = `${Math.min((bmiValue / 40) * 100, 100)}%`;

      animateCount(bmiText, bmiValue, " BMI", true);
      animateCount(document.getElementById("calories"), calorieValue, " kcal");
      animateCount(document.getElementById("water"), waterLiters, " l", true);

      const cups = document.querySelectorAll(".cup");
      const filled = Math.floor(waterLiters);
      const partial = waterLiters - filled;

      cups.forEach((cup, i) => {
        if (i < filled) cup.classList.add("filled");
        else if (i === filled && partial >= 0.25) cup.classList.add("filled", "partial");
      });

      function animateCount(el, target, suffix = "", isFloat = false) {
        let count = 0;
        const step = target / 60;
        const interval = setInterval(() => {
          count += step;
          if (count >= target) {
            count = target;
            clearInterval(interval);
          }
          el.textContent = isFloat ? count.toFixed(1) + suffix : Math.floor(count) + suffix;
        }, 30);
      }
    });

      document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("nav-links").classList.toggle("active");
  });

const GEMINI_API_KEY = "AIzaSyDTkO6p5M9o0dcSS6D8SiudNMUmZoRClv4"; // Replace with your new Gemini API Key

// Toggle Chatbot
function toggleChat() {
  const chat = document.getElementById("chatbot-container");
  chat.style.display = (chat.style.display === "flex") ? "none" : "flex";
}

// Handle Enter Key
function handleKey(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

// Send User Message to Gemini API with typing animation
async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("You", message);
  input.value = "";

  // Show typing indicator
  const typingId = appendTypingIndicator("AI Fit");

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are AI Fit, a professional virtual fitness coach. Reply in a structured, friendly, and motivating tone. Use bullet points and formatting where helpful. Avoid overly casual language.\n\nUser: "${message}"`
                }
              ]
            }
          ]
        }),
      }
    );

    const result = await res.json();
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    removeTypingIndicator(typingId);
    appendMessage("AI Fit", reply || "⚠️ Sorry, I didn’t understand that.");
  } catch (error) {
    console.error("Gemini error:", error);
    removeTypingIndicator(typingId);
    appendMessage("AI Fit", "⚠️ Error connecting to Gemini.");
  }
}

// Append Message with Formatting and Colors
function appendMessage(sender, text) {
  const body = document.getElementById("chat-body");
  const messageDiv = document.createElement("div");
  messageDiv.className = "chat-message";

  const color = sender === "You" ? "#00f7ff" : "#ffffff";

  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\n{2,}/g, '</p><p>')                   // Paragraphs
    .replace(/\n/g, '<br>');                         // Line breaks

  messageDiv.innerHTML = `<strong style="color:${color}">${sender}:</strong><p style="color:${color}">${formattedText}</p>`;
  body.appendChild(messageDiv);
  body.scrollTop = body.scrollHeight;
}

// Typing indicator logic
function appendTypingIndicator(sender) {
  const body = document.getElementById("chat-body");
  const typingId = "typing-" + Date.now();
  const typingDiv = document.createElement("div");
  typingDiv.className = "chat-message";
  typingDiv.id = typingId;
  typingDiv.innerHTML = `
    <strong style="color:#ffffff">${sender}:</strong>
    <span class="typing-indicator">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </span>
  `;
  body.appendChild(typingDiv);
  body.scrollTop = body.scrollHeight;
  return typingId;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}


