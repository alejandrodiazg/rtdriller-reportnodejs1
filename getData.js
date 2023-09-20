const { MongoClient } = require("mongodb");

async function getValues(
    dburi,
    dbname,
    dbcollectionfirst,
    dbcollectionsecond,
    username,
    scale,
    rt,
    vars,
    graphics,
    frequency,
    init,
    end
  ) {
    try {
      const uri = dburi;
      const client = new MongoClient(uri);
      // Conexión a la base de datos
      await client.connect();
      const database = client.db(dbname);
      const collection = database.collection(dbcollectionfirst);
      const collection2 = database.collection(dbcollectionsecond);
      // Crear el objeto de proyección dinámicamente
      const projection = {
        'config.r01': 1,
      };

      const projection2 = {
        'time': 1,
      };

      // valores de vars
      for (let i = 0; i < Object.keys(vars).length; i++) {
        const array = vars[i];
        for (let k = 0; k < array.length; k++) {
          projection[`vars.${rt}.${array[k]}`] = 1;
          projection2[`vars`] = 1;
        }
      }
      // Consulta para obtener los datos
      const datosuserconfig = await collection
      .find({ user_name: username })
      .project(projection)
      .toArray();
      
  
      const limit = scale / frequency;
      const datosrttime = await collection2
      .find(
        {
          timestamp: {
            $gte: init,
            $lte: end,
          },
        },
        {
          projection: projection2,
        }
      )
      .limit(limit)
        .toArray();

    
        const timerecord = [];

        for (let i = 0; i < datosrttime.length; i++) {
          const time = datosrttime[i].time;
          timerecord.push(time);
        }

        


    
    // Retorna la data config y time
      return { datosuserconfig, timerecord };
    } catch (error) {
      throw error;
    }
  }


  module.exports = {
getValues
  };