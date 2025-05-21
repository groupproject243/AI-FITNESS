document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const goal = data.get("goal");      // e.g. fat_loss, muscle_gain
      const level = data.get("level");    // e.g. beginner, intermediate, advanced

      // Define muscle group based on goal
      let muscleGroup = "biceps";
      if (goal === "fat_loss") muscleGroup = "cardio";
      else if (goal === "muscle_gain") muscleGroup = "chest";
      else muscleGroup = "full_body";

      const url = `https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises?muscle=${muscleGroup}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "b3c4dbf64msh4b882ae6d92ced5p14f102jsn6518b86a5c7c",
            "X-RapidAPI-Host": "exercises-by-api-ninjas.p.rapidapi.com"
          }
        });

        const result = await response.json();
        let plan = "<ul>";

        const filtered = result.slice(0, 5); // Show only top 5 exercises for simplicity

        filtered.forEach((exercise) => {
          plan += `<li><strong>${exercise.name}</strong> - ${exercise.type}, ${exercise.difficulty}<br>${exercise.instructions}</li><br>`;
        });

        // Add level-specific tips
        if (level === "beginner") {
          plan += "<li><em>Tip: Focus on form and rest!</em></li>";
        } else if (level === "advanced") {
          plan += "<li><em>Tip: Add supersets for intensity!</em></li>";
        }

        plan += "</ul>";

        localStorage.setItem("workoutPlan", plan);
        window.location.href = "result.html";

      } catch (error) {
        console.error("Error fetching workout plan:", error);
        alert("Failed to load workout plan. Please try again.");
      }
    });
  }
});

// Intersection Observer for fade-in animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });

    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
    });
