
class CartsController {

    constructor(cartsService) {
        this.service = cartsService
    }
    
    getAll = async (_, res) => {
        try {
            const carts = await this.service.getAll()
            return res.Success(carts)
        }
        catch (err) {           
            return res.sendServerError(err)
            // return res.status(500).json({
            //     message: err.message
            // })
        }
    }

    getById = async (req, res) => {
        try {
            let cidCart = req.cid
            let cartByCID = await this.service.getById(cidCart)
            if (!cartByCID) {
                return res.sendNotFoundError('Id inexistente!')
                //return res.status(404).json({ error: "Id inexistente!" })  // HTTP 404 => el ID es válido, pero no se encontró ese carrito                
            }
            res.sendSuccess(cartByCID)
            //res.status(200).json(cartByCID)    // HTTP 200 OK     
        }
        catch {
            return res.sendServerError(err)
            // return res.status(500).json({
            //     message: err.message
            // })
        }
    }

    createOne = async (req, res) => {
        try {         
            let { products } = req.body 
            await this.service.createOne(products)     
            res.sendCreatedSuccess('Carrito agregado correctamente')
            //res.status(201).json({ message: "Carrito agregado correctamente" })  // HTTP 201 OK      

        } catch (err) {
            res.sendUserError(err)
            // return res.status(400).json({
            //     message: err.message
            // })
        }
    }

    createOneToCart = async (req, res) => {
        try {            
            let idCart = req.cid
            let idProd = req.pid
            let quantity = 1
            await this.service.createOneToCart(products)
            res.sendSuccess(`Se agregaron ${quantity} producto/s con ID ${idProd} al carrito con ID ${idCart}`)
            //res.status(200).json(`Se agregaron ${quantity} producto/s con ID ${idProd} al carrito con ID ${idCart}`)    // HTTP 200 OK
        } catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({
            //     message: err.message
            // })
        }
    }

    updateOne = async (req, res) => {
        try {           
            let cartId = req.cid
            const { products } = req.body
            await this.service.updateOne(products)
            // HTTP 200 OK 
            res.status(200).json(`Los productos del carrito con ID ${cartId} se actualizaron exitosamente.`)
        }
        catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({ message: err.message })
        }
    }

    updateOneToCart = async (req, res) => {
        try {            
            let cartId = req.cid
            let prodId = req.pid
            const quantity = +req.body.quantity
            const result = await this.service.updateOneToCart(cartId, prodId, quantity)
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
    }

    deleteById = async (req, res) => {
        try {
            let cartId = req.cid
            await this.service.deleteById(cartId)             
            res.status(200).json({ message: "Carrito eliminado correctamente" })  // HTTP 200 OK     
        } catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({
            //     message: err.message
            // })
        }
    }

    deleteByIdToCart = async (req, res) => {
        try {            
            let cartId = req.cid
            let prodId = req.pid           
            const result = await this.service.deleteByIdToCart(cartId, prodId)
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
    }
}

module.exports = { CartsController }