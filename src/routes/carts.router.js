const { validarNuevoCarrito, validarCarritoExistente } = require('../middlewares/cart.middleware')
const { validarProductoExistente } = require('../middlewares/product.middleware')

const Router = require('./router')

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

        this.get('/', async (req, res) => {
            try {
                const CartManager = req.app.get('CartManager')
                const carts = await CartManager.getCarts()
                //res.status(200).json(carts)  // HTTP 200 OK
                res.Success(carts)
                return
            }
            catch (err) {
                return res.sendServerError(err)
                // return res.status(500).json({
                //     message: err.message
                // })
            }
        })

        this.get('/:cid', validarCarritoExistente, async (req, res) => {
            const CartManager = req.app.get('CartManager')
            let cidCart = req.cid
            let cartByCID = await CartManager.getCartByCId(cidCart)
            if (!cartByCID) {
                res.sendNotFoundError('Id inexistente!')
                //res.status(404).json({ error: "Id inexistente!" })  // HTTP 404 => el ID es válido, pero no se encontró ese carrito
                return
            }
            res.sendSuccess(cartByCID)
            //res.status(200).json(cartByCID)    // HTTP 200 OK
        })


        this.post('/', validarNuevoCarrito, async (req, res) => {
            try {
                const CartManager = req.app.get('CartManager')
                let { products } = req.body
                await CartManager.addCart(products)
                res.sendCreatedSuccess('Carrito agregado correctamente')
                //res.status(201).json({ message: "Carrito agregado correctamente" })  // HTTP 201 OK      

            } catch (err) {
                res.sendUserError(err)
                // return res.status(400).json({
                //     message: err.message
                // })
            }
        })

        this.post('/:cid/products/:pid', validarCarritoExistente, validarProductoExistente, async (req, res) => {
            try {
                const CartManager = req.app.get('CartManager')
                let idCart = req.cid;
                let idProd = req.pid;
                let quantity = 1;

                await CartManager.addProductToCart(idCart, idProd, quantity);

                res.sendSuccess(`Se agregaron ${quantity} producto/s con ID ${idProd} al carrito con ID ${idCart}`)
                //res.status(200).json(`Se agregaron ${quantity} producto/s con ID ${idProd} al carrito con ID ${idCart}`)    // HTTP 200 OK
            } catch (err) {
                return res.sendServerError(err)
                // return res.status(500).json({
                //     message: err.message
                // })
            }
        })

        this.put('/:cid', validarCarritoExistente, async (req, res) => {
            try {
                const CartManager = req.app.get('CartManager')
                let cartId = req.cid;
                const { products } = req.body;

                await CartManager.updateCartProducts(cartId, products);

                // HTTP 200 OK 
                res.status(200).json(`Los productos del carrito con ID ${cartId} se actualizaron exitosamente.`)
            }
            catch (err) {
                return res.sendServerError(err)
                // return res.status(500).json({ message: err.message })
            }
        })

        this.put('/:cid/products/:pid', validarCarritoExistente, validarProductoExistente, async (req, res) => {
            try {
                const CartManager = req.app.get('CartManager')
                let cartId = req.cid;
                let prodId = req.pid;
                const quantity = +req.body.quantity;

                const result = await CartManager.addProductToCart(cartId, prodId, quantity);

                if (result)
                    // HTTP 200 OK 
                    res.status(200).json(`Se agregaron ${quantity} producto/s con ID ${prodId} al carrito con ID ${cartId}.`)
                else {
                    //HTTP 400 
                    res.sendUserError(err)
                    //res.status(400).json({ error: "Sintaxis incorrecta!" })
                }
            }
            catch (err) {
                return res.sendServerError(err)
                // return res.status(500).json({ message: err.message })
            }
        })

        this.delete('/:cid', validarCarritoExistente, async (req, res) => {
            try {
                const CartManager = req.app.get('CartManager')
                let cartId = req.cid;
                await CartManager.deleteCart(cid)
                res.status(200).json({ message: "Carrito eliminado correctamente" })  // HTTP 200 OK     
            } catch (err) {
                return res.sendServerError(err)
                // return res.status(500).json({
                //     message: err.message
                // })
            }
        })

        this.delete('/:cid/products/:pid', validarCarritoExistente, validarProductoExistente, async (req, res) => {
            try {
                const CartManager = req.app.get('CartManager')
                let cartId = req.cid;
                let prodId = req.pid;

                const result = await CartManager.deleteProductCart(cartId, prodId);

                if (result)
                    // HTTP 200 OK 
                    res.status(200).json(`Se eliminó el producto con ID ${prodId} del carrito con ID ${cartId}.`)
                else {
                    res.sendUserError(err)
                    // HTTP 400 
                    //res.status(400).json({ error: "Sintaxis incorrecta!" })
                }
            }
            catch (err) {
                return res.sendServerError(err)
                // return res.status(500).json({ message: err.message })
            }
        })
    }
}

module.exports = CartsRouter