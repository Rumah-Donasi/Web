const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Set folder public untuk file static (seperti CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Arahkan ke file HTML utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
