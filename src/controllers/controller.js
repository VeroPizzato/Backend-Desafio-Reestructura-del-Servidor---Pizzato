
class Controller {
    handleError(res, err) {
        if (err.message === 'not found') {
            return res.status(404).json({ error: 'Not found' })
        }

        if (err.message === 'invalid parameters') {
            return res.status(400).json({ error: 'Invalid parameters' })
        }

        return res.status(500).json({ error: err })
    }




    
}

module.exports = Controller
