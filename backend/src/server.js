const express = require('express');
const cors = require('cors');
const app = express();
const llaveRutas = require('./routes/llaveRutas');
const adminRutas = require ('./routes/adminRutas')
const responsableRutas = require('./routes/responsableRutas');
const prestamoRutas = require('./routes/prestamoRuta');

app.use(cors())
app.use(express.json());

app.use('/api/llaves', llaveRutas); 
app.use('/admin', adminRutas);
app.use('/api/responsable', responsableRutas);
app.use('/api', prestamoRutas);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`)); //Muesta en la terminal en que puerto corre el servidor