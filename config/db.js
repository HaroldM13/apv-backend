import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);

        const url = `${db.connection.host}:${db.connection.port}`;

        console.log(`MongoDB Conectado en: ${url}`)

    } catch (error) {
        console.log(`error: ${error.mesaage} `);
        process.exit(1);
    }
}

export default conectarDB; 