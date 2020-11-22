import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: number;
    iat: number;
    exp: number;
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if(!authorization) {
        return res.status(401).json({
            error: 'Unauthorized user'
        });
    }

    const token = authorization.replace('Bearer', '').trim();
    
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY || 'secretDev');
        const { id } = data as TokenPayload;
        req.userId = id;

        return next();
    } catch {
        return res.status(401).json({
            error: 'Unauthorized user'
        });
    }
}