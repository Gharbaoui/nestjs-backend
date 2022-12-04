import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FileHandlerService } from 'src/fileHandler/fileHandler.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleConclusionDto, ArticleExplainedDto, ArticleIdeaDto, ArticleLogoDto, ArticleNextPrevDto, ArticlePreqsDto, ArticleSearchKeywordsDto, ArticleStateDto, ArticleTitleDto, BasicArticleDto } from './dto';

@Injectable()
export class ArticlesService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly fileHandlerService: FileHandlerService
    ) {}
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
        return {failed: true, msg:`invalid article id`};
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
                    return {failed: true, msg:`invalid article id`};
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
            return  {failed: true, msg:`faild to change title`};
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
                    return {failed: true, msg:`invalid article id`};

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
            return {failed: true, msg:`invalid article id`};
        }
    }

    async preqUpdate(dto: ArticlePreqsDto) {
        try {
            let new_preqs = [];
            if (dto.add) {
                const article = await this.prismaService.article.findUnique({where: {id:dto.id}});
                if (!article)
                    return {failed: true, msg:`invalid article id`};
                
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
            return {failed: true, msg:`invalid article id`};
        }
    }

    async updateLogo(dto: ArticleLogoDto) {
        try {
            const upload_path = this.fileHandlerService.uploadLogoArticle(dto.logo);
            const old_path = await this.prismaService.article.findUnique({where: {id: dto.id}, select: {logo:true}});
            this.fileHandlerService.removeFile(old_path.logo);
            const article = await this.prismaService.article.update({
                where: {id:dto.id},
                data: {
                    logo: upload_path
                }
            });
            return {new_logo: article.logo};
        } catch(err) {
            console.log(`logo could not be updated`);
            return {failed: true, msg:`invalid article id`};
        }
    }

    async updateConclusion(dto: ArticleConclusionDto) {
        try {
            let new_conclusion: string;
            if (dto.add) {
                const article = await this.prismaService.article.findUnique({where: {id:dto.id}});
                if (!article)
                return {failed: true, msg:`invalid article id`};
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
            return {failed: true, msg:`invalid article id`};
        }
    }

    async explainedUpdate(dto: ArticleExplainedDto) {
        try {
            const article = await this.prismaService.article.findUnique({where:{id: dto.id}});
            if (!article)
                return {failed: true, msg:`invalid article id`};
            let explained = article.explained;
            
            explained.push({
                explain_txt: dto.explain_txt,
                explain_img: {
                    path: dto.explain_img.path,
                    is_local: dto.explain_img.is_local
                },
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
            return {failed: true, msg:`invalid article id`};
        }
    }

    async basicArticleUpdate(dto: BasicArticleDto) {
        try {

            dto.logo = this.fileHandlerService.uploadLogoArticle(dto.logo);
            const old_path = await this.prismaService.article.findUnique({where: {id: dto.id}, select: {logo:true}});
            this.fileHandlerService.removeFile(old_path.logo);
            const article = await this.prismaService.article.update({
                where: {id:dto.id},
                data: {
                    logo: dto.logo,
                    idea: dto.idea,
                    title: dto.title
                },select: {
                    logo: true,
                    title: true,
                    idea: true
                }
            });
            return article;
        } catch(err) {
            console.log(`could not update basic article`);
            return {failed: true, msg:`invalid article id`};
        }
    }

    async getLogo(id: number)
    {
        try {
            return await this.prismaService.article.findUnique({
                where: {id: id},
                select: {logo:true}
            });
        } catch(err) {
            console.log(`get logo faild`);
            return {failed: true, msg:`invalid article id`};

        }
    }

    async getState(id:number) {
        try {
            return await this.prismaService.article.findUnique({
                where: {id: id},
                select: {state:true}
            });
        } catch(err) {
            console.log(`get state faild`);
            return {failed: true, msg:`invalid article id`};
        } 
    }



    async getReleaseTime(id:number) {
        try {
            return await this.prismaService.article.findUnique({
                where: {id: id},
                select: {release_time:true}
            });
        } catch(err) {
            console.log(`get release time faild`);
            return `probably wrong id`;
        }  
    }

    async getSearchKeywords(id:number) {
        try {
            return await this.prismaService.article.findUnique({
                where: {id: id},
                select: {search_keywords:true}
            });
        } catch(err) {
            console.log(`get search keywords faild`);
            return `probably wrong id`;
        }
    }

    async getNextPrvArticle(id:number) {
        try {
            return await this.prismaService.article.findUnique({
                where: {id: id},
                select: {next_prev_article:true}
            });
        } catch(err) {
            console.log(`get next prev article faild`);
            return `probably wrong id`;
        }
    }

    async getTitle(id:number) {
        try {
            return await this.prismaService.article.findUnique({
                where: {id: id},
                select: {title:true}
            });
        } catch(err) {
            console.log(`get title faild`);
            return `probably wrong id`;
        }
    }

    async getIdea(id:number) {
        try {
            return await this.prismaService.article.findUnique({
                where: {id: id},
                select: {idea:true}
            });
        } catch(err) {
            console.log(`get idea faild`);
            return `probably wrong id`;
        }
    }

    async getPreqs(id:number) {
        try {
            return await this.prismaService.article.findUnique({
                where: {id: id},
                select: {preqs:true}
            });
        } catch(err) {
            console.log(`get preqs faild`);
            return `probably wrong id`;
        }
    }

    async   getConclusion(id:number) {
        try {
            return await this.prismaService.article.findUnique({
                where: {id: id},
                select: {conclusion:true}
            });
        } catch(err) {
            console.log(`get conclusion faild`);
            return `probably wrong id`;
        }
    }

    async getExplaind(dto: {id:number, index:number}) {
        try {
            const explaied = await this.prismaService.article.findUnique({
                where: {id: dto.id},
                select: {explained:true}
            });
            if (dto.index >= 0)
                return explaied[0];
            return explaied;
        } catch(err) {
            console.log(`get conclusion faild`);
            return `probably wrong id`;
        }  
    }

    async getInitBasicArticle() {
        return this.prismaService.article.count();
    }

    async getArticleRange(startIndex:number, endIndex:number) {
        if (startIndex < 0 || endIndex < 0)
            return {failed: true, msg: `wrong index`};
        const articles = await this.prismaService.article.findMany({
            take: endIndex - startIndex + 1,
            select: {
                id: true,
                title: true,
                idea: true,
                logo: true,
                release_time: true,
            },
            skip: startIndex
        });
        for (let i = 0; i < articles.length; ++i) {
            articles[i].logo = this.fileHandlerService.readFile(articles[i].logo);
        }
        return articles;
    }
}