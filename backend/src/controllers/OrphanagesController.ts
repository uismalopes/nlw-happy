import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';

import * as Yup from 'yup';
import orphanages_view from '../views/orphanages_view';

export default {
    async index(req: Request, res: Response){
        const OrphanagesRepository = getRepository(Orphanage);

        const orphanages = await OrphanagesRepository.find({
            relations: ['images'],
            where: { published: true }
        });
        
        return res.json(orphanageView.renderMany(orphanages));
    },
    async show(req: Request, res: Response){
        const { id } = req.params;
        const OrphanagesRepository = getRepository(Orphanage);

        const orphanage = await OrphanagesRepository.findOneOrFail(id, {
            relations: ['images'],
            where: { published: true }
        });

        return res.json(orphanageView.render(orphanage));
    },
    async indexDashboard(req: Request, res: Response){
        const OrphanagesRepository = getRepository(Orphanage);

        const orphanages = await OrphanagesRepository.find({
            relations: ['images']
        });
        
        return res.json(orphanageView.renderMany(orphanages));
    },
    async showDashboard(req: Request, res: Response){
        const { id } = req.params;
        const OrphanagesRepository = getRepository(Orphanage);

        const orphanage = await OrphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        });

        return res.json(orphanageView.render(orphanage));
    },

    async create(req: Request, res: Response){
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            phone
        } = req.body;

        const OrphanagesRepository = getRepository(Orphanage);

        const requestImages = req.files as Express.Multer.File[];
        const images = requestImages.map(image =>{
            return { path: image.filename };
        });

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            images,
            phone
        };

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required()
                })
            ),
            phone: Yup.string().min(10).max(11)
        });

        await schema.validate(data, {
            abortEarly: false
        });

        const orphanage = OrphanagesRepository.create(data);
        
        await OrphanagesRepository.save(orphanage);
    
        return res.status(201).json(orphanageView.render(orphanage));
    },

    async update(req: Request, res: Response){
        const { id } = req.params;
        
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            phone,
            published
        } = req.body;
        
        const OrphanagesRepository = getRepository(Orphanage);

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            phone,
            published
        };

        const schema = Yup.object().shape({
            name: Yup.string(),
            latitude: Yup.number(),
            longitude: Yup.number(),
            about: Yup.string().max(300),
            instructions: Yup.string(),
            opening_hours: Yup.string(),
            open_on_weekends: Yup.boolean(),
            phone: Yup.string().min(10).max(11)
        });

        await schema.validate(data, {
            abortEarly: false
        });

        const orphanage = await OrphanagesRepository.findOneOrFail({ 
            where: { id },
            relations: ['images']
        });

        OrphanagesRepository.merge(orphanage, data);

        const results = await OrphanagesRepository.save(orphanage);

        return res.json(orphanages_view.render(results));
    },

    async delete(req: Request, res: Response){
        const OrphanagesRepository = getRepository(Orphanage);
        const { id } = req.params;

        await OrphanagesRepository.delete({ id: parseInt(id) });

        return res.json({ message: true });
    }
};