const { CartsStorage } = require('../persistence/carts.storage')
const { CartsService } = require('../services/carts.service')
const { ProductsStorage } = require('../persistence/products.storage')
const { ProductsService } = require('../services/products.service')

const cartsStorage = new CartsStorage()
const cartsService = new CartsService(cartsStorage)
const productsStorage = new ProductsStorage()
const productsService = new ProductsService(productsStorage)

module.exports = {
    // Middleware para validacion de datos al agregar un carrito 
    validarNuevoCarrito: async (req, res, next) => {
        try {            
            const { products } = req.body
            products.forEach(async producto => {
                const prod = await this.productsService.getProductById(producto._id)
                if (!prod) {
                    res.status(400).json({ error: "Producto con ID:" + producto._id + " not Found" })
                    return
                }
                if (isNaN(producto.quantity) || (!ProductManager.soloNumPositivos(producto.quantity))) {
                    res.status(400).json({ error: "Invalid quantity format" })
                    return
                }
            })
            next()
        }
        catch {
            return res.status(400).json({ error: "Carrito nuevo invalido." })
        }
    },

    // Middleware para validacion de carrito existente 
    validarCarritoExistente: async (req, res, next) => {
        try {
            let cId = req.params.cid
            // if (isNaN(cId)) {
            //     res.status(400).json({ error: "Invalid number format" })
            //     return
            // }
            const cart = await this.cartsService.getCartByCId(cId)
            if (!cart) {
                res.status(400).json({ error: "Carrito con ID:" + cId + " not Found" })
                return
            }

            next()
        }
        catch {
            return res.status(400).json({ error: "No existe el carrito." })
        }
    }
}