import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";



export class UserDto {
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @IsString()
    @IsNotEmpty()
    user_image: string;

    @IsString()
    @IsNotEmpty()
    user_biography: string;

    @IsArray()
    contact: Array<{
        contact_media: string,
        contact_url: string,
        other: string,
        other_identifier: string,  
    }>;
}

export class UserDtoUpdate {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    full_name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    user_image: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    user_biography: string;

    @IsArray()
    @IsOptional()
    contact: Array<{
        contact_media: string,
        contact_url: string,
        other: string,
        other_identifier: string,  
    }>;
}