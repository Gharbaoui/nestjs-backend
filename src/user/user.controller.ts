import { Body, Controller, Get, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserAddContactDto, UserDto, UserDtoUpdate } from './dto';
import { UserGuard } from '../guards/user.guard';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}


    @UseGuards(UserGuard)
    @Post(`create`)
    createUser(@Body() dto: UserDto) /* do not chage the name becuase it's used in user guard */
    {
        return this.userService.createUser(dto);
    }

    @UseGuards(UserGuard)
    @Patch(`update`)
    updateUser(@Body() dto: UserDtoUpdate)
    {
        return this.userService.userUpdate(dto);
    }

    @UseGuards(UserGuard)
    @Post(`updatecontacts`)
    addContact(@Body() dto: UserAddContactDto)
    {
        return this.userService.contactadd(dto);
    }


    @Get('')
    getMainUser()
    {
        return this.userService.getUserInfo();
    }

}
