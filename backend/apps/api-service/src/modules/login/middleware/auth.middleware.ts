import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoginService } from '../login.service';
import { verify } from 'jsonwebtoken';

interface DecodedInterface {
  userId: number;
  email: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private LoginService: LoginService) {}

  async use(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
      const separatedToken = token.split(' ')[1];

      const decoded = verify(separatedToken, 'secret') as DecodedInterface;
      const result = await this.LoginService.findByEmailAndId(
        decoded.email,
        decoded.userId,
      );
      if (result) {
        return next();
      } else {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}
