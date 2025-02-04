const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static('public'));

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); //__dirname is the directory name of the current module i.e the folder where the js file is located
});

// Menu route with content from external file
app.get('/menu', (req, res) => {
    fs.readFile(path.join(__dirname, 'routes/menu.txt'), 'utf8', (err, data) => { 
        if (err) {
            return res.status(500).send('Error retrieving menu.');
        }
        res.send(`<pre>${data}</pre>`); //pre is an html tag used to define preformatted text
    });
});

// Contact route that renders HTML directly
app.get('/contacts', (req, res) => {
    res.sendFile(path.join(__dirname, 'routes/contacts.html'));
});

// Special route that reads two query parameters
app.get('/special', (req, res) => {
    const specialType = req.query.type;
    const specialDish = req.query.dish;

    let specialFilePath;
    if (specialDish === '1') {
        specialFilePath = path.join(__dirname, 'routes/special-dish1.txt');
    } else if (specialDish === '2') {
        specialFilePath = path.join(__dirname, 'routes/special-dish2.txt');
    } else {
        return res.send('<h1>No special found for the given dish ID. Please use dish=1 or dish=2.</h1>');
    }

    // Read specific special content based on the dish parameter
    fs.readFile(specialFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error retrieving special dish.');
        }
        res.send(`<h1>Special Type: ${specialType}</h1><p>${data}</p>`);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});