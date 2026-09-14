const express = require('express');
const app = express();

app.get('/api/shops', (req, res) => {
    res.json(['Fleet Coffee', 'Radio Coffee', 'Blue Owl Coffee']);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

