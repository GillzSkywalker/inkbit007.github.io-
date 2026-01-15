const numInput = document.getElementById('numInput');
numInput.addEventListener('input', () => {
    const value = parseInt(numInput.value, 10); 
    if (isNaN(value) || value < 1) {
        numInput.value = 1;
    } else if (value > 100) {
        numInput.value = 100;
    }
}
);

(document.getElementById('submitBtn')).addEventListener('click', (e) => {
    e.preventDefault();
    alert(`You have submitted the number: ${numInput.value}`);
}

);
