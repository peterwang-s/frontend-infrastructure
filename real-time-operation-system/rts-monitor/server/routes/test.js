'use strict';

import Router from 'koa-router';
import testCtl from '../controllers/test'
const router = new Router();

/**
 * test api
 */
router.get('/testMessage',testCtl.testMessage)
router.get('/render',testCtl.render)
router.post('/cacheQueue',testCtl.cacheQueue)
router.post('/clearCacheQueue',testCtl.clearCacheQueue)

export default router;
