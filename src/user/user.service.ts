import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto, UserDtoUpdate } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor (
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService
    ) {}
    async createUser (data: UserDto)
    {
        try {
            let user = await this.prismaService.user.findMany();
            if (user.length === 0){
                return await this.prismaService.user.create({data});
            }
            return `user is already exist you may want to change!!`;
        } catch(err) {
            throw new ForbiddenException(`we could not insert the user`);
        }
    }

    async getUserInfo()
    {
        const user = await this.prismaService.user.findMany();
        return user[0];
    }

    async userUpdate(data: UserDtoUpdate)
    {
        const old_user = await this.prismaService.user.findMany();
        const new_user = await this.prismaService.user.update({
            where: {
                id: old_user[0].id
            },
            data
        });
        delete new_user.id;
        return new_user;
    }

}
