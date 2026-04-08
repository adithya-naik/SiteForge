import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { changes, generateWebsite, getAllWebsites, getWebsiteById } from '../controllers/website.controller.js';

const websiteRouter = express.Router();

websiteRouter.post('/generate',isAuth, generateWebsite);
websiteRouter.get('/get-by-id/:id',isAuth, getWebsiteById);
websiteRouter.post('/update/:id',isAuth, changes);
websiteRouter.get('/get-all',isAuth, getAllWebsites);

export default websiteRouter;