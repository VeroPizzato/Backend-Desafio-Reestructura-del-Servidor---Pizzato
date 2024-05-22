class ViewsController {

    constructor(cartsService, productsService) {         
        this.cartsService = cartsService
        this.productsService = productsService
    }

    home (req, res) {
        try {                 
            const isLoggedIn = ![null, undefined].includes(req.session.user)
            res.render('index', {
                title: 'Inicio',
                isLoggedIn,
                isNotLoggedIn: !isLoggedIn,
            })
        } catch (err) {          
            return res.sendServerError(err)
            //return res.status(500).json({ message: err.message })
        }
    }

    login (req, res) {
        try {            
            // middleware userIsNotLoggedIn: sólo se puede acceder si no está logueado
            res.render('login', {
                title: 'Login'
            })
        } catch (err) {           
            return res.sendServerError(err)
            //return res.status(500).json({ message: err.message })
        }
    }

    reset_password (req, res) {
        try {
            // middleware userIsNotLoggedIn: sólo se puede acceder si no está logueado
            res.render('reset_password', {
                title: 'Reset Password'
            })
        } catch (err) {
            return res.sendServerError(err)
            //return res.status(500).json({ message: err.message })
        }
    }

    register (req, res) {
        try {
            // middleware userIsNotLoggedIn: sólo se puede acceder si no está logueado
            res.render('register', {
                title: 'Register'
            })
        } catch (err) {
            return res.sendServerError(err)
            //return res.status(500).json({ message: err.message })
        }
    }

    profile (req, res) {
        try {
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
        } catch (err) {
            return res.sendServerError(err)
            //return res.status(500).json({ message: err.message })
        }
    }

    async getProducts (req, res) {
        try {             
            let products = await this.productsService.getProducts(req.query) 
            let user = req.session.user
            res.render('home', {
                title: 'Home',
                styles: ['styles.css'],
                products,
                user
            })
        } catch (err) { 
            console.log(err)                
            return res.sendServerError(err)
            //return res.status(500).json({ message: err.message })            
        }
    }

    async getProductDetail (req, res) {
        try {
            const prodId = req.pid
            const product = await this.productsService.getProductById(prodId)
            let data = {
                title: 'Product Detail',
                scripts: ['productoDetail.js'],
                useSweetAlert: true,
                styles: ['productos.css'],
                useWS: false,
                product
            }
            res.render('detailProduct', data)
        } catch (err) {
            return res.sendServerError(err)
            //return res.status(500).json({ message: err.message })            
        }
    }

    async addProductToCart (req, res) {
        try {
            const prodId = req.pid
            //agrego una unidad del producto al primer carrito que siempre existe
            const carts = await this.cartsService.getCarts()
            // console.log(JSON.stringify(carts, null, '\t'))    
            await this.cartsService.addProductToCart(carts[0]._id.toString(), prodId, 1);
            //res.redirect(`/products/detail/${prodId}`)  
        }
        catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({ message: err.message })
        }
    }

    async getCartById (req, res) {
        try {
            const cartId = req.cid
            const cart = await this.cartsService.getCartByCId(cartId)
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
    }

    async getRealTimeProducts (req, res) {
        try {
            const products = await this.productsService.getProducts(req.query)
            res.render('realTimeProducts', {
                title: 'Productos en tiempo real',
                styles: ['styles.css'],
                products,
                useWS: true,
                scripts: [
                    'realTimeProducts.js'
                ]
            })
        }
        catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({ message: err.message })
        }
    }

    async postRealTimeProducts (req, res) {
        try {
            const product = req.body
            // Convertir el valor status "true" o "false" a booleano        
            var boolStatus = JSON.parse(product.status)
            product.thumbnail = ["/images/" + product.thumbnail]
            product.price = +product.price
            product.stock = +product.stock
            await this.productsService.addProduct(
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
        }
        catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({ message: err.message })
        }
    }

    async newProduct (req, res) {
        try {
            res.render('newProduct', {
                title: 'Nuevo Producto',
            })
        }
        catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({ message: err.message })
        }
    }

    async chat (req, res) {
        try {
            res.render('chat', {
                title: 'Aplicación de chat',
                useWS: true,
                useSweetAlert: true,
                scripts: [
                    'chat.js'
                ]
            })
        }
        catch (err) {
            return res.sendServerError(err)
            // return res.status(500).json({ message: err.message })
        }
    }
}

module.exports = { ViewsController }