import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from './routes/pacienteRoutes.js';

const app = express();
app.use(express.json());

dotenv.config();

//Conectar a la base de datos
conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1){
            //El origen del request esta permitido
            callback(null, true);
        }else{
            //El origen del request no está permitido
            callback(new Error('No permitido por CORS'));
        }
    }

}

//Definimos el puerto
const PORT = process.env.PORT || 4000;

app.use( cors( corsOptions ) );
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});