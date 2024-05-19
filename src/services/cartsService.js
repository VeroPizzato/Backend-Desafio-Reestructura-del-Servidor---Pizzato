class CartsService {

    constructor(storage) {
        this.storage = storage
    }

    getAll = async() => {
        return await this.storage.getAll()
    }

    getById = async(cid) => {
        return await this.storage.getById(cid)
    }

    createOne = async (products) => {
        await this.storage.createOne(products)
    }

    createOneToCart = async (idCart, idProd, quantity) => {        
        await this.storage.createOneToCart(idCart, idProd, quantity);       
    }

    updateOne = async (cartId, products) => {  
        await this.storage.updateOne(cartId, products)
    }

    updateOneToCart = async (cartId, prodId, quantity) => {
        return await this.storage.updateOneToCart(cartId, prodId, quantity)
    }

    deleteById = async (cid) => {
        await this.storage.deleteById(cid)
    }

    deleteByIdToCart = async (cartId, prodId) => {
        return await this.service.deleteByIdToCart(cartId, prodId)
    }
}

module.exports = { CartsService }