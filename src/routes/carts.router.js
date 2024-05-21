const { validarNuevoCarrito, validarCarritoExistente } = require('../middlewares/cart.middleware')
const { validarProductoExistente } = require('../middlewares/product.middleware')
const { CartsController } = require('../controllers/carts.controller')
const { CartsService } = require('../services/carts.service')
const Router = require('./router')

const withController = callback => {
    return (req, res) => {
        const service = new CartsService(
            req.app.get('carts.storage')
        )                       
        const controller = new CartsController(service)
        return callback(controller, req, res)
    }
}

class CartsRouter extends Router {
    init() {
        this.router.param('pid', (req, res, next, value) => {
            const isValid = /^[a-z0-9]+$/.test(value)
            if (!isValid)
                return sendUserError('Invalid param pid')
                //return res.status(400).send('Invalid param pid')
            req.pid = value
            next()
        })

        this.router.param('cid', (req, res, next, value) => {
            const isValid = /^[a-z0-9]+$/.test(value)            
            if (!isValid)
                return sendUserError('Invalid param cid')
                //return res.status(400).send('Invalid param cid')
            req.cid = value
            next()
        })

        this.get('/', withController((controller, req, res) => controller.getCarts(req, res)))

        this.get('/:cid', validarCarritoExistente, withController((controller, req, res) => controller.getCartByCId(req, res)))     

        this.post('/', validarNuevoCarrito, withController((controller, req, res) => controller.addCart(req, res))) 

        this.post('/:cid/products/:pid', validarCarritoExistente, withController((controller, req, res) => controller.createProductToCart(req, res)))
  
        this.put('/:cid', validarCarritoExistente, withController((controller, req, res) => controller.updateCartProducts(req, res)))

        this.put('/:cid/products/:pid', validarCarritoExistente, validarProductoExistente, withController((controller, req, res) => controller.updateProductToCart(req, res))) 
     
        this.delete('/:cid', validarCarritoExistente, withController((controller, req, res) => controller.deleteCart(req, res)))
     
        this.delete('/:cid/products/:pid', validarCarritoExistente, validarProductoExistente, withController((controller, req, res) => controller.deleteProductToCart(req, res)))      

        //this.delete('/:cid', validarCarritoExistente, withController((controller, req, res) => controller.deleteAllProductCart(req, res)))
    }
}

module.exports = CartsRouter 

