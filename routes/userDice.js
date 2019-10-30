const express = require('express');
const router = express.Router();
const UserDice = require('../models/UserDice');
// Cloudinary API
const uploadCloud = require('../config/cloudinary.js');
// const { parser } = require('../config/cloudinary.js'); // TODO: Check if this is really necessary

// Load middlewares
const {
    notLoggedIn
} = require('../middlewares/auth');

router.get('/create-dice', notLoggedIn, async (req, res, next) => {
    const user = req.session.currentUser;

    res.render('stories/createDice', {
        user
    });
});

router.post('/create-dice', notLoggedIn, uploadCloud.array('sides', 6), async (req, res, next) => {
    const {
        name
    } = req.body
    const response = req.files;
    const urls = response.map(element => element.url);
    const id = req.session.currentUser._id;
    //const diceSide = req.file.url;
    console.log(urls)
    await UserDice.create({
        author: id,
        icon: urls,
        name: name
    });
    res.redirect('/stories/');
});
module.exports = router;