import { IsArray, IsNotEmpty, IsString } from "class-validator";



export class UserDto {
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @IsString()
    @IsNotEmpty()
    user_image: string;

    @IsString()
    @IsNotEmpty()
    user_bio: string;

    @IsArray()
    contact: Array<{
        contact_media: string,
        contact_url: string,
        other: string,
        other_identifier: string,  
    }>;

    @IsNotEmpty()
    @IsString()
    password: string;
}