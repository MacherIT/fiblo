const express = require('express');
const crypto = require('crypto');

const router = express.Router();

// const tinify = require("tinify");
// tinify.key = process.env.TPK;

const guardian = require('../security/guardian');

router.post('/', guardian({}), (req, res) => {
  if (!req.files) return res.status(400).send('No files were uploaded.');

  const output = [];
  const proms = [];

  if (!Array.isArray(req.files.imagenes)) req.files.imagenes = [req.files.imagenes];

  for (let i = 0; i < req.files.imagenes.length; i++) {
    const imagen = req.files.imagenes[i];

    if (new RegExp(/^(image\/png|image\/jpg|image\/jpeg|image\/gif)$/).test(imagen.mimetype)) {
      const ubicacion = process.cwd();

      const baseName =
        crypto.randomBytes(5).toString('hex') +
        imagen.name
          .toLowerCase()
          .replace(/\s/g, '-')
          .replace(/á/g, 'a')
          .replace(/é/g, 'e')
          .replace(/í/g, 'i')
          .replace(/ó/g, 'o')
          .replace(/ú/g, 'u')
          .replace(/ñ/g, 'n')
          .replace(/[^a-zA-Z0-9\.-_]/g, '');

      const imgName = `/public/images/uploads/${baseName}`;

      let imgNameUnmini;

      if (process.env.NODE_ENV === 'production') {
        fs.existsSync(`${ubicacion}/public/images/uploads/`) ||
          fs.mkdirSync(`${ubicacion}/public/images/uploads/`);
        // fs.existsSync(`${ubicacion}/public/images/uploads-unminified/`) ||
        // fs.mkdirSync(`${ubicacion}/public/images/uploads-unminified/`);
        // imgNameUnmini = `/public/images/uploads-unminified/${baseName}`;
      }

      proms.push(
        new Promise((resolve, reject) => {
          imagen.mv(ubicacion + imgName, err => {
            if (err) {
              console.log(err);
              reject();
              return res.status(500).send(err);
            }

            // if (process.env.NODE_ENV === 'production') {
            //   imagen.mv(ubicacion + imgNameUnmini, err => {
            //     if (err) {
            //       console.log(err);
            //       return res.status(500).send(err);
            //     }
            //
            //     tinify
            //       .fromFile(ubicacion + imgName)
            //       .toFile(ubicacion + imgName)
            //       .then(() => {
            //         console.log(`Se minifico: ${fs.existsSync(ubicacion + imgName)}`);
            //       })
            //       .catch(err => {
            //         console.log(err);
            //         imagen.mv(ubicacion + imgName, err => {
            //           if (err) {
            //             console.log(err);
            //           }
            //         });
            //       });
            //
            //     output.push({
            //       message: 'File uploaded!',
            //       uri: imgName,
            //     });
            //
            //     resolve();
            //   });
            // }
            // else {
            output.push({
              message: 'File uploaded!',
              uri: imgName,
            });
            resolve();
            // }
          });
        }),
      );
    } else {
      return res.status(500).send({
        message: 'Error',
      });
    }
  }

  Promise.all(proms).then(() => {
    res.json(output);
  });
});

module.exports = router;
