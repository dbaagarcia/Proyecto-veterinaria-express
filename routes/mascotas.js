var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM mascotas', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('mascotas', { title: 'mascotas', mascotas: results, opcion: 'disabled', estado: true })
        }
    });
});

router.get('/enviar/:clave', function (req, res, next) {
    const clave = req.params.clave;
    connection.query('SELECT * FROM mascotas', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('mascotas', { title: 'mascotas', claveSeleccionada: clave, mascotas: results, opcion: 'disabled', estado: false })
        }
    });
});


router.get('/agregar-mascota', function (req, res, next) {
    res.sendFile('registro-mascotas.html', { root: 'public' })
});
//Agregar mascotas
router.post('/agregar', (req, res) => {
    const cedula = req.body.cedula
    const nombre = req.body.mascota
    const nombre_duenio = req.body.duenio
    const edad = req.body.edad
    const telefono = req.body.telefono
    connection.query(`INSERT INTO mascotas (cedula_duenio,nombre,nombre_duenio,edad,telefono_duenio) VALUES (${cedula},'${nombre}','${nombre_duenio}',${edad},${telefono});`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.redirect('/mascotas')
        }
    });

})
//eliminar macotas
router.get('/eliminar/:cedula', function (req, res, next) {
    const cedula = req.params.cedula
    connection.query(`DELETE FROM cita_medica WHERE id_mascota=${cedula}`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            connection.query(`DELETE FROM mascotas WHERE cedula_duenio=${cedula}`, (error, results) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.redirect('/mascotas')
                }
            });
        }
    });
});

router.post('/actualizar/:cedula', (req, res) => {
    const cedula = req.params.cedula;
    const nombre = req.body.mascota;
    const nombre_duenio = req.body.duenio;
    const edad = req.body.edad;
    const telefono = req.body.telefono;
    connection.query(`UPDATE mascotas SET nombre='${nombre}', nombre_duenio='${nombre_duenio}', edad=${edad}, telefono_duenio=${telefono} WHERE cedula_duenio=${cedula}`, (error, result) => {
        if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/mascotas');
        }
    });
})
module.exports = router;