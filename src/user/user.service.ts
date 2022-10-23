import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
    constructor (private readonly prismaService: PrismaService) {}
    async createUser (data: UserDto)
    {
        try {
            const user = await this.prismaService.user.create({data});
            return user;
        } catch(err) {
            throw new Error(`we could not insert the user`);
        }
    }
}
