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
          const imagesFormatted = imagesArray.map((image, index) => {
            if (image.mimetype === 'image/jpeg') {
              let imageName = image.name.split('.')[0];
              const type = image.mimetype.split('/')[1];
              const last = imageName.length - 1;
              imageName = imageName.substring(0, last) + '.' + type;
              image.imageName = imageName;
              return image;
            } else {
              image.imageName = image.name;
              return image;
            }
          });
          //REFACTORIZACION PENDIENTE
          // imagesArray.map(async image => {
          //   const readableStream = Readable.from(image.data);
          //   const pathTo = '/home/muni_docs/images/' + dni + image.name;
          //   const response = await client.uploadFrom(readableStream, pathTo);
          //   console.log('responde', response);
          // });
          const readableStream1 = Readable.from(imagesFormatted[0].data);
          const readableStream2 = Readable.from(imagesFormatted[1].data);
          const readableStream3 = Readable.from(imagesFormatted[2].data);
          const pathTo1 = '/home/muni_docs/images/' + dni + '-' + imagesFormatted[0].imageName;
          const pathTo2 = '/home/muni_docs/images/' + dni + '-' + imagesFormatted[1].imageName;
          const pathTo3 = '/home/muni_docs/images/' + dni + '-' + imagesFormatted[2].imageName;
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
  static async getAllInscriptos(req, res) {
    try {
      const allInscriptos = await mInscriptos.getAllInscriptos();
      if (!allInscriptos) {
        return res.status(404).send('No se encontraron resultados');
      }
      res.status(200).send(allInscriptos);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  static async getAllEnrolledsByDate(req, res) {
    console.log('CONTROLLER');
    const { from, to, club, sport, category } = req.query;

    let query = `SELECT becasdeportivas.datosaspirante.*, becasdeportivas.datosclub.idclub, becasdeportivas.datosclub.Deporte, becasdeportivas.clubes.nombre as clubtxt,
    becasdeportivas.datosclub.Categoria, becasdeportivas.deportes.deporte as deportetxt, becasdeportivas.datosclub.idclubdeportecategoria
    from becasdeportivas.datosaspirante
    left join becasdeportivas.datosclub
    on becasdeportivas.datosaspirante.id = becasdeportivas.datosclub.idAspirante
    left join becasdeportivas.clubes
    on becasdeportivas.datosclub.idclub = becasdeportivas.clubes.idclub 
    left join becasdeportivas.deportes
    on becasdeportivas.datosclub.Deporte = becasdeportivas.deportes.id
    where becasdeportivas.datosaspirante.fechaInsc >= "${from}" and becasdeportivas.datosaspirante.fechaInsc <= "${to}"`;

    if (club) {
      query = query + `and becasdeportivas.datosclub.idClub = "${club}"`;
    }
    if (club && sport) {
      query = query + `and becasdeportivas.datosclub.Deporte = "${sport}"`;
    }
    if (club && sport && category) {
      query = query + `and becasdeportivas.datosclub.idclubdeportecategoria = "${category}"`;
    }

    query = query + ' order by becasdeportivas.datosaspirante.fechaInsc asc';

    try {
      const allEnrolleds = await mInscriptos.getAllEnrolledsByDate(query);
      if (allEnrolleds.length === 0) {
        return res.status(404).send('No se encontraron resultados');
      }
      res.status(200).send(allEnrolleds);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  static async updateEnrolledById(req, res) {
    const id = req.params.id;
    const {
      NombreApellido,
      Direccion,
      Telefono,
      DNI,
      fechaNac,
      Barrio,
      Colegio,
      email,
      sexo,
      idclub,
      Deporte,
      idclubdeportecategoria
    } = req.body;
    let query = `UPDATE becasdeportivas.datosaspirante SET NombreApellido="${NombreApellido}", Direccion="${Direccion}", Telefono="${Telefono}", DNI="${DNI}", fechaNac="${fechaNac}", Barrio="${Barrio}", Colegio="${Colegio}", email="${email}", sexo="${sexo}" WHERE id=${id}`;

    let queryDataClub = `UPDATE becasdeportivas.datosclub SET idclub="${idclub}", Deporte="${Deporte}", idclubdeportecategoria="${idclubdeportecategoria}" WHERE idAspirante="${id}"`;

    try {
      await mInscriptos.updateEnroleedById(query);
      await mInscriptos.updateEnroleedDataClub(queryDataClub);

      res.send({ updated: true });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  static async updateEnrolledState(req, res) {
    const id = req.params.id;
    const { estado } = req.body;
    let query = `UPDATE becasdeportivas.datosaspirante SET estado = "${estado}" WHERE id=${id}`;

    try {
      await mInscriptos.updateEnroleedState(query);

      res.send({ updated: true });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  static async getEnrolledByDni(req, res) {
    const dni = req.params.dni;
    let query = `SELECT becasdeportivas.datosaspirante.*, becasdeportivas.datosclub.idclub, becasdeportivas.datosclub.Deporte, becasdeportivas.clubes.nombre as clubtxt,
    becasdeportivas.datosclub.Categoria, becasdeportivas.deportes.deporte as deportetxt
    from becasdeportivas.datosaspirante
    left join becasdeportivas.datosclub
    on becasdeportivas.datosaspirante.id = becasdeportivas.datosclub.idAspirante
    left join becasdeportivas.clubes
    on becasdeportivas.datosclub.idclub = becasdeportivas.clubes.idclub 
    left join becasdeportivas.deportes
    on becasdeportivas.datosclub.Deporte = becasdeportivas.deportes.id
where becasdeportivas.datosaspirante.DNI ="${dni}" and becasdeportivas.datosaspirante.anio=2021`;

    try {
      const enrolled = await mInscriptos.getEnrolledByDni(query);

      res.status(200).send(enrolled);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  static async getAllCategories(req, res) {
    const { idclub, iddeporte } = req.params;

    let query = `SELECT deportes.*,clubdeporte.*,clubdeportecategoria.id as idcategoria,concat(clubdeportecategoria.categoria,'/',clubdeportecategoria.categoriahasta) AS categoriatxt
    FROM becasdeportivas.clubdeportecategoria 
    INNER JOIN clubdeporte ON clubdeporte.id=clubdeportecategoria.idclubdeporte
    INNER JOIN deportes ON  deportes.id=clubdeporte.iddeporte
    INNER JOIN clubes ON clubes.idclub=clubdeporte.idclub
    where clubes.idclub="${idclub}" and clubdeporte.iddeporte="${iddeporte}" `;

    try {
      const categories = await mInscriptos.getAllCategories(query);

      res.status(200).send(categories);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  static async updateImageEnrolled(req, res) {
    const type = req.query.type;
    const dni = req.query.dni;
    const id = req.query.id;
    console.log(type);
    console.log(req.files.image.name);

    try {
      example(req.files.image, dni);
      async function example(image, dni) {
        const client = new ftp.Client();
        client.ftp.verbose = true;
        try {
          await client.access({
            host: '190.106.132.211',
            user: 'muni_docs',
            password: 'Mun!20Docs21_'
          });

          const readableStream1 = Readable.from(image.data);
          const pathTo1 = '/home/muni_docs/images/' + dni + '-' + image.name;
          await client.uploadFrom(readableStream1, pathTo1);
        } catch (err) {
          console.log(err);
        }
        client.close();
      }

      let imageName = dni + '-' + image.name;
      let query = `UPDATE becasdeportivas.datosaspirante SET ${type} = ${imageName} WHERE idAspirante=${id}`;

      await mInscriptos.updateImageEnrrolled(query);
      res.send(dni + '-' + req.files.image.name);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

export default InscriptoController;
