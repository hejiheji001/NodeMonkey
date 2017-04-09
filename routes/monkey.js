var express = require('express');
var conf = require('../config/conf.js');
var router = express.Router();
router.get('/', function(req, res, next) {
    conf.insertion = req.query.name;
    res.render('proxy', { title: 'AnyProxy', message: conf.insertion });
});
module.exports = router;;
