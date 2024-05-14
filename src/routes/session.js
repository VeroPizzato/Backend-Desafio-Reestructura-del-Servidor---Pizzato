const { Router } = require('express')
const User = require('../dao/models/user')
//const { hashPassword } = require('../utils/hashing')
const passport = require('passport')
// const passportMiddleware = require('../utils/passportMiddleware')
// const authorizationMiddleware = require('../utils/authorizationMiddleware')

const router = Router()

// agregamos el middleware de passport para el login
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }), async (req, res) => {
    console.log("holaaaa")
    if (!req.user) return res.status(400).send('Invalid credentials!')
    // crear nueva sesión si el usuario existe   
    req.session.user = { first_name: req.user.first_name, last_name: req.user.last_name, age: req.user.age, email: req.user.email, rol: req.user.rol }   
    res.redirect('/products')
})

router.get('/faillogin', (req, res) => {
    res.send({ status: 'error', message: 'Login failed!' })
})

router.get('/logout', (req, res) => {
    req.session.destroy(_ => {
        res.redirect('/')
    })
})

// agregamos el middleware de passport para el register
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }), async (req, res) => {
    console.log(req.body)
    // no es necesario registrar el usuario aquí, ya lo hacemos en la estrategia!
    res.redirect('/login')
})

router.get('/failregister', (req, res) => {
    res.send({ status: 'error', message: 'Register failed!' })
})

router.post('/reset_password', passport.authenticate('reset_password', { failureRedirect: '/api/sessions/failreset' }), async (req, res) =>  {
       res.redirect('/login')
})

router.get('/failreset', (req, res) => {
    res.send({ status: 'error', message: 'Reset password failed!' })
})
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => { })

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

router.get('/current', (req, res) => {
    if (!req.user) return res.status(400).send('No hay usuario logueado')
    req.session.user = { first_name: req.user.first_name, last_name: req.user.last_name, age: req.user.age, email: req.user.email, rol: req.user.rol }   
    res.redirect('/profile')
})

// router.get('*', (req, res) => {
//     res.status(404).send('Pagina no encontrada')
// })

module.exports = router