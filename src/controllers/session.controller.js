class SessionController {

    constructor() {
    }

    login = (req, res) => {
        if (!req.user) return res.sendUserError('Invalid credentials!')
        //if (!req.user) return res.status(400).send('Invalid credentials!')
        // crear nueva sesión si el usuario existe   
        req.session.user = { first_name: req.user.first_name, last_name: req.user.last_name, age: req.user.age, email: req.user.email, rol: req.user.rol }
        res.redirect('/products')
    }

    faillogin = (_, res) => {
        res.sendUnauthorized('Login failed!')
        //res.send({ status: 'error', message: 'Login failed!' })
    }

    logout = (req, res) => {
        req.session.destroy(_ => {
            res.redirect('/')
        })
    }

    register = (req, res) => {
        console.log(req.body)
        // no es necesario registrar el usuario aquí, ya lo hacemos en la estrategia!
        res.redirect('/login')
    }

    failregister = (_, res) => {
        res.sendUserError('Register failed!')
        //res.send({ status: 'error', message: 'Register failed!' })
    }

    reset_password = (_, res) => {
        res.redirect('/login')
    }

    failreset = (_, res) => {
        res.sendUserError('Reset password failed!')
        //res.send({ status: 'error', message: 'Reset password failed!' })
    }

    githubcallback = (_, res) => {
        req.session.user = req.user
        res.redirect('/products')
    }

    current = (req, res) => {
        if (!req.user) return res.sendUserError('No hay usuario logueado')
            //if (!req.user) return res.status(400).send('No hay usuario logueado')
            req.session.user = { first_name: req.user.first_name, last_name: req.user.last_name, age: req.user.age, email: req.user.email, rol: req.user.rol }
            res.redirect('/profile')
    }
}

module.exports = { SessionController }