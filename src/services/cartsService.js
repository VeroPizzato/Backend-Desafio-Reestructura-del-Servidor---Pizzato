class CartsService {

    constructor(storage) {
        this.storage = storage
    }

    getCarts = async() => {
        return await this.storage.getCarts()
    }

    getCartByCId = async(cid) => {
        return await this.storage.getCartByCId(cid)
    }

    addCart = async (products) => {
        await this.storage.addCart(products)
    }

    addProductToCart = async (cartId, prodId, quantity) => {        
        await this.storage.addProductToCart(cartId, prodId, quantity);       
    }

    updateCartProducts = async (cartId, products) => {  
        await this.storage.updateCartProducts(cartId, products)
    }   

    deleteCart = async (cid) => {
        await this.storage.deleteCart(cid)
    }

    deleteProductToCart = async (cartId, prodId) => {
        return await this.storage.deleteProductToCart(cartId, prodId)
    }

    // deleteAllProductCart = async (cartId) => {
    //     return await this.storage.deleteAllProductCart(cartId)
    // }
}

module.exports = { CartsService }