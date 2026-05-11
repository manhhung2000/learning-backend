import { Injectable, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminGetUserCommand,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  AdminDeleteUserCommand,
  AdminListGroupsForUserCommand,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { S3Service } from '@modules/storage/s3.service';

export interface CognitoUser {
  username: string;
  email: string;
  name: string;
  status: string;
  role: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  private readonly client: CognitoIdentityProviderClient;
  private readonly userPoolId: string;

  constructor(
    private configService: ConfigService,
    private s3Service: S3Service,
  ) {
    this.client = new CognitoIdentityProviderClient({
      region: this.configService.getOrThrow('COGNITO_REGION'),
    });
    this.userPoolId = this.configService.getOrThrow('COGNITO_USER_POOL_ID');
  }

  async findAll(): Promise<CognitoUser[]> {
    const { Users = [] } = await this.client.send(
      new ListUsersCommand({ UserPoolId: this.userPoolId }),
    );

    return Promise.all(
      Users.map(async (u) => {
        const attrs = u.Attributes ?? [];
        const get = (name: string) =>
          attrs.find((a) => a.Name === name)?.Value ?? '';

        const { Groups = [] } = await this.client.send(
          new AdminListGroupsForUserCommand({
            UserPoolId: this.userPoolId,
            Username: u.Username!,
          }),
        );

        const avatarKey = get('picture');
        const avatarUrl = avatarKey
          ? await this.s3Service.getPresignedUrl(avatarKey)
          : null;

        return {
          username: u.Username!,
          email: get('email'),
          name: get('name'),
          status: u.UserStatus ?? 'UNKNOWN',
          role: Groups[0]?.GroupName ?? null,
          avatarUrl,
          createdAt: u.UserCreateDate!,
        };
      }),
    );
  }

  async create(
    payload: { name: string; email: string; role: string },
    file?: Express.Multer.File,
  ): Promise<void> {
    const userAttributes: { Name: string; Value: string }[] = [
      { Name: 'email', Value: payload.email },
      { Name: 'name', Value: payload.name },
      { Name: 'email_verified', Value: 'true' },
    ];

    let username: string;
    try {
      const { User } = await this.client.send(
        new AdminCreateUserCommand({
          UserPoolId: this.userPoolId,
          Username: payload.email,
          UserAttributes: userAttributes,
          DesiredDeliveryMediums: ['EMAIL'],
        }),
      );
      username = User!.Username!;
    } catch (err: unknown) {
      if ((err as { name?: string }).name === 'UsernameExistsException') {
        throw new ConflictException(
          'An account with this email already exists.',
        );
      }
      throw err;
    }

    await this.client.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: this.userPoolId,
        Username: username,
        GroupName: payload.role,
      }),
    );

    if (file) {
      const key = await this.s3Service.upload(file, 'avatars');
      await this.client.send(
        new AdminUpdateUserAttributesCommand({
          UserPoolId: this.userPoolId,
          Username: username,
          UserAttributes: [{ Name: 'picture', Value: key }],
        }),
      );
    }
  }

  async update(
    username: string,
    payload: {
      name?: string;
      role?: string;
      file?: Express.Multer.File;
    },
  ): Promise<{ avatarUrl?: string }> {
    const result: { avatarUrl?: string } = {};

    if (payload.name) {
      await this.client.send(
        new AdminUpdateUserAttributesCommand({
          UserPoolId: this.userPoolId,
          Username: username,
          UserAttributes: [{ Name: 'name', Value: payload.name }],
        }),
      );
    }

    if (payload.role) {
      const { Groups = [] } = await this.client.send(
        new AdminListGroupsForUserCommand({
          UserPoolId: this.userPoolId,
          Username: username,
        }),
      );

      await Promise.all(
        Groups.map((g) =>
          this.client.send(
            new AdminRemoveUserFromGroupCommand({
              UserPoolId: this.userPoolId,
              Username: username,
              GroupName: g.GroupName!,
            }),
          ),
        ),
      );

      await this.client.send(
        new AdminAddUserToGroupCommand({
          UserPoolId: this.userPoolId,
          Username: username,
          GroupName: payload.role,
        }),
      );
    }

    if (payload.file && payload.file.size > 0) {
      const key = await this.s3Service.upload(payload.file, 'avatars');

      await this.client.send(
        new AdminUpdateUserAttributesCommand({
          UserPoolId: this.userPoolId,
          Username: username,
          UserAttributes: [{ Name: 'picture', Value: key }],
        }),
      );

      result.avatarUrl = await this.s3Service.getPresignedUrl(key);
    } else if (payload.file && payload.file.size === 0) {
      const { UserAttributes = [] } = await this.client.send(
        new AdminGetUserCommand({
          UserPoolId: this.userPoolId,
          Username: username,
        }),
      );

      const oldKey = UserAttributes.find((a) => a.Name === 'picture')?.Value;
      if (oldKey) await this.s3Service.delete(oldKey);

      await this.client.send(
        new AdminUpdateUserAttributesCommand({
          UserPoolId: this.userPoolId,
          Username: username,
          UserAttributes: [{ Name: 'picture', Value: '' }],
        }),
      );
    }

    return result;
  }

  async remove(username: string): Promise<void> {
    await this.client.send(
      new AdminDeleteUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      }),
    );
  }
}
