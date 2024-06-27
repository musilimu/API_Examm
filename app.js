const epinit = require('express');
const sqlinit = require('mysql2/promise');
const aplct = epinit();


const mydb = sqlinit.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'example',
    database: 'mysql',
}).then((mydb) => {

    const basicAuth = (req, res, next) => {
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic') === -1) {
            return res.status(401).json({ error: 'Unauthorized: Missing authorization header' })
        }
        const authHeader = req.headers.authorization;
        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const username = credentials[0];
        const password = credentials[1];


        if (username === 'admin' && password === 'password') {
            next();
        } else {
            return res.status(401).json({ error: 'Unauthorized: Invalid username or password' })
        }

    }

    aplct.use(basicAuth);
    aplct.get('/', async (req, res) => {
        try {
            const query = 'SELECT * FROM users';
            const [rows] = await mydb.query(query);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    const port2 = 3000;
    aplct.listen(port2, () => {
        console.log(`Server is running on port ${port2}`);
    });
});