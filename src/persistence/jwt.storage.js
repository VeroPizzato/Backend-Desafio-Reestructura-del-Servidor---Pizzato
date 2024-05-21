const userModel = require("../dao/models/user.model")

class JwtStorage {

    constructor() {
    }

    login = async (email) => {  
        const user = await userModel.findOne({ email })
        return user
    }

}

module.exports = { JwtStorage }