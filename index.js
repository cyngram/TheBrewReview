const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.get('/api/shops', (req, res) => {
    res.json([
        {id: 1, name: 'Cielito Lindo Cafe', address:'411 Brazos St APT 101, Austin, TX', tags: ['wifi', 'quiet'] },
    {id: 2, name: 'Cafe Creme', address:'710 W Cesar Chavez St, Austin, TX', tags: ['outdoor', 'social']},
    {id: 3, name: 'Mozarts Coffee Roasters', address: '3825 Lake Austin Blvd, Austin, TX', tags: ['wifi', 'scenic']},
    ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});