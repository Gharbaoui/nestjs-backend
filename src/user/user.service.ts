import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';
import * as argon from 'argon2';


@Injectable()
export class UserService {
    constructor (private readonly prismaService: PrismaService) {}
    async createUser (data: UserDto)
    {
        try {
            data.password = await argon.hash(data.password);
            const user = await this.prismaService.user.create({data});
            return user;
        } catch(err) {
            throw new ForbiddenException(`we could not insert the user`);
        }
    }

    async updateUser(data: any) {
        try {
            const user = await this.prismaService.user.update({
                where:{
                    full_name: data.full_name
                },
                data
            });
            return user;
        } catch (err) {
            throw new ForbiddenException(`we could not update the user`);
        }
    }
}
