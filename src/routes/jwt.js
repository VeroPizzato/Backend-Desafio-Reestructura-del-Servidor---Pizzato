const User = require('../dao/models/user')
const { isValidPassword } = require('../utils/hashing')
const { generateToken, verifyToken } = require('../utils/jwt')
// const passport = require('passport')
const passportMiddleware = require('../utils/passportMiddleware')
const authorizationMiddleware = require('../utils/authorizationMiddleware')
const config = require('../config/config')

const Router = require('./router')

class JwtRouter extends Router {
    init() {
        this.post('/login', async (req, res) => {
            const { email, password } = req.body

            if (!email || !password) {
                res.sendUserError(err)
                //return res.status(400).send('Invalid credentials!')
            }

            let user
            if (email === config.ADMIN_EMAIL && password === config.ADMIN_PASSWORD) {
                // Datos de sesión para el usuario coder Admin
                user = {
                    first_name: "Usuario",
                    last_name: "de CODER",
                    age: 21,
                    email: config.ADMIN_EMAIL,
                    cart: null,
                    rol: "admin",
                    _id: "jhhasgñjglsargj355ljasg"
                }
            }
            else {
                user = await User.findOne({ email })
                if (!user) {
                    res.sendUserError(err)
                    //return res.status(400).json({ error: 'User not found!' })
                }

                if (!isValidPassword(password, user.password)) {
                    return send.sendUnauthorized('Invalid password')
                    //return res.status(401).json({ error: 'Invalid password' })
                }
            }

            // const credentials = { id: user._id.toString(), email: user.email, rol: 'user' }
            const credentials = { id: user._id.toString(), email: user.email, rol: user.rol }
            const accessToken = generateToken(credentials)
            res.cookie('accessToken', accessToken, { maxAge: 60 * 1000, httpOnly: true })

            res.status(200).json({ accessToken })
        })

        this.get('/private', verifyToken, (req, res) => {
            const { email } = req.authUser
            res.send(`Welcome ${email}, this is private and protected content`)
        })

        // this.get('/current', passport.authenticate('jwt', { session: false}), async (req, res) => { 
        //     return res.json(req.user)   // Si no envio un token en la cookie, passport me devuelve un 401 (Unauthorized)   
        // })

        // Para devolver un error mas significativo durante mis estrategias de passport si no le mando token o mando un token erroneo
        this.get('/current', passportMiddleware('jwt'), /*authorizationMiddleware('user'),*/ async (req, res) => {
            return res.json(req.user);
        });

        // this.get('/current', passportMiddleware('jwt'), authorizationMiddleware('admin'), async (req, res) => { 
        //     return res.json(req.user);  
        // });

    }
}
module.exports = JwtRouter