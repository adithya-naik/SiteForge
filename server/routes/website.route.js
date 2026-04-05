import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { generateWebsite, getWebsiteById } from '../controllers/website.controller.js';

const websiteRouter = express.Router();

websiteRouter.post('/generate',isAuth, generateWebsite);
websiteRouter.get('/get-by-id/:id',isAuth, getWebsiteById);

export default websiteRouter;