const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;
const getData = require('./getData');

// Configuración de la conexión a la base de datos


// Endpoint getdata para conectar mongodb y generar la data para config y grafica
app.post('/getdata', async (req, res) => {
  try {
    const data = await getData.getValues(
     'mongodb://superAdmin:plv2023*@66.94.111.141:27017/admin',
     '1ps-1524-st3_rig-60',
     'user_config',
     'rttime',
      req.body.username,
      req.body.scale,
      req.body.rt,
      req.body.vars,
      req.body.graphics,
      req.body.frecuency,
      req.body.init,
      req.body.end
    );

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
