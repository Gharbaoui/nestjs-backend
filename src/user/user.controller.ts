import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Post('create')
    createUser(@Body() dto: UserDto) {
        return this.userService.createUser(dto);
    }
}
