    const GEMINI_API_KEY = "AIzaSyDTkO6p5M9o0dcSS6D8SiudNMUmZoRClv4";

document.getElementById("generateWorkout").addEventListener("click", async () => {
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const weight = document.getElementById("weight").value;
  const level = document.getElementById("level").value;
  const goal = document.getElementById("goal").value;
  const days = document.getElementById("days").value;
  const equipment = Array.from(document.getElementById("equipment").selectedOptions).map(opt => opt.value).join(", ");
  const water = document.getElementById("water").value;
  const calorie = document.getElementById("calorie").value;
  const location = document.getElementById("location").value;

  const prompt = `
Create a ${days}-day workout plan for a ${gender}, weight ${weight} lbs, fitness level: ${level}, goal: ${goal}.
Available equipment: ${equipment}.
Water intake: ${water}L, Calorie intake: ${calorie} kcal, Workout Location: ${location}.
Format like this:
Day 1 - Chest & Triceps (Est. 45 mins)
- Incline Push-ups (3 sets | AMRAP)
- Dumbbell Bicep Curl (3 sets | 12 reps)
Use bullet list, clean layout, and clear formatting.
`;

  document.getElementById("loadingOverlay").style.display = "flex";

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
  });

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Error generating workout.";
  document.getElementById("loadingOverlay").style.display = "none";
  displayWorkout(text);
});

function displayWorkout(rawText) {
  const outputDiv = document.getElementById("workoutResult");
  outputDiv.innerHTML = "";
  outputDiv.style.display = "block";

  const days = rawText.split(/Day \d+ - /).slice(1);
  const dayTitles = [...rawText.matchAll(/Day \d+ - [^\n]+/g)];

  days.forEach((content, idx) => {
    const title = dayTitles[idx]?.[0] || `Day ${idx + 1}`;
    const exercises = content.trim().split("\n").filter(line => line.trim());

    const dayBlock = document.createElement("div");
    dayBlock.className = "day-block";
    dayBlock.innerHTML = `<h3>${title}</h3>`;

    exercises.forEach(ex => {
      let icon = "🏋️‍♂️";
      if (/push[- ]?up/i.test(ex)) icon = "🤸‍♂️";
      else if (/curl/i.test(ex)) icon = "💪";
      else if (/squat/i.test(ex)) icon = "🦵";
      else if (/plank/i.test(ex)) icon = "🧘";
      else if (/crunch/i.test(ex)) icon = "🧍";
      else if (/row/i.test(ex)) icon = "🚣";
      else if (/jog|walk/i.test(ex)) icon = "🏃";
      else if (/twist/i.test(ex)) icon = "🔄";
      else if (/flye/i.test(ex)) icon = "🦅";
      else if (/pull/i.test(ex)) icon = "📥";
      else if (/raise/i.test(ex)) icon = "📈";
      else if (/tricep/i.test(ex)) icon = "🏹";

      const exEl = document.createElement("div");
      exEl.className = "exercise";
      exEl.innerHTML = `<span class="icon">${icon}</span><div class="exercise-text">${ex}</div>`;
      dayBlock.appendChild(exEl);
    });

    outputDiv.appendChild(dayBlock);
  });

  const buttonRow = document.createElement("div");
  buttonRow.style.textAlign = "center";
  buttonRow.style.marginTop = "30px";
  buttonRow.innerHTML = `
    <a href="http://127.0.0.1:5500/signin&signup.html" class="btn" style="margin-right: 10px;">Login</a>
    <a href="http://127.0.0.1:5500/signin&signup.html" class="btn">Sign Up</a>
  `;
  outputDiv.appendChild(buttonRow);

  outputDiv.scrollIntoView({ behavior: "smooth" });
}

// ✅ Tooltip JS for Workout Days Range
const slider = document.getElementById("days");
const tooltip = document.getElementById("tooltip");

function updateTooltipPosition() {
  const sliderRect = slider.getBoundingClientRect();
  const min = +slider.min;
  const max = +slider.max;
  const val = +slider.value;

  const percent = (val - min) / (max - min);
  const thumbWidth = 16;
  const tooltipX = percent * (slider.offsetWidth - thumbWidth) + thumbWidth / 2;

  tooltip.textContent = val;
  tooltip.style.left = `${tooltipX}px`;
}

slider.addEventListener("input", updateTooltipPosition);
window.addEventListener("load", updateTooltipPosition);

