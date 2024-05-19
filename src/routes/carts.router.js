const { validarNuevoCarrito, validarCarritoExistente } = require('../middlewares/cart.middleware')
const { validarProductoExistente } = require('../middlewares/product.middleware')
const { CartsController } = require('../controllers/carts.controller')
const { CartsService } = require('../services/cartsService')

const Router = require('./router')
const { Controller } = require('../controllers/carts.controller')

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
        this.param('pid', (req, res, next, value) => {
            const isValid = /^[a-z0-9]+$/.test(value)
            if (!isValid)
                return sendUserError('Invalid param pid')
                //return res.status(400).send('Invalid param pid')
            req.pid = value
            next()
        })

        this.param('cid', (req, res, next, value) => {
            const isValid = /^[a-z0-9]+$/.test(value)
            if (!isValid)
                return sendUserError('Invalid param cid')
                //return res.status(400).send('Invalid param cid')
            req.cid = value
            next()
        })

        this.get('/', withController((controller, req, res) => controller.getAll(req, res)))

        this.get('/:cid', validarCarritoExistente, withController((controller, req, res) => controller.getById(req, res)))     

        this.post('/', validarNuevoCarrito, withController((controller, req, res) => controller.createOne(req, res))) 

        this.post('/:cid/products/:pid', validarCarritoExistente, withController((controller, req, res) => controller.createOneToCart(req, res)))
  
        this.put('/:cid', validarCarritoExistente, withController((controller, req, res) => controller.updateOne(req, res)))

        this.put('/:cid/products/:pid', validarCarritoExistente, validarProductoExistente, withController((controller, req, res) => controller.updateOneToCart(req, res))) 
     
        this.delete('/:cid', validarCarritoExistente, withController((controller, req, res) => controller.deleteById(req, res)))
     
        this.delete('/:cid/products/:pid', validarCarritoExistente, validarProductoExistente, withController((controller, req, res) => controller.deleteByIdToCart(req, res)))      
    }
}

module.exports = CartsRouter 

