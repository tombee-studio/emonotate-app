require('dotenv').config();
const express = require('express');
const setupProxy = require('./src/setupProxy');
const app = express();
const cors = require("cors");
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
setupProxy(app);
app.listen(PORT, () => {
    console.log(`Running at Port ${PORT}...`);
});
