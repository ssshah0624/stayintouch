var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', (req, res, next) => {
  //Login logic not implemented yet
  res.status(200).json({success: true})
});

module.exports = router;
