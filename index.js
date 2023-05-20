const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// middleWare
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('toy is running');
})

app.listen(port, () => {
    console.log(`toy marketplace server is running port: ${port}` )
})