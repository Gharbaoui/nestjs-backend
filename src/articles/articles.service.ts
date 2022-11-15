import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleConclusionDto, ArticleExplainedDto, ArticleIdeaDto, ArticleLogoDto, ArticleNextPrevDto, ArticlePreqsDto, ArticleSearchKeywordsDto, ArticleStateDto, ArticleTitleDto } from './dto';

@Injectable()
export class ArticlesService {

    constructor(private readonly prismaService: PrismaService) {}
    data = {
        search_keywords : ['key-1', 'key-2', '...'],
        next_prev_article: {prv_article_id:-1, next_article_id:-1},
        title: 'hashing vs encoding',
        idea: 'they are different',
        preqs: [
            {
                req_title: 'you need to know c++',
                req_url: '/path/to/my/article if is_local_article_is_true',
                is_local_article: true,
            },
            {
                req_title: 'you need to know c++',
                req_url: 'https://... if is_local_article is false',
                is_local_article: false,
            },
        ],
        explained: [
            {
                explain_txt: "explain part 1",
                explain_img: {
                    path: 'https://..jpg',
                    is_local_article: false
                },
                code_snipest: {
                    source_code: `const int add(int a, int b) {return a + b}`,
                    language: `cpp`
                }
            },
        ],
        conclusion: `I hope this was right techniclly`,
        logo: '/assets/default/logo'
    }
    async emptyArticle()
    {
        try {
            const data = this.data;
            const article = await this.prismaService.article.create({data});
            return article.id;
        } catch(err) {
            console.log(`while trying to insert empty article`);
        }
    }
    
    async stateUpdate(dto: ArticleStateDto) {
       try {
        const new_article = await this.prismaService.article.update({
            where: {id: dto.id},
            data: {
                state: dto.state,
                release_time: new Date()
            }
        });
        return {id: new_article.id, state: new_article.state, release_time: new_article.release_time};
       } catch(err) {
        console.log(`while trying to update state of article`);
        return `probably wrong article id`
       } 
    }

    async searchKeywordsUpdate(dto: ArticleSearchKeywordsDto): Promise<"not valid article id" | "we could not update search keywords" | { search_keywords: string[]; }>
    {
        try {
            const article = await this.prismaService.article.findUnique({where: {id: dto.id}});
            if (!article)
                return  `not valid article id`;
            let new_keywords: string[] = [];
            if (dto.add_keywords) {
                new_keywords = article.search_keywords;
                dto.search_keywords.forEach(element => {
                    new_keywords.push(element);
                });
            } else {
                new_keywords = dto.search_keywords;
            }
            const new_article = await this.prismaService.article.update({
                where: {
                    id: dto.id
                },
                data: {
                    search_keywords: new_keywords
                }
            });
            return {
                search_keywords: new_article.search_keywords
            }
        } catch(err) {
            console.log(`could not update a search keywords`);
            return  `we could not update search keywords`;
        }
    }

    async articlesInRow(dto: ArticleNextPrevDto)
    {
        try {
            const article = await this.prismaService.article.findUnique({where: {id:dto.id}});
            if (!article)
                return  `not a valid article id`;
            const new_article = await this.prismaService.article.update({
                where: {id: dto.id},
                data: {
                    next_prev_article: {
                        prv_article_id: dto.update_prv ? dto.prev : (article.next_prev_article as Prisma.JsonObject).prv_article_id,
                        next_article_id: dto.next
                    }
                }
            });
            return new_article.next_prev_article;
        } catch(err) {
            console.log(`failed in articles in row update`);
            return `could not update articles in row`;
        }
    }
    async titleUpdate(dto: ArticleTitleDto)
    {
        try {
            if (!dto.add) {
                const new_aricle = await this.prismaService.article.update({
                    where: {id:dto.id},
                    data: {
                        title: dto.title
                    }
                });
                return {title: new_aricle.title};
            } else {
                const article = await this.prismaService.article.findUnique({where: {id:dto.id}})
                if (!article)
                    return `invalid article id`;
                const new_aricle = await this.prismaService.article.update({
                    where: {id:dto.id},
                    data: {
                        title: article.title + ' ' + dto.title
                    }
                });
                return {title: new_aricle.title};
            }
        } catch(err) {
            console.log(`probably wrong id`);
            return  `faild to change title`;
        }
    }


