(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'cli-test', email: `cli-test-${Date.now()}@example.com`, password: 'password123' })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Request error:', err.message || err);
  }
})();
