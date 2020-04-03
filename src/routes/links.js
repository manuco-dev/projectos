const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/add', isLoggedIn, async (req, res) => {
    res.render('links/add');

});

router.post('/add', isLoggedIn, async (req, res) => {
    const { marca, modelo, año, description } = req.body;
    const newLink = {
        marca,
        modelo,
        año,
        description

    };
    await pool.query('INSERT INTO carros set ?', [newLink]);
    req.flash('success', 'Guardado Correctamente');
    res.redirect('/links');
});

router.get('/', isLoggedIn,  async (req, res) => {
    const lista = await pool.query('SELECT * FROM carros');
    console.log(lista);
    res.render('links/list', { lista })
});

router.get('/delete/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM carros WHERE ID = ?', [id]);
    req.flash('success', 'Eliminado Correctamente');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const lista = await pool.query('SELECT * FROM carros WHERE id= ?', [id]);
    console.log(lista[0]);
    res.render('links/edit', { lista: lista[0] });


});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { marca, modelo, año, description } = req.body;
    const newLink = {
        marca,
        modelo,
        año,
        description
    };
    console.log(newLink)
    await pool.query('UPDATE carros set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Actualizado Correctamente');
    res.redirect('/links');
});



module.exports = router;