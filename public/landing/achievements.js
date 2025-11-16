// ===== Achievements Logic =====

// Example achievements data (replace with backend data later)
const achievements = [
    { id: 1, title: "First Collector", desc: "Added your first comic to the collection.", unlocked: true, icon: "trophy.png" },
    { id: 2, title: "Comic Enthusiast", desc: "Collect 10 comics to unlock this achievement.", unlocked: false, icon: "lock.png" },
    { id: 3, title: "Rare Finder", desc: "Obtain a rare edition comic.", unlocked: false, icon: "lock.png" },
    { id: 4, title: "Library Master", desc: "Complete your digital comic library.", unlocked: false, icon: "lock.png" },
];

function showToast(msg, type = 'info', ttl = 2800) {
    const containerId = 'ach-toast-container';
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.style.position = 'fixed';
        container.style.right = '18px';
        container.style.bottom = '18px';
        container.style.zIndex = 2000;
        document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    el.style.marginTop = '8px';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '8px';
    el.style.color = '#071021';
    el.style.background = type === 'success' ? '#b6f7c7' : (type === 'warn' ? '#ffd6a6' : '#cde7ff');
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; }, ttl);
    setTimeout(() => el.remove(), ttl + 240);
}

function renderAchievements(list) {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';
    list.forEach(a => {
        const card = document.createElement('article');
        card.className = `achievement-card ${a.unlocked ? 'unlocked' : 'locked'}`;
        card.setAttribute('data-id', a.id);

        card.innerHTML = `
            <div class="meta">
                <div>
                    <h3>${escapeHtml(a.title)}</h3>
                    <p>${escapeHtml(a.desc || '')}</p>
                </div>
                <img class="thumb" src="${a.icon}" alt="${escapeHtml(a.title)}">
            </div>
        `;

        // action area
        const action = document.createElement('div');
        action.style.marginTop = '10px';
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = a.unlocked ? 'Unlocked' : 'Locked';
        action.appendChild(badge);

        // clicking an unlocked achievement shows a small toast
        card.addEventListener('click', () => {
            if (a.unlocked) {
                showToast(`🏆 ${a.title} — ${a.desc}`, 'success');
            } else {
                showToast(`${a.title} is locked. ${a.desc}`, 'warn');
            }
        });

        card.appendChild(action);
        grid.appendChild(card);
    });

    // update counts and progress
    const total = list.length;
    const unlocked = list.filter(x => x.unlocked).length;
    document.getElementById('total-count').textContent = total;
    document.getElementById('unlocked-count').textContent = unlocked;
    const pct = Math.round((unlocked / Math.max(1, total)) * 100);
    document.getElementById('progress-fill').style.width = pct + '%';
}

function escapeHtml(s){ return String(s).replace(/[&<>"]+/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch])); }

// filtering/search helpers
function applyFilters(){
    const q = document.getElementById('ach-search').value.trim().toLowerCase();
    const filter = document.getElementById('ach-filter').value;
    const filtered = achievements.filter(a => {
        const matchesQ = !q || (a.title + ' ' + (a.desc||'')).toLowerCase().includes(q);
        const matchesFilter = filter === 'all' || (filter === 'unlocked' && a.unlocked) || (filter === 'locked' && !a.unlocked);
        return matchesQ && matchesFilter;
    });
    renderAchievements(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    // initial render
    renderAchievements(achievements);

    // wire up search/filter
    document.getElementById('ach-search').addEventListener('input', () => applyFilters());
    document.getElementById('ach-filter').addEventListener('change', () => applyFilters());
});
