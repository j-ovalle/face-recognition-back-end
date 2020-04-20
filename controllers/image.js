const clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'e548b3c6fe6f4f5dbe7f88abad8d207c'
})

const handleApiCall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
}

const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to get entries'));
}

module.exports = {
    handleImage,
    handleApiCall
}