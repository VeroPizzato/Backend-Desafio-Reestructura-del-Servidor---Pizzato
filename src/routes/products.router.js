const { validarNuevoProducto, validarProductoExistente, validarProdActualizado } = require('../middlewares/product.middleware')
const { ProductsController } = require('../controllers/products.controller')
const { ProductsService } = require('../services/products.service')
const Router = require('./router')

const withController = callback => {
    return (req, res) => {
        const service = new ProductsService(
            req.app.get('products.storage')
        )                       
        const controller = new ProductsController(service)
        return callback(controller, req, res)
    }
}

class ProductsRouter extends Router {
    init() {
        this.router.param('pid', (req, res, next, value) => {
            const isValid = /^[a-z0-9]+$/.test(value)
            if (!isValid)
                res.sendUserError(err)
                //return res.status(400).send('Invalid param pid')
            req.pid = value
            next()
        })

        this.get('/', withController((controller, req, res) => controller.getProducts(req, res)))      

        this.get('/:pid', validarProductoExistente, withController((controller, req, res) => controller.getProductById(req, res)))     

        this.post('/', validarNuevoProducto, withController((controller, req, res) => controller.addProduct(req, res))) 
                
        this.put('/:pid', validarProductoExistente, validarProdActualizado, withController((controller, req, res) => controller.updateProduct(req, res)))

        this.delete('/:pid', validarProductoExistente, withController((controller, req, res) => controller.deleteProduct(req, res)))      
    }
}

module.exports = ProductsRouter

