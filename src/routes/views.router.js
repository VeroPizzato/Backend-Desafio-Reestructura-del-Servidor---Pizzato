const { validarNuevoProducto } = require('../middlewares/product.middleware')
const { userIsLoggedIn, userIsNotLoggedIn, userIsAdmin } = require('../middlewares/auth.middleware')

const Router = require('./router')

class ViewsRouter extends Router {
    init() {
        this.param('pid', (req, res, next, value) => {
            const isValid = /^[a-z0-9]+$/.test(value)
            if (!isValid)
                return res.sendUserError('Invalid param pid')
                //return res.status(400).send('Invalid param pid')
            req.pid = value
            next()
        })

        this.param('cid', (req, res, next, value) => {
            const isValid = /^[a-z0-9]+$/.test(value)
            if (!isValid)
                return res.sendUserError('Invalid param cid')
                //return res.status(400).send('Invalid param cid')
            req.cid = value
            next()
        })

        this.get('/', (req, res) => {
            const isLoggedIn = ![null, undefined].includes(req.session.user)

            res.render('index', {
                title: 'Inicio',
                isLoggedIn,
                isNotLoggedIn: !isLoggedIn,
            })
        })

        this.get('/login', userIsNotLoggedIn, (_, res) => {
            // middleware userIsNotLoggedIn: sólo se puede acceder si no está logueado
            res.render('login', {
                title: 'Login'
            })
        })

        this.get('/reset_password', userIsNotLoggedIn, (_, res) => {
            // middleware userIsNotLoggedIn: sólo se puede acceder si no está logueado
            res.render('reset_password', {
                title: 'Reset Password'
            })
        })

        this.get('/register', userIsNotLoggedIn, (_, res) => {
            // middleware userIsNotLoggedIn: sólo se puede acceder si no está logueado
            res.render('register', {
                title: 'Register'
            })
        })

        this.get('/profile', userIsLoggedIn, (req, res) => {
            //sólo se puede acceder si está logueado
            let user = req.session.user
            res.render('profile', {
                title: 'Mi perfil',
                user: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    age: user.age,
                    email: user.email
                }
            })
        })

        this.get('/products', userIsLoggedIn, async (req, res) => {
            try {
                const ProductManager = req.app.get('ProductManager')
                let products = await ProductManager.getProducts(req.query)
                let user = req.session.user

                res.render('home', {
                    title: 'Home',
                    styles: ['styles.css'],
                    products,
                    user
                })
            } catch (error) {
                console.error('Error al al cargar los productos:', error)
            }
        })

        this.get('/products/detail/:pid', userIsLoggedIn, async (req, res) => {
            try {
                const ProductManager = req.app.get('ProductManager')

                const prodId = req.pid
                const product = await ProductManager.getProductById(prodId)

                let data = {
                    title: 'Product Detail',
                    scripts: ['productoDetail.js'],
                    useSweetAlert: true,
                    styles: ['productos.css'],
                    useWS: false,
                    product
                }

                res.render('detailProduct', data)
            }
            catch (err) {
                return res.sendServerError(err)
                // return res.status(500).json({ message: err.message })
            }
        })

        this.get('/products/addCart/:pid', userIsLoggedIn, async (req, res) => {
            try {
                const CartManager = req.app.get('CartManager')
                const prodId = req.pid
                //agrego una unidad del producto al primer carrito que siempre existe
                const carts = await CartManager.getCarts()
                // console.log(JSON.stringify(carts, null, '\t'))    
                await CartManager.addProductToCart(carts[0]._id.toString(), prodId, 1);
                //res.redirect(`/products/detail/${prodId}`)  
            }
            catch (err) {
                return res.sendServerError(err)
                // return res.status(500).json({ message: err.message })
            }
        })

        this.get('/carts/:cid', userIsLoggedIn, async (req, res) => {
            try {
                const CartManager = req.app.get('CartManager')
                const cartId = req.cid
                const cart = await CartManager.getCartByCId(cartId)

                let data = {
                    title: 'Cart Detail',
                    styles: ['styles.css'],
                    useWS: false,
                    cart
                }

                res.render('detailCart', data)
            }
            catch (err) {
                return res.sendServerError(err)
                // return res.status(500).json({ message: err.message })
            }
        })

        this.get('/realtimeproducts', userIsLoggedIn, userIsAdmin, async (req, res) => {
            try {
                const ProductManager = req.app.get('ProductManager')
                const products = await ProductManager.getProducts(req.query)
                res.render('realTimeProducts', {
                    title: 'Productos en tiempo real',
                    styles: ['styles.css'],
                    products,
                    useWS: true,
                    scripts: [
                        'realTimeProducts.js'
                    ]
                })
            } catch (error) {
                console.error('Error al al cargar los productos en tiempo real:', error)
            }
        })

        this.post('/realtimeproducts', validarNuevoProducto, userIsLoggedIn, userIsAdmin, async (req, res) => {
            try {
                const ProductManager = req.app.get('ProductManager')
                const product = req.body
                // Agregar el producto en el ProductManager
                // Convertir el valor status "true" o "false" a booleano        
                var boolStatus = JSON.parse(product.status)
                product.thumbnail = ["/images/" + product.thumbnail]
                product.price = +product.price
                product.stock = +product.stock
                await ProductManager.addProduct(
                    product.title,
                    product.description,
                    +product.price,
                    product.thumbnail,
                    product.code,
                    +product.stock,
                    boolStatus,
                    product.category)
                // Notificar a los clientes mediante WS que se agrego un producto nuevo             
                req.app.get('ws').emit('newProduct', product)
                res.redirect('/realtimeproducts')
                // res.status(201).json({ message: "Producto agregado correctamente" })
            } catch (error) {
                console.error('Error al agregar el producto:', error)
            }
        })

        this.get('/newProduct', userIsLoggedIn, userIsAdmin, async (_, res) => {
            res.render('newProduct', {
                title: 'Nuevo Producto',
            })
        })

        this.get('/chat', (_, res) => {
            res.render('chat', {
                title: 'Aplicación de chat',
                useWS: true,
                useSweetAlert: true,
                scripts: [
                    'chat.js'
                ]
            })
        })
    }
}

module.exports = ViewsRouter