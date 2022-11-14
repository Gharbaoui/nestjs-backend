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

}
