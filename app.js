require('dotenv').config();
const express = require('express');
const setupProxy = require('./src/setupProxy');
const app = express();
const path = require('path');

app.listen(3000, () => {
    console.log('Running at Port 3000...');
});

app.use(express.static(path.join(__dirname, 'public')));
setupProxy(app);
