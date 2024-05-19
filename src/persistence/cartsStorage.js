const App = require('../app')
class CartsStorage {

    getAll = async () => {
        const CartManager = App.get('CartManager')
        const carts = await CartManager.getCarts()
        return carts
    }

    getById = async (cid) => {
        const CartManager = App.get('CartManager')
        let cartByCID = await CartManager.getCartByCId(cid)
        return cartByCID
    }

    createOne = async (products) => {
        const CartManager = App.get('CartManager')
        await CartManager.addCart(products)
    }

    createOneToCart = async (idCart, idProd, quantity) => {
        const CartManager = App.get('CartManager')
        await CartManager.addProductToCart(idCart, idProd, quantity)
    }

    updateOne = async (cartId, products) => {
        const CartManager = App.get('CartManager')
        await CartManager.updateCartProducts(cartId, products)
    }

    updateOneToCart = async (cartId, prodId, quantity) => {
        const CartManager = App.get('CartManager')
        const result = await CartManager.addProductToCart(cartId, prodId, quantity)
        return result
    }

    deleteById = async (cid) => {
        const CartManager = App.get('CartManager')
        await CartManager.deleteCart(cid)
    }

    deleteByIdToCart = async (cartId, prodId) => {
        const CartManager = App.get('CartManager')
        const result = await CartManager.deleteProductCart(cartId, prodId)
        return result
    }
}

module.exports = { CartsStorage }