const express = require('express')
const mongoose = require('mongoose')
const formRoute = require('./routes/formdata')
const userRoute = require('./routes/user')
const cors = require('cors');


const app = express();
const PORT = 8000;
const corsOptions = {
    credentials: true,
  };
mongoose.connect('mongodb://127.0.0.1:27017')
.then(e=>console.log("MongoDB Connected"));

app.use(express.json());
app.use(cors());
app.use(cors(corsOptions));

app.use('/form',formRoute);
app.use('/auth',userRoute);

app.listen(PORT,()=>{
    console.log("Server is online")
})