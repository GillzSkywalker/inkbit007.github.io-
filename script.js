// Add a subtle entrance animation when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const intro = document.querySelector(".introduction");
    intro.style.opacity = 0;
    intro.style.transform = "translateY(30px)";
    
    setTimeout(() => {
        intro.style.transition = "all 1s ease";
        intro.style.opacity = 1;
        intro.style.transform = "translateY(0)";
    }, 100);
});

// Optional: Button click animation
const startButton = document.querySelector(".start");
if (startButton) {
    startButton.addEventListener("click", () => {
        startButton.style.transform = "scale(0.95)";
        setTimeout(() => startButton.style.transform = "scale(1)", 100);
    });
}
