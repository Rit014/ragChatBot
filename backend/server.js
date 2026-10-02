const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/msg', (req, res) => {
    res.json({ msg: "Hello I am Backend!!"});
});

app.get('/api/smile', (req, res) => {
    res.json({ msg: "Smile please."})
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});