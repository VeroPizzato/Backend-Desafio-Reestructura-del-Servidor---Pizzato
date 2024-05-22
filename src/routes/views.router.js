const { validarNuevoProducto } = require('../middlewares/product.middleware')
const { userIsLoggedIn, userIsNotLoggedIn, userIsAdmin } = require('../middlewares/auth.middleware')
const { ViewsController } = require('../controllers/views.controller')
const { CartsService } = require('../services/carts.service')
const { ProductsService } = require('../services/products.service')

const Router = require('./router')
const { ProductsStorage } = require('../persistence/products.storage')

const withController = callback => {
    return (req, res) => {        
        const cartsService = new CartsService(           
            req.app.get('carts.storage')
        )                    
        const productsService = new ProductsService(           
            req.app.get('products.storage')
        )             
        const controller = new ViewsController(cartsService, productsService)
        return callback(controller, req, res)
    }
}

class ViewsRouter extends Router {
    init() {
        this.router.param('pid', (req, res, next, value) => {
            const isValid = /^[a-z0-9]+$/.test(value)
            if (!isValid)
                return res.sendUserError('Invalid param pid')
                //return res.status(400).send('Invalid param pid')
            req.pid = value
            next()
        })

        this.router.param('cid', (req, res, next, value) => {
            const isValid = /^[a-z0-9]+$/.test(value)
            if (!isValid)
                return res.sendUserError('Invalid param cid')
                //return res.status(400).send('Invalid param cid')
            req.cid = value
            next()
        })

        this.get('/', withController((controller, req, res) => controller.home(req, res)))

        this.get('/login', userIsNotLoggedIn, withController((controller, req, res) => controller.login(req, res)))
        
        this.get('/reset_password', userIsNotLoggedIn, withController((controller, req, res) => controller.reset_password(req, res)))

        this.get('/register', userIsNotLoggedIn, withController((controller, req, res) => controller.register(req, res)))

        this.get('/profile', userIsLoggedIn, withController((controller, req, res) => controller.profile(req, res)))
        
        this.get('/products', userIsLoggedIn, withController((controller, req, res) => controller.getProducts(req, res)))

        this.get('/products/detail/:pid', userIsLoggedIn, withController((controller, req, res) => controller.getProductDetail(req, res)))

        this.get('/products/addcart/:pid', userIsLoggedIn, withController((controller, req, res) => controller.addProductToCart(req, res)))

        this.get('/carts/:cid', userIsLoggedIn, withController((controller, req, res) => controller.getCartById(req, res)))

        this.get('/realtimeproducts', userIsLoggedIn, userIsAdmin, withController((controller, req, res) => controller.getRealTimeProducts(req, res)))

        this.post('/realtimeproducts', validarNuevoProducto, userIsLoggedIn, userIsAdmin, withController((controller, req, res) => controller.postRealTimeProducts(req, res)))

        this.get('/newProduct', userIsLoggedIn, userIsAdmin, withController((controller, req, res) => controller.newProduct(req, res)))

        this.get('/chat', withController((controller, req, res) => controller.chat(req, res)))     
    }
}

module.exports = ViewsRouter