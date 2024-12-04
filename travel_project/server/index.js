import express,{json} from 'express'
import { admin } from './routes/admin.js'
import {user} from './routes/user.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';



const app = express();
app.use(
    cors({ 
      origin: "http://localhost:3001",
    })
);
  
  app.use(cookieParser());
app.use(express.json());
const port= 5000;
app.use(json());
app.use('/', admin)
app.use('/',user)
app.listen(port, () => {
    console.log("server is running in ",  port)
})