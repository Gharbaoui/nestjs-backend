import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAddContactDto, UserDto, UserDtoUpdate } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
    constructor (
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService
    ) {}
    async createUser (data: UserDto)
    {
        let uid = uuid();
        const user_image_path = `./uploads/user/` + uid;
        console.log(user_image_path);
        try {
            let user = await this.prismaService.user.findMany();
            if (user.length === 0){
                fs.writeFileSync(user_image_path, data.user_image);
                data.user_image = user_image_path;
                return await this.prismaService.user.create({data});
            }
            return {failed:true, msg:`user is already exist you may want to change!!`};
        } catch(err) {
            return {failed: true, msg: `we could not insert the user`};
        }
    }

    async getUserInfo()
    {
        const user = await this.prismaService.user.findMany();
        if (user.length === 0)
            return `no user found`;
        user[0].user_image = fs.readFileSync(user[0].user_image, 'utf8');
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
            return {failed: true, msg: `user could not be updated`};
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
            return {failed: true, msg: `contact updated failed`};
        }
    }
}
