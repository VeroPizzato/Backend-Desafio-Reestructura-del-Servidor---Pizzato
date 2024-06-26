class ProductsController {

    constructor(productsService) {
        this.service = productsService
    }

    async getProducts (req, res) {
        try {
            const products = await this.service.getProducts(req.query)
            const result = {
                payload: products.totalDocs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
                nextlink: products.hasNextPage ? `/products?page=${products.nextPage}` : null
            }

            let status = 'success'
            if (products.docs.length === 0)
                status = 'error'
            let objResult = {
                status,
                ...result
            }

            // HTTP 200 OK
            //return res.status(200).json(objResult)
            return res.sendSuccess(objResult)
        }
        catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({
            //     message: err.message
            // })
        }
    }

    async getProductById (req, res) {
        try {
            const prodId = req.pid
            const producto = await this.service.getProductById(prodId)
            if (!producto) {
                return res.sendNotFoundError('Id inexistente!')
                // return res.status(404).json({ error: "Id inexistente!" })  // HTTP 404 => el ID es válido, pero no se encontró ese producto                
            }
            return res.sendSuccess(producto)
            //res.status(200).json(producto)    // HTTP 200 OK
        } catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({
            //     message: err.message
            // })
        }
    }

    async addProduct (req, res) {
        try {
            const { title, description, price, thumbnail, code, stock, status, category } = req.body
            await ProductManager.addProduct(title, description, price, thumbnail, code, stock, status, category)
            res.sendCreatedSuccess('Producto agregado correctamente')
            //return res.status(201).json({ success: true })
        } catch (err) {
            return res.sendUserError(err)
            // return res.status(400).json({
            //     message: err.message
            // })
        }
    }

    async updateProduct (req, res) {
        try {
            const prodId = req.pid
            const datosAUpdate = req.body
            // if (isNaN(prodId)){
            //     res.status(400).json({ error: "Invalid number format" })
            //     return
            // }
            const producto = await this.service.getProductById(prodId)
            if (!producto) {
                return res.sendNotFoundError('Id inexistente!')
                //return res.status(404).json({ error: "Id inexistente!" })  // HTTP 404 => el ID es válido, pero no se encontró ese producto                
            }
            const result = this.service.updateProduct(prodId, datosAUpdate)
            return res.sendSuccess(result)
            //return res.status(200).json(result)
        } catch (err) {
            res.sendUserError(err)
            // return res.status(400).json({
            //     message: err.message
            // })
        }
    }

    async delete (req, res) {
        try {            
            const prodId = req.pid
            const producto = await this.service.getProductById(prodId)
            if (!producto) {
                return res.sendNotFoundError('Id inexistente!')
                // return res.status(404).json({ error: "Id inexistente!" })  // HTTP 404 => el ID es válido, pero no se encontró ese producto                
            }
            await this.service.deleteProduct(prodId)
            return res.sendSuccess('Producto Eliminado correctamente')
            // return res.status(200).json({ message: "Producto Eliminado correctamente" })    // HTTP 200 OK
        }
        catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({
            //     message: err.message
            // })
        }
    }
}

module.exports = { ProductsController }
