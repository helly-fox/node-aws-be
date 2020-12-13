import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private readonly configService;
    constructor(appService: AppService, configService: ConfigService);
    proxyRequest(req: Request, res: Response): Promise<Response<any>>;
}
