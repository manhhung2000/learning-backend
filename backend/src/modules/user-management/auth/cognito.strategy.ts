import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

export interface CognitoUser {
  sub: string;
  email: string;
  'cognito:groups': string[];
}

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy, 'cognito') {
  constructor(configService: ConfigService) {
    const region = configService.getOrThrow<string>('COGNITO_REGION');
    const userPoolId = configService.getOrThrow<string>('COGNITO_USER_POOL_ID');
    const clientId = configService.getOrThrow<string>('COGNITO_CLIENT_ID');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
      }),
      issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
      audience: clientId,
    });
  }

  validate(payload: CognitoUser & { token_use: string }): CognitoUser {
    if (payload.token_use !== 'id') {
      throw new UnauthorizedException('Send ID token, not access token');
    }
    return {
      sub: payload.sub,
      email: payload.email,
      'cognito:groups': payload['cognito:groups'] ?? [],
    };
  }
}
