import expres from 'express';
import cors from 'cors';


const app = expres();

//Middlewares
app.use(cors());

//Routes


export default app;