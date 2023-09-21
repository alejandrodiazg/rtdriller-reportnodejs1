const express = require("express");
const app = express();
const getData = require('./getData');
const generateChartImage = require('./createchart.js');
const port = 3000;


app.use(express.json());

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

app.post('/getimage', async (req, res) => {


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
     req.body.end)

  const config = {
    width: 400,
    height: 1200,
    option: {
      yAxis: {
        type: 'category', // Cambia el tipo de eje a 'category'
        data: data['timerecord'].map(function(item) {
          return item; // Utiliza los nombres como etiquetas del eje Y
        }),
        axisLabel: {
          rotate: 90, // Rota las etiquetas del eje Y en 90 grados
          align: 'center' // Alinea las etiquetas al centro
        }
      },
      xAxis: {
        min: 0, // Valor mínimo del eje y
        max: 1000,
        type: 'value' // Mantén el tipo de eje X como 'value'
      },
      series: [{
        type: 'line', // Cambia el tipo de gráfica a 'line'
        data: data['datarecord'].map(function(item) {
          return item;
        })
      }],
      grid: {
        containLabel: true, // Asegura que las etiquetas del eje Y estén completamente visibles
        orient: 'horizontal' // Muestra el gráfico en orientación horizontal
      }
    },
    path: './demo/form.png'
  };
  
  generateChartImage(config);


res.send('grafica creada')


});


// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
