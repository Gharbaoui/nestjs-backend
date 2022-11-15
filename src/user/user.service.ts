import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAddContactDto, UserDto, UserDtoUpdate } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';

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
        if (user.length === 0)
            return `no user found`;
        return user[0];
    }

    async userUpdate(data: UserDtoUpdate)
    {
        try {
            const old_user = await this.prismaService.user.findMany();
            if (old_user.length === 0)
                return `no user found`;
            const new_user = await this.prismaService.user.update({
                where: {
                    id: old_user[0].id
                },
                data
            });
            delete new_user.id;
            return new_user;
        } catch(err) {
            return `user could not be updated`;
        }
    }

    async contactadd(data: UserAddContactDto) {
        try {
            const old_user = await this.prismaService.user.findMany();
            if (old_user.length === 0)
                return `no user found`;
            const new_contact = old_user[0].contact as Prisma.JsonArray;
            new_contact.push({
                other: data.other,
                contact_url: data.contact_url,
                contact_media: data.contact_media,
                other_identifier: data.other_identifier
            });
            
           const new_user = await this.prismaService.user.update({
            where: {
                id: old_user[0].id
            },
            data:{
                contact: new_contact
            }
           });
           return new_user;
        } catch(err) {
            return `contact updated failed`;
        }
    }
}
