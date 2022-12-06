import {ArrayNotEmpty, IsBoolean, IsDefined, IsNotEmpty, IsPositive, IsString, Min } from "class-validator";

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

export class ArticlePreqsUpdateDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    preqs: Preq;
    @IsDefined()
    index:number;
}


export class ArticlePreqsAddDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    preqs: Preq;
}


export class ArticlePreqsRemoveDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    index:number;
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

export class ArticleExplainedDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    @IsString()
    explain_txt: string;
    @IsDefined()
    explain_img: {path:string, is_local:string};
    @IsDefined()
    code_snipest: {source_code:string, language:string};
}

export class BasicArticleDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    @IsString()
    title: string;
    @IsDefined()
    @IsString()
    idea: string;
    @IsDefined()
    @IsString()
    logo: string;
}