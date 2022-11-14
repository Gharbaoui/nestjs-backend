import { Body, Controller, Get, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserGuard } from 'src/guards/user.guard';
import { ArticlesService } from './articles.service';
import { ArticleNextPrevDto, ArticleSearchKeywordsDto, ArticleStateDto } from './dto';

@Controller('articles')
export class ArticlesController {
    constructor(
        private readonly ariclesService: ArticlesService
    ){}

    @UseGuards(UserGuard)
    @Post('createempty')
    createEmptyArticle()
    {
        return this.ariclesService.emptyArticle();
    }

    @UseGuards(UserGuard)
    @Patch('state')
    stateUpdate(@Body() dto: ArticleStateDto)
    {
        return this.ariclesService.stateUpdate(dto);
    }

    @UseGuards(UserGuard)
    @Patch('searchkeywords')
    searchKeywordsUpdate(@Body() dto: ArticleSearchKeywordsDto){
        return this.ariclesService.searchKeywordsUpdate(dto);
    }

    @UseGuards(UserGuard)
    @Patch('nextprvarticle')
    nextPrvArticleUpdate(@Body() dto: ArticleNextPrevDto)
    {
        return this.ariclesService.articlesInRow(dto);
    }
}