    async ideaUpdate(dto: ArticleIdeaDto)
    {
        try {
            if (!dto.add) {
                const new_aricle = await this.prismaService.article.update({
                    where: {id:dto.id},
                    data: {
                        idea: dto.idea
                    }
                });
                return {idea: new_aricle.idea};
            } else {
                const article = await this.prismaService.article.findUnique({where: {id:dto.id}})
                if (!article)
                    return `invalid article id`;
                const new_aricle = await this.prismaService.article.update({
                    where: {id:dto.id},
                    data: {
                        idea: article.idea + ' ' + dto.idea
                    }
                });
                return {idea: new_aricle.idea};
            }
        } catch(err) {
            console.log(`probably wrong id`);
            return  `faild to change idea`;
        }
    }

    async preqUpdate(dto: ArticlePreqsDto) {
        try {
            let new_preqs = [];
            if (dto.add) {
                const article = await this.prismaService.article.findUnique({where: {id:dto.id}});
                if (!article)
                    return `invalid article id`;
                new_preqs = article.preqs;
                dto.preqs.forEach((elem) => {
                    new_preqs.push(elem as any);
                })  
            } else {
                new_preqs = dto.preqs;
            }
            const new_aricle = await this.prismaService.article.update({
                where: {id:dto.id},
                data: {
                    preqs: new_preqs
                }
            });
            return {preqs: new_aricle.preqs};
        } catch (err) {
            console.log(`faild to update preqs`);
            return `maybe invalid id`;
        }
    }

    async updateLogo(dto: ArticleLogoDto) {
        try {
            const article = await this.prismaService.article.update({
                where: {id:dto.id},
                data: {
                    logo: dto.logo
                }
            });
            return {new_logo: article.logo};
        } catch(err) {
            console.log(`logo could not be updated`);
            return `probably wrong id`;
        }
    }

    async updateConclusion(dto: ArticleConclusionDto) {
        try {
            let new_conclusion: string;
            if (dto.add) {
                const article = await this.prismaService.article.findUnique({where: {id:dto.id}});
                if (!article)
                    return `wrong id`;
                new_conclusion = article.conclusion + ' ' + dto.conclusion;
            } else {
                new_conclusion = dto.conclusion;
            }
            const new_aricle = await this.prismaService.article.update({
                where: {id:dto.id},
                data: { conclusion: new_conclusion }
            });
            return {conclusion: new_aricle.conclusion};
        } catch(err) {
            console.log(`conclusion could not be updated`);
            return `wrong id`;
        }
    }

    async explainedUpdate(dto: ArticleExplainedDto) {
        try {
            const article = await this.prismaService.article.findUnique({where:{id: dto.id}});
            if (!article)
                return `invalid article id`;
            let explained = article.explained;
            explained.push({
                explain_txt: dto.explain_txt,
                explain_img: dto.explain_img,
                code_snipest: dto.code_snipest
            });
            const new_article = await this.prismaService.article.update({
                where: {id:dto.id},
                data: {
                    explained: explained
                }
            });
            return {explained: new_article.explained};
        } catch(err) {
            console.log(`explaied update`);
            return `probably invalid id`;
        }
    }

    async getLogo(id: number)
    {
        try {
            const article = await this.prismaService.article.findUnique({
                where: {id: id},
                select: {logo:true}
            });
            /// stops here
        } catch(err) {
            console.log(`get logo faild`);
            return `probably wrong id`;
        }
    }
}