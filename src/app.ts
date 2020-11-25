import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();

//Middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));


//Routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

export default app;