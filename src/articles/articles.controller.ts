import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserGuard } from 'src/guards/user.guard';
import { ArticlesService } from './articles.service';
import { ArticleConclusionDto, ArticleExplainedAddDto, ArticleExplainedCodeDto, ArticleExplainedImgDto, ArticleExplainedRemoveDto, ArticleExplainedTxtDto, ArticleExplainedUpdateDto, ArticleIdeaDto, ArticleLogoDto, ArticleNextPrevDto, ArticlePreqsAddDto, ArticlePreqsRemoveDto, ArticlePreqsUpdateDto, ArticleSearchKeywordsDto, ArticleStateDto, ArticleTitleDto, BasicArticleDto } from './dto';

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
    stateToggel(@Body() dto: ArticleStateDto)
    {
        return this.articlesService.stateToggel(dto);
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
    preqUpdate(@Body() dto: ArticlePreqsUpdateDto) {
        return this.articlesService.preqUpdate(dto);
    }

    @UseGuards(UserGuard)
    @Patch('preqremove')
    preqRemove(@Body() dto: ArticlePreqsRemoveDto) {
        return this.articlesService.preqRemove(dto);
    }

    @UseGuards(UserGuard)
    @Patch('preqadd')
    preqAdd(@Body() dto: ArticlePreqsAddDto) {
        return this.articlesService.preqAdd(dto);
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
    @Patch('explainedadd')
    explainedAdd(@Body() dto: ArticleExplainedAddDto) {
        return this.articlesService.explainedAdd(dto);
    }

    @UseGuards(UserGuard)
    @Patch('explainedupdate')
    explainedUpdate(@Body() dto: ArticleExplainedUpdateDto) {
        return this.articlesService.explainedUpdate(dto);
    }

    @UseGuards(UserGuard)
    @Patch('explainedremove')
    explainedRemove(@Body() dto: ArticleExplainedRemoveDto) {
        return this.articlesService.explainedRemove(dto);
    }

    @UseGuards(UserGuard)
    @Patch('explainedtxt')
    explainedTxt(@Body() dto: ArticleExplainedTxtDto) {
        return this.articlesService.explainedTxt(dto);
    }

    @UseGuards(UserGuard)
    @Patch('explainedcode')
    explainedCode(@Body() dto: ArticleExplainedCodeDto) {
        return this.articlesService.explainedcode(dto);
    }

    @UseGuards(UserGuard)
    @Patch('explainedimg')
    explainedImg(@Body() dto: ArticleExplainedImgDto) {
        return this.articlesService.explainedImg(dto);
    }

    @UseGuards(UserGuard)
    @Patch('basicarticle')
    basicArticle(@Body() dto: BasicArticleDto) {
        // will update logo, title and idea
        return this.articlesService.basicArticleUpdate(dto);
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

    @Get('basicarticles')
    getBasicArticle(
        @Query('startIndex', ParseIntPipe) startIndex:number,
        @Query('endIndex', ParseIntPipe) endIndex:number
    ) {
        // i stopped here
        return this.articlesService.getArticleRange(startIndex, endIndex);
    }
    @Get('initbasicarticle')
    getInitBasicArticle() {
        return this.articlesService.getInitBasicArticle();
    }
    @UseGuards(UserGuard)
    @Patch('pendingarticles')
    getPendingArticles() {
        return this.articlesService.getPendingArticles();
    }

    @Get('articleat')
    getArticle(@Query('article_id', ParseIntPipe) article_id:number) {
        return this.articlesService.getArticleAt(article_id);
    }
    
    @UseGuards(UserGuard)
    @Patch('articleat')
    getPendingArticle(@Query('article_id', ParseIntPipe) article_id:number) {
        return this.articlesService.getPendingArticle(article_id);
    }
}
