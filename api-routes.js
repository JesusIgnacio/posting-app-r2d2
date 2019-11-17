const router = require('express').Router();

router.get('/', function (req, res) {
  res.json({
    status: 0,
    message: 'Posts API Its Working by r2d2'
  });
});

var postController = require('./postController');

router.route('/posts').get(postController.index)
router.route('/posts/:id').delete(postController.delete)

module.exports = router;