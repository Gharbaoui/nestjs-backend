import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserGuard } from 'src/guards/user.guard';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
    constructor(
        private readonly ariclesService: ArticlesService
    ){}

}
