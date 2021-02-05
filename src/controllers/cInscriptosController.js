const mInscriptos = require('../models/mInscriptos');
const mInscripcion = require('../models/mInscripcion');
const ftp = require('basic-ftp');
import { Readable } from 'stream';

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
    const reqBodyParsed = JSON.parse(req.body.values);
    reqBodyParsed.dorso = req.files.productPhotos[0].name;
    reqBodyParsed.frente = req.files.productPhotos[1].name;
    reqBodyParsed.certificado = req.files.productPhotos[2].name;

    //SUBIR A FTP

    try {
      example(req.files.productPhotos, reqBodyParsed.dniAspirante);
      async function example(imagesArray, dni) {
        const client = new ftp.Client();
        client.ftp.verbose = true;
        try {
          await client.access({
            host: '190.106.132.211',
            user: 'muni_docs',
            password: 'Mun!20Docs21_'
          });
          // console.log(await client.list());
          console.log(imagesArray);
          //REFACTORIZACION PENDIENTE
          // imagesArray.map(async image => {
          //   const readableStream = Readable.from(image.data);
          //   const pathTo = '/home/muni_docs/images/' + dni + image.name;
          //   const response = await client.uploadFrom(readableStream, pathTo);
          //   console.log('responde', response);
          // });
          const readableStream1 = Readable.from(imagesArray[0].data);
          const readableStream2 = Readable.from(imagesArray[1].data);
          const readableStream3 = Readable.from(imagesArray[2].data);
          const pathTo1 = '/home/muni_docs/images/' + dni + '-' + imagesArray[0].name;
          const pathTo2 = '/home/muni_docs/images/' + dni + '-' + imagesArray[1].name;
          const pathTo3 = '/home/muni_docs/images/' + dni + '-' + imagesArray[2].name;
          await client.uploadFrom(readableStream1, pathTo1);
          await client.uploadFrom(readableStream2, pathTo2);
          await client.uploadFrom(readableStream3, pathTo3);
        } catch (err) {
          console.log(err);
        }
        client.close();
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }

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
      // console.log('SE VERIFICA SI YA EXISTE LA PERSONA EN LA DB');
      // console.log(validacion);
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
