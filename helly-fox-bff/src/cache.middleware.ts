import { Request, Response } from 'express';
const apicache = require('apicache');

export function cacheMiddleware(req: Request, res: Response, next: Function) {
    apicache.middleware('2 minutes')(req, res, next);
};
