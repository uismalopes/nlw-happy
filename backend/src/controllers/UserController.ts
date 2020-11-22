import { Response, Request } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import userView from '../views/users_view';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import * as Yup from 'yup';

function generateToken(id: number){
    return jwt.sign({ id }, process.env.SECRET_KEY || 'secretDev', { expiresIn: '1d' });
}

export default {
    async store(req: Request, res: Response){
        const repository = getRepository(User);
        const { name, email, password } = req.body;
        
        const userExists = await repository.findOne({ 
            where: { email }
        });

        if(userExists) {
            return res.status(409).json({ message: 'User exists'});
        }

        const data = {
            name,
            email, 
            password
        }

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required(), 
            password: Yup.string().required()
        });

        await schema.validate(data,{
            abortEarly: false
        });

        const user = repository.create(data);
        await repository.save(user);
        const token = generateToken(user.id);

        return res.json({user: userView.render(user), token});
    },
    async authenticate(req: Request, res: Response){
        const repository = getRepository(User);
        const { email, password } = req.body;
        const user = await repository.findOne({ where: { email } });
        
        if(!user){
            return res.status(401).json({ message: 'User not found'});
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) {
            return res.status(401).json({ message: 'E-mail or passaword invalid' });
        }
        const token = generateToken(user.id);
        
        return res.json({
            user: userView.render(user),
            token
        });
    }
}