import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import mainController from "../src/controller/mainController.js"
import login from "../src/controller/login.js";


const servidor = express();
servidor.use(cors());
servidor.use(express.json());

servidor.use(login);
servidor.use(mainController);


servidor.use('/storage/fotos', express.static('storage/fotos'));

servidor.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Erro interno do servidor');
});

let port = process.env.PORT;
servidor.listen(port, () => console.log("API SUBIU!"));

export default servidor;