document.addEventListener('DOMContentLoaded', () => {
    loadAchievements();

    // Filter/Search listeners
    const searchInput = document.getElementById('ach-search');
    const filterSelect = document.getElementById('ach-filter');

    if (searchInput) searchInput.addEventListener('input', filterAchievements);
    if (filterSelect) filterSelect.addEventListener('change', filterAchievements);
});

let allAchievements = [];

async function loadAchievements() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;

    grid.innerHTML = '<p style="text-align:center; width:100%; color:#666;">Loading achievements...</p>';

    try {
        const res = await fetch('/api/achievements');
        if (!res.ok) throw new Error('Failed to load achievements');
        
        allAchievements = await res.json();
        renderAchievements(allAchievements);
        updateProgress(allAchievements);
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p style="text-align:center; width:100%; color:red;">Could not load achievements. Please try again later.</p>';
    }
}

function renderAchievements(list) {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%;">No achievements found.</p>';
        return;
    }

    list.forEach(ach => {
        const card = document.createElement('div');
        // Assuming CSS classes exist, otherwise these provide hooks for styling
        card.className = `achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`;
        
        // Inline styles for immediate visibility if CSS is missing
        if (!document.querySelector('link[href="achievements.css"]')) {
            card.style.border = '1px solid #ddd';
            card.style.padding = '15px';
            card.style.borderRadius = '8px';
            card.style.background = ach.unlocked ? '#f0fff4' : '#f9f9f9';
            card.style.opacity = ach.unlocked ? '1' : '0.7';
        }

        card.innerHTML = `
            <div class="ach-icon" style="font-size: 2rem; margin-bottom: 10px;">${ach.icon || '🏆'}</div>
            <div class="ach-content">
                <h3 style="margin: 0 0 5px 0;">${ach.title}</h3>
                <p style="margin: 0; color: #666; font-size: 0.9rem;">${ach.description}</p>
                <div style="margin-top: 10px; font-weight: bold; color: ${ach.unlocked ? 'green' : '#999'};">
                    ${ach.unlocked ? '✅ Unlocked' : '🔒 Locked'}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function updateProgress(list) {
    const total = list.length;
    const unlocked = list.filter(a => a.unlocked).length;
    
    document.getElementById('total-count').textContent = total;
    document.getElementById('unlocked-count').textContent = unlocked;
    
    const percent = total === 0 ? 0 : (unlocked / total) * 100;
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = `${percent}%`;
}

function filterAchievements() {
    const query = document.getElementById('ach-search').value.toLowerCase();
    const filter = document.getElementById('ach-filter').value;

    const filtered = allAchievements.filter(ach => {
        const matchesSearch = ach.title.toLowerCase().includes(query) || ach.description.toLowerCase().includes(query);
        const matchesFilter = filter === 'all' 
            ? true 
            : (filter === 'unlocked' ? ach.unlocked : !ach.unlocked);
        
        return matchesSearch && matchesFilter;
    });

    renderAchievements(filtered);
}