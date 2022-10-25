import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserDto } from './dto';
import { UserGuard } from './user.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}


    @UseGuards(UserGuard)
    @Post('create')
    createUser(@Body() dto: UserDto) /* do not chage the name becuase it's used in user guard */
    {
        return this.userService.createUser(dto);
    }

    @Get('')
    getMainUser()
    {
        return this.userService.getUserInfo();
    }
}
