require('dotenv').config();
const express = require('express');
const setupProxy = require('./src/setupProxy');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running at Port ${PORT}...`);
});

app.use(express.static(path.join(__dirname, 'public')));
setupProxy(app);
