const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const PORT = 3000;

// Create and configure HTTP server to listen to requests
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Setting file path for different routes
    let filePath;
    if (parsedUrl.pathname === '/') {
        filePath = path.join(__dirname, 'index.html');
    } else if (parsedUrl.pathname === '/menu') {
        filePath = path.join(__dirname, 'routes/menu.txt');
    } else if (parsedUrl.pathname === '/contacts') {
        filePath = path.join(__dirname, 'routes/contacts.html');
    } else if (parsedUrl.pathname === '/special') {
        const specialType = parsedUrl.query.type;
        const specialDish = parsedUrl.query.dish;
        const specialFilePath = specialDish === '1' ? 
            path.join(__dirname, 'routes/special-dish1.txt') :
            specialDish === '2' ? 
            path.join(__dirname, 'routes/special-dish2.txt') : null;

        if (!specialFilePath) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('<h1>No special found for the given dish ID. Please use dish=1 or dish=2.</h1>');
            return;
        }

        fs.readFile(specialFilePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error retrieving special dish.');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<h1>Special Type: ${specialType}</h1><p>${data}</p>`);
        });
        return; // No further processing takes place
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
        return; // No further processing takes place
    }

    // Routes where we set a file path
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }
        const contentType = path.extname(filePath) === '.html' ? 'text/html' : 'text/plain';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});