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

    async getUserInfo()
    {
        const user = await this.prismaService.user.findMany();
        delete user[0].password; // do not ever remove this line
        return user[0];
    }
}
