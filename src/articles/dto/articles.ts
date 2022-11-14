import {ArrayNotEmpty, IsBoolean, IsDefined, IsNotEmpty, IsPositive, IsString, Max, Min } from "class-validator";

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
    @IsDefined()
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

export class ArticleTitleDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    @IsBoolean()
    add: boolean;
    @IsDefined()
    @IsString()
    title: string;
}

export class ArticleIdeaDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    @IsBoolean()
    add: boolean;
    @IsDefined()
    @IsString()
    idea: string;
}

interface Preq {
    req_title: string;
    req_url: string;
    is_local_article: boolean;
}

export class ArticlePreqsDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    @ArrayNotEmpty()
    preqs: Array<Preq>;
    @IsDefined()
    @IsBoolean()
    add: boolean;
}

export class ArticleLogoDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    @IsString()
    logo: string;
}

export class ArticleConclusionDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    @IsBoolean()
    add: boolean;
    @IsDefined()
    @IsString()
    conclusion: string;
}