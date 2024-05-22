class ProductsService {   
    
    constructor(storage) { 
        this.storage = storage       
    }

    async getProducts (filters) {    
        return await this.storage.getProducts(filters)
    }

    async getProductById (pid) {
        return await this.storage.getProductById(pid)
    }

    async addProduct (title, description, price, thumbnail, code, stock, status, category) {
        return await this.storage.addProduct(title, description, price, thumbnail, code, stock, status, category)
    }
    
    async updateProduct (prodId, producto) {
        return await this.storage.updateProduct(prodId, producto)
    }

    async deleteProduct (prodId) {
        return await this.storage.deleteProduct(prodId)
    }
}

module.exports = { ProductsService}