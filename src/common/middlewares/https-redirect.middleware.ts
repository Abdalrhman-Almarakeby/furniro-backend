import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isLocalhost =
      req.hostname === 'localhost' ||
      req.hostname === '127.0.0.1' ||
      req.hostname.startsWith('192.168.');

    if (
      !isLocalhost &&
      !req.secure &&
      req.get('x-forwarded-proto') !== 'https'
    ) {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }

    next();
  }
}
