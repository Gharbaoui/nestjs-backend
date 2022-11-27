import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserGuard } from 'src/guards/user.guard';
import { ArticlesService } from './articles.service';
import { ArticleConclusionDto, ArticleExplainedDto, ArticleIdeaDto, ArticleLogoDto, ArticleNextPrevDto, ArticlePreqsDto, ArticleSearchKeywordsDto, ArticleStateDto, ArticleTitleDto } from './dto';

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

    @UseGuards(UserGuard)
    @Patch('logoupdate')
    logoUpdate(@Body() dto: ArticleLogoDto) {
        return this.articlesService.updateLogo(dto);
    }

    @UseGuards(UserGuard)
    @Patch('conclusionupdate')
    conclusionUpdate(@Body() dto: ArticleConclusionDto) {
        return this.articlesService.updateConclusion(dto);
    }

    @UseGuards(UserGuard)
    @Patch('explainedupdate')
    explainedUpdate(@Body() dto: ArticleExplainedDto) {
        return this.articlesService.explainedUpdate(dto);
    }



    @Get('logo')
    getLogo(@Query('id', ParseIntPipe) id:number)
    {
        return this.articlesService.getLogo(id);
    }

    @Get('state')
    getState(@Query('id', ParseIntPipe) id:number) {
        return this.articlesService.getState(id);
    }
    // tests here needed
    @Get('releasetime')
    getReleaseTime(@Query('id', ParseIntPipe) id:number) {
        return this.articlesService.getReleaseTime(id);
    }

    @Get('searchkeywords')
    getSearchKeywords(@Query('id', ParseIntPipe) id:number) {
        return this.articlesService.getSearchKeywords(id);
    }

    
    @Get('nextprvarticle')
    getNextPrvArticle(@Query('id', ParseIntPipe) id:number) {
        return this.articlesService.getNextPrvArticle(id);
    }

    @Get('title')
    getTitle(@Query('id', ParseIntPipe) id:number) {
        return this.articlesService.getTitle(id);
    }

    @Get('idea')
    getIdea(@Query('id', ParseIntPipe) id:number) {
        return this.articlesService.getIdea(id);
    }

    @Get('preqs')
    getPreqs(@Query('id', ParseIntPipe) id:number) {
        return this.articlesService.getPreqs(id);
    }

    @Get('explained')
    getExplained(
    @Query('id', ParseIntPipe) id:number, @Query('index', ParseIntPipe) index: number
    ) {
        return this.articlesService.getExplaind({id, index});
    }
    

    @Get('conclusion')
    getConclusion(@Query('id', ParseIntPipe) id:number) {
        return this.articlesService.getConclusion(id);
    }
}
