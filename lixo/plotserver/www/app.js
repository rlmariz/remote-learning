const express = require('express');
const app = express();
const PORT = 3080;

app.use(express.static('public'));
app.use('/lib', express.static('../lib'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));