// ===== Achievements Logic =====

// Example achievements data (you can later fetch from backend)
const achievements = [
    { id: 1, title: "First Collector", unlocked: true },
    { id: 2, title: "Comic Enthusiast", unlocked: false },
    { id: 3, title: "Rare Finder", unlocked: false },
    { id: 4, title: "Library Master", unlocked: false },
];

// Example: Dynamically update cards or show notifications
document.addEventListener("DOMContentLoaded", () => {
    achievements.forEach(a => {
        console.log(`${a.title}: ${a.unlocked ? "Unlocked" : "Locked"}`);
    });

    // Example toast if new achievement unlocked
    const newAchievement = achievements.find(a => a.unlocked);
    if (newAchievement) {
        showAchievementToast(newAchievement.title);
    }
});

function showAchievementToast(title) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = `🏆 Achievement Unlocked: ${title}!`;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ===== Optional CSS for toast message =====
const style = document.createElement('style');
style.textContent = `
.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #28a745;
    color: #fff;
    padding: 12px 18px;
    border-radius: 8px;
    font-weight: 500;
    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
    animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);
