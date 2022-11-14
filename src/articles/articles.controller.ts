import { Body, Controller, Get, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserGuard } from 'src/guards/user.guard';
import { ArticlesService } from './articles.service';
import { ArticleIdeaDto, ArticleNextPrevDto, ArticlePreqsDto, ArticleSearchKeywordsDto, ArticleStateDto, ArticleTitleDto } from './dto';

@Controller('articles')
export class ArticlesController {
    constructor(
        private readonly articlesService: ArticlesService
    ){}

    @UseGuards(UserGuard)
    @Post('createempty')
    createEmptyArticle()
    {
        return this.articlesService.emptyArticle();
    }

    @UseGuards(UserGuard)
    @Patch('state')
    stateUpdate(@Body() dto: ArticleStateDto)
    {
        return this.articlesService.stateUpdate(dto);
    }

    @UseGuards(UserGuard)
    @Patch('searchkeywords')
    searchKeywordsUpdate(@Body() dto: ArticleSearchKeywordsDto){
        return this.articlesService.searchKeywordsUpdate(dto);
    }

    @UseGuards(UserGuard)
    @Patch('nextprvarticle')
    nextPrvArticleUpdate(@Body() dto: ArticleNextPrevDto)
    {
        return this.articlesService.articlesInRow(dto);
    }
    @UseGuards(UserGuard)
    @Patch('titleupdate')
    titleUpdate(@Body() dto: ArticleTitleDto)
    {
        return this.articlesService.titleUpdate(dto);
    }

    @UseGuards(UserGuard)
    @Patch('ideaupdate')
    ideaUpdate(@Body() dto: ArticleIdeaDto)
    {
        return this.articlesService.ideaUpdate(dto);
    }

    @UseGuards(UserGuard)
    @Patch('prequpdate')
    preqUpdate(@Body() dto: ArticlePreqsDto) {
        return this.articlesService.preqUpdate(dto);
    }
}
