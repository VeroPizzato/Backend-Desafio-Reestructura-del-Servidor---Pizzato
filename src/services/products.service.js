class ProductsService {   
    
    constructor(storage) { 
        this.storage = storage       
    }

    getProducts = async(filters) => {
        return await this.storage.getProducts(filters)
    }

    getProductById = async(pid) => {
        return await this.storage.getProductById(pid)
    }

    addProduct = async(title, description, price, thumbnail, code, stock, status, category) => {
        return await this.storage.addProduct(title, description, price, thumbnail, code, stock, status, category)
    }
    
    updateProduct = async(prodId, producto) => {
        return await this.storage.updateProduct(prodId, producto)
    }

    deleteProduct = async(prodId) => {
        return await this.storage.deleteProduct(prodId)
    }
}

module.exports = { ProductsService}