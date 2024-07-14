const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('*', (req, res) => {
    const requestedPath = path.join(__dirname, req.path);
    
    fs.stat(requestedPath, (err, stats) => {
        if (err) {
            res.status(404).send('<h1>404 Not Found</h1>');
            return;
        }

        if (stats.isDirectory()) {
            fs.readdir(requestedPath, (err, files) => {
                if (err) {
                    res.status(500).send('<h1>500  Server Error</h1>');
                    return;
                }

                const fileList = files.map(file => {
                    const filePath = path.join(req.path, file);
                    const fileIcon = fs.statSync(path.join(requestedPath, file)).isDirectory() ? '📁' : '🖹';
                    return `<li><a href="${filePath}">${fileIcon} ${file}</a></li>`;
                }).join('');

                res.send(`
                    <html>
                    <body>
                        <ul>${fileList}</ul>
                    </body>
                    </html>
                `);
            });
        } else {
            res.sendFile(requestedPath);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
