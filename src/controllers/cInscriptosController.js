const mInscriptos = require('../models/mInscriptos');
const mInscripcion = require('../models/mInscripcion');
const ftp = require('basic-ftp');

class InscriptoController {
  /**
   * postNuevoInscripto2
   * @param req
   * @param res
   * @returns {JSON Object}
   */

  static async postNuevoInscripto2(req, res) {
    console.log('DATA DE ARCHIVO');
    console.log(req.files);
    // console.log('DATA DE USUARIO');

    const reqBodyParsed = JSON.parse(req.body.values);

    //SUBIR A FTP

    try {
      example();

      async function example() {
        const client = new ftp.Client();
        client.ftp.verbose = true;
        try {
          await client.access({
            host: '190.106.132.211',
            user: 'muni_docs',
            password: 'Mun!20Docs21_'
          });
          // console.log(await client.list());
          await client.uploadFrom(req.files.productPhotos[0], "/home/muni_docs/"+req.files.productPhotos[0].name)
        } catch (err) {
          console.log(err);
        }
        client.close();
      }

      // esto conecta, sube los archivos al server, pero no tienen peso, no tienen tamaño, en todo caso hay que descular esa parte...
      // const Ftp = new jsftp({
      //   host: "190.106.132.211",
      //   port: 21,
      //   user: "muni_docs",
      //   pass: "Mun!20Docs21_"
      // });
      // Ftp.auth("muni_docs", "Mun\!20Docs21\_", (err) => {
      //   if (!err) {
      //     Ftp.put("/home/marcos/Imágenes/a.png", "/home/muni_docs/asd.png", err => {
      //       if (!err) {
      //         console.log("File transferred successfully!");
      //       }else{
      //         console.log(err)
      //       }
      //     });
      //   }else{
      //     console.log(err)
      //   }
      // })

      // ne
      // await uploadSFTPMiddleware(req, res, (err) => {
      //   if(err) {
      //     console.log(err)
      //     res.status(400).send("Something went wrong!");
      //   }
      //   console.log('upload');
      //   console.log('body', req.file);
      //   //guardar info en la base de datos con id, nombre de archivo, path, fecha subido y quien lo subio
      //   res.send(req.files);
      // });
    } catch (error) {
      console.log(error);
      res.send(error);
    }

    ////////

    if (reqBodyParsed.sexo === 'Masculino') {
      reqBodyParsed.sexoAspiranteDB = 'M';
    } else {
      reqBodyParsed.sexoAspiranteDB = 'F';
    }
    if (reqBodyParsed.sexoTutor === 'Femenino') {
      reqBodyParsed.sexoTutorDB = 'F';
    } else {
      reqBodyParsed.sexoTutorDB = 'M';
    }
    try {
      const anio = new Date().getFullYear();
      const validacion = await mInscripcion.getUserInfoByDNIandDate(reqBodyParsed.dni, anio);
      console.log('SE VERIFICA SI YA EXISTE LA PERSONA EN LA DB');
      console.log(validacion);
      if (validacion.length === 0) {
        try {
          const nuevoInscripto = await mInscriptos.postNuevoInscripto(reqBodyParsed);
          console.log('Inscripto!');
          console.log(nuevoInscripto.insertId);

          const nuevoInscriptoTutor = await mInscriptos.postNuevoInscriptoTutor(
            reqBodyParsed,
            nuevoInscripto.insertId
          );

          //ver si hay que eliminar
          // const updateCupo = await mInscriptos.updateCupo(req.body.categoriaSelected.value);

          const nuevaBeca = await mInscriptos.postNuevaBeca(
            reqBodyParsed.clubSelected.value,
            reqBodyParsed.deporteSelected.value,
            anio,
            reqBodyParsed.categoriaSelected.label,
            reqBodyParsed.categoriaSelected.value,
            nuevoInscripto.insertId
          );
          res.status(200).send({ message: 'Registro creado exitosamente. ' });
        } catch (error) {
          console.log(error);
          res.status(500).send(error);
        }
      } else {
        // UPDATE
        await mInscriptos.postUpdateInscriptos(reqBodyParsed, validacion[0].id);

        console.log('Actualizado !');
        res.status(200).send({ message: 'Registro actualizado exitosamente. ' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

export default InscriptoController;
