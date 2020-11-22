import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';
import OrphanagesController from './controllers/OrphanagesController';
import UserController from './controllers/UserController';
import authMiddleware from './middlewares/authMiddleware';

const routes = Router();
const upload = multer(uploadConfig);

/** USER */
routes.post('/auth', UserController.authenticate);
routes.post('/register', UserController.store);

/** PUBLIC ROUTES ORPHANAGES */
routes.post('/orphanages', upload.array('images'), OrphanagesController.create);
routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanages/:id', OrphanagesController.show);

/** DASHBOARD */
routes.put('/orphanages/:id', authMiddleware, OrphanagesController.update);
routes.delete('/orphanages/:id', authMiddleware, OrphanagesController.delete);
routes.get('/orphanagesDashboard', authMiddleware, OrphanagesController.indexDashboard);
routes.get('/orphanagesDashboard/:id', authMiddleware, OrphanagesController.showDashboard);

export default routes;