document.getElementById('readinglist-toggle-btn').addEventListener('click', toggleReadingList);
document.getElementById('readinglist-form').addEventListener('submit', handleAddToReadingList);
document.addEventListener('DOMContentLoaded', loadReadingList);

async function loadReadingList() {
    try {
        const res = await fetch('/api/readinglist', {
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) {
            console.error('Failed to load reading list:', res.statusText);
            return;
        }

        const readingList = await res.json();
        const listContainer = document.getElementById('readinglist-entries');
        listContainer.innerHTML = '';

        readingList.forEach(entry => {
            const li = document.createElement('li');

            li.textContent = `${entry.title} by ${entry.author}`;
            listContainer.appendChild(li);
        });
    }
    catch (err) {

        console.error('Error loading reading list:', err);
    }
}

function toggleReadingList() {
    const listSection = document.getElementById('readinglist-section');
    listSection.classList.toggle('hidden');
}           
