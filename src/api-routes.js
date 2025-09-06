import { Router } from 'express';
import * as postController from './postController.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Posts API is working by r2d2',
    version: '1.0.0'
  });
});

router.route('/posts').get(postController.index);
router.route('/posts/:id').delete(postController.delete);

export default router;