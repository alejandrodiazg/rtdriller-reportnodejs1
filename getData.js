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

        const datarecord = [];

        for (let i = 0; i < datosrttime.length; i++) {
          const time = datosrttime[i].vars['01']['HKLA'];
          datarecord.push(time);
        }

        if (datarecord.every(value => value === null || value === undefined)) {
          datarecord.splice(0, datarecord.length);
          for (let i = 0; i < datosrttime.length; i++) {
            const time = datosrttime[i].vars['11']['TVOL03'];
            datarecord.push(time);
          }
        } 

       

   
          for (let i = 0; i < Object.keys(vars).length; i++) {
            const array = vars[i];
            for (let k = 0; k < array.length; k++) {
            console.log(array[k])
            }
          }
        


    
    // Retorna la data config y time
      return { datosuserconfig, timerecord,  datarecord };
    } catch (error) {
      throw error;
    }
  }


  module.exports = {
getValues
  };