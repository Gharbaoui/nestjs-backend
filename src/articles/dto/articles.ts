import {ArrayNotEmpty, IsDefined, IsNotEmpty, IsPositive, Max, Min } from "class-validator";

export class ArticleStateDto {
    @IsNotEmpty()
    state: boolean;
    @IsPositive()
    id: number;
}

export class ArticleSearchKeywordsDto {
    @IsPositive()
    id: number;
    @ArrayNotEmpty()
    search_keywords: string[]
    @IsDefined()
    add_keywords: boolean; // if false insert if true add  
}

export class ArticleNextPrevDto {
    @IsPositive()
    id:number;
    @IsDefined()
    @Min(-1)
    next: number;
    @IsDefined()
    @Min(-1)
    prev: number;
    @IsDefined()
    update_prv: boolean;
}