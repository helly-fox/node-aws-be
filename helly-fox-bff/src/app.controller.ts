import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Method } from 'axios';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller('*')
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly configService: ConfigService,
  ) {}

  @All()
    async proxyRequest(@Req() req: Request, @Res() res: Response) {
    const { method, originalUrl, body } = req;
    const [,recipient, ...restUrlParams] = originalUrl.split('/');
    const recipientUrl = this.configService.get<string>(recipient);
    console.log( recipient, recipientUrl );

    if (!recipientUrl) {
      return res.status(502).json({error: 'Cannot process request'});
    }

    try {
      const { data } = await this.appService.proxyRequest({
        method: method as Method,
        url: `${recipientUrl}${restUrlParams.join('/')}`,
        ...(Object.keys(body || {}).length && { data: body })
      });

      return res.json(data);
    } catch (error) {
      if (error.response && error.status) {
        const {
          status,
          data
        } = error;
        res.status(status).json(data);
      } else {
        res.status(500).json({ error: error.message })
      }
    }
  }
}
