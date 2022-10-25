import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2';
import { userInfo } from "os";

@Injectable()
export class UserGuard implements CanActivate{
    constructor (private readonly prismaService: PrismaService) {}

    async canActivate(context: ExecutionContext) {
        try {
            // return true; // remove__ this for security
            const {body} = context.switchToHttp().getRequest();
            if (!body.full_name || !body.password)
                return false;
            const user = await this.prismaService.user.findFirst({
                where: {
                    full_name: body.full_name
                }
            });
            
            if (user && String(context.getHandler().name) == "createUser")
                    return false;
            return await argon.verify(user.password, body.password);
        } catch(err) {
            return false;
        }
    }
    
}