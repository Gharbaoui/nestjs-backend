import {ArrayNotEmpty, IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class ArticleStateDto {
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
    @IsBoolean()
    update_prv: boolean;
    @IsDefined()
    @IsBoolean()
    update_next: boolean;
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

export class ArticleExplainedAddDto {
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

export class ArticleExplainedUpdateDto {
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
    @IsDefined()
    @IsNumber()
    index:number;
}


export class ArticleExplainedRemoveDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    @IsNumber()
    index:number;
}

export class ArticleExplainedTxtDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    @IsNumber()
    index:number;
    @IsDefined()
    @IsString()
    explain_txt:string;
}

export class ArticleExplainedImgDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    @IsNumber()
    index:number;
    @IsDefined()
    explain_img: {path:string, is_local:string};   
}


export class ArticleExplainedCodeDto {
    @IsPositive()
    @IsDefined()
    id:number;
    @IsDefined()
    @IsNumber()
    index:number;
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