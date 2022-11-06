import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2';
import { userInfo } from "os";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserGuard implements CanActivate{
    constructor (
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext) {
        const {body} = context.switchToHttp().getRequest();
        const {password} = body;
        delete body.password;
        if (!password){
            return false;
        }
        return await argon.verify(
            this.configService.get<string> ("USER_PASSWORD_ACCESS_HASHED"),
            password
        );
    }
    
}