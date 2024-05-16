const User = require('../dao/models/user')
//const { hashPassword } = require('../utils/hashing')
const passport = require('passport')
// const passportMiddleware = require('../utils/passportMiddleware')
// const authorizationMiddleware = require('../utils/authorizationMiddleware')

const Router = require('./router')

class SessionRouter extends Router {
    init() {

        // agregamos el middleware de passport para el login
        this.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }), async (req, res) => {
            console.log("holaaaa")
            if (!req.user) return res.sendUserError('Invalid credentials!')
            //if (!req.user) return res.status(400).send('Invalid credentials!')
            // crear nueva sesión si el usuario existe   
            req.session.user = { first_name: req.user.first_name, last_name: req.user.last_name, age: req.user.age, email: req.user.email, rol: req.user.rol }
            res.redirect('/products')
        })

        this.get('/faillogin', (req, res) => {
            res.send({ status: 'error', message: 'Login failed!' })
        })

        this.get('/logout', (req, res) => {
            req.session.destroy(_ => {
                res.redirect('/')
            })
        })

        // agregamos el middleware de passport para el register
        this.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }), async (req, res) => {
            console.log(req.body)
            // no es necesario registrar el usuario aquí, ya lo hacemos en la estrategia!
            res.redirect('/login')
        })

        this.get('/failregister', (req, res) => {
            res.send({ status: 'error', message: 'Register failed!' })
        })

        this.post('/reset_password', passport.authenticate('reset_password', { failureRedirect: '/api/sessions/failreset' }), async (req, res) => {
            res.redirect('/login')
        })

        this.get('/failreset', (req, res) => {
            res.send({ status: 'error', message: 'Reset password failed!' })
        })

        this.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => { })

        this.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
            req.session.user = req.user
            res.redirect('/products')
        })

        this.get('/current', (req, res) => {
            if (!req.user) return res.sendUserError('No hay usuario logueado')
            //if (!req.user) return res.status(400).send('No hay usuario logueado')
            req.session.user = { first_name: req.user.first_name, last_name: req.user.last_name, age: req.user.age, email: req.user.email, rol: req.user.rol }
            res.redirect('/profile')
        })
    }
}

module.exports = SessionRouter