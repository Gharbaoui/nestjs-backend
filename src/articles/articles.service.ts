import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FileHandlerService } from 'src/fileHandler/fileHandler.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleConclusionDto, ArticleExplainedAddDto, ArticleExplainedCodeDto, ArticleExplainedImgDto, ArticleExplainedRemoveDto, ArticleExplainedTxtDto, ArticleExplainedUpdateDto, ArticleIdeaDto, ArticleLogoDto, ArticleNextPrevDto, ArticlePreqsAddDto, ArticlePreqsRemoveDto, ArticlePreqsUpdateDto, ArticleSearchKeywordsDto, ArticleStateDto, ArticleTitleDto, BasicArticleDto } from './dto';

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
        ],
        explained: [
        ],
        conclusion: `I hope this was right techniclly`,
        logo: ''
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
    
    async stateToggel(dto: ArticleStateDto) {
       try {
        const article = await this.prismaService.article.findUnique({where: {id: dto.id}});
        if (!article)
            return  {failed: true, msg: `not valid article id`};
        
        const new_article = await this.prismaService.article.update({
            where: {id: dto.id},
            data: {
                state: !article.state,
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
                return  {failed: true, msg:`not a valid article id`};
            const new_article = await this.prismaService.article.update({
                where: {id: dto.id},
                data: {
                    next_prev_article: {
                        prv_article_id: dto.update_prv ? dto.prev : (article.next_prev_article as Prisma.JsonObject).prv_article_id,
                        next_article_id: dto.update_next ? dto.next : (article.next_prev_article as Prisma.JsonObject).next_article_id
                    }
                }
            });
            return new_article.next_prev_article;
        } catch(err) {
            console.log(`failed in articles in row update`);
            return {failed: true, msg: `could not update articles in row`};
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

    async preqUpdate(dto: ArticlePreqsUpdateDto) {
        try {
            const old = await this.prismaService.article.findUnique({where :{id: dto.id}});
            if (!old)
                return {failed: true, msg: `could not find article with id ${dto.id}`};
            let old_preqs = old.preqs;
            if (dto.index < old_preqs.length && dto.index >= 0) {
                old_preqs[dto.index] = {
                    req_title: dto.preqs.req_title,
                    req_url: dto.preqs.req_url,
                    is_local_article: dto.preqs.is_local_article
                };
            } else {
                return {failed: true, msg: `out of range index`};
            }
            const articl_preqs = await this.prismaService.article.update({
                where: {id: dto.id},
                select: {preqs:true},
                data: {
                    preqs: old_preqs
                }
            });
            return articl_preqs;
        } catch (err) {
            console.log(`faild to update preqs`);
            return {failed: true, msg:`invalid article id`};
        }
    }

    async preqAdd(dto: ArticlePreqsAddDto) {
        try {
            const old = await this.prismaService.article.findUnique({where :{id: dto.id}});
            if (!old)
                return {failed: true, msg: `could not find article with id ${dto.id}`};
            let old_preqs = old.preqs;
            old_preqs.push({
                req_title: dto.preqs.req_title,
                req_url: dto.preqs.req_url,
                is_local_article: dto.preqs.is_local_article
            });
            const articl_preqs = await this.prismaService.article.update({
                where: {id: dto.id},
                select: {preqs:true},
                data: {
                    preqs: old_preqs
                }
            });
            return articl_preqs;
        } catch (err) {
            console.log(`faild to add preqs`);
            return {failed: true, msg:`invalid article id`};
        } 
    }

    async preqRemove(dto: ArticlePreqsRemoveDto) {
        try {
            const old = await this.prismaService.article.findUnique({where :{id: dto.id}});
            if (!old)
                return {failed: true, msg: `could not find article with id ${dto.id}`};
            let old_preqs = old.preqs;
            if (dto.index < old_preqs.length && dto.index >= 0) {
                old_preqs.splice(dto.index, 1);
            } else {
                return {failed: true, msg: `out of range index`};
            }
            const articl_preqs = await this.prismaService.article.update({
                where: {id: dto.id},
                select: {preqs:true},
                data: {
                    preqs: old_preqs
                }
            });
            return articl_preqs;
        } catch (err) {
            console.log(`faild to remove preqs`);
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

    async explainedAdd(dto: ArticleExplainedAddDto) {
        try {
            const article = await this.prismaService.article.findUnique({where:{id: dto.id}});
            if (!article)
                return {failed: true, msg:`invalid article id`};
            if (dto.explain_img.is_local) {
                dto.explain_img.path = this.fileHandlerService.uploadExplainedArticle(dto.explain_img.path);
            }
            
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
            console.log(`explaied add`);
            return {failed: true, msg:`invalid article id`};
        }
    }

    async explainedUpdate(dto: ArticleExplainedUpdateDto) {
        try {
            const article = await this.prismaService.article.findUnique({where:{id: dto.id}});
            if (!article)
                return {failed: true, msg:`invalid article id`};
 
            let explained = article.explained;
            if (dto.index < explained.length && dto.index >= 0) {
                if (dto.explain_img.is_local) {
                    this.fileHandlerService.removeFile(
                        ((explained[dto.index] as Prisma.JsonObject).explain_img as any).path
                    );
                    dto.explain_img.path = this.fileHandlerService.uploadExplainedArticle(dto.explain_img.path);
                }
                explained[dto.index] = {
                    explain_txt: dto.explain_txt,
                    explain_img: {
                        path: dto.explain_img.path,
                        is_local: dto.explain_img.is_local
                    },
                    code_snipest: dto.code_snipest
                };
            } else {
                return {failed: true, msg: `invalid index`};
            }
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

    async explainedRemove(dto: ArticleExplainedRemoveDto) {
        try {
            const article = await this.prismaService.article.findUnique({where:{id: dto.id}});
            if (!article)
                return {failed: true, msg:`invalid article id`};
            let explained = article.explained;
            if (dto.index < explained.length && dto.index >= 0) {
                this.fileHandlerService.removeFile(
                    ((article.explained[dto.index] as Prisma.JsonObject).explain_img as any).path
                );
                explained.splice(dto.index, 1);
            } else {
                return {failed: true, msg: `invalid index`};
            }
            const new_article = await this.prismaService.article.update({
                where: {id:dto.id},
                data: {
                    explained: explained
                }
            });
            return {explained: new_article.explained};
        } catch(err) {
            console.log(`explaied remove`);
            return {failed: true, msg:`invalid article id`};
        }
    }

    async explainedTxt(dto: ArticleExplainedTxtDto) {
        try {
            const article = await this.prismaService.article.findUnique({where:{id: dto.id}});
            if (!article)
                return {failed: true, msg:`invalid article id`};
            let explained = article.explained;
            if (dto.index < explained.length && dto.index >= 0) {
                (explained[dto.index] as Prisma.JsonObject).explain_txt = dto.explain_txt;
            } else {
                return {failed: true, msg:`incalid article id`};
            }

            const new_article = await this.prismaService.article.update({
                where: {id:dto.id},
                data: {
                    explained: explained
                },
                select: {
                    explained:true
                }
            });
            return {explained: new_article};
        } catch(err) {
            console.log(`explained txt`);
            return {failed: true, msg:`invalid article id`};
        }
    }

    async explainedImg(dto: ArticleExplainedImgDto) {
        try {
            const article = await this.prismaService.article.findUnique({where:{id: dto.id}});
            if (!article)
                return {failed: true, msg:`invalid article id`};
            let explained = article.explained;

            if (dto.index < explained.length && dto.index >= 0) {
                if (dto.explain_img.is_local) {
                    this.fileHandlerService.removeFile(
                        ((explained[dto.index] as Prisma.JsonObject).explain_img as any).path
                    );
                    dto.explain_img.path = this.fileHandlerService.uploadExplainedArticle(dto.explain_img.path);
                }
                (explained[dto.index] as Prisma.JsonObject).explain_img = dto.explain_img;
            } else {
                return {failed:true, msg: `invalid article id`};
            }

            const new_article = await this.prismaService.article.update({
                where: {id:dto.id},
                data: {
                    explained: explained
                },
                select: {
                    explained:true
                }
            });
            return {explained: new_article};
        } catch(err) {
            console.log(`explained image`);
            return {failed: true, msg:`invalid article id`};
        }
    }

    async explainedcode(dto: ArticleExplainedCodeDto) {
        try {
            const article = await this.prismaService.article.findUnique({where:{id: dto.id}});
            if (!article)
                return {failed: true, msg:`invalid article id`};
            let explained = article.explained;
            
            (explained[dto.index] as Prisma.JsonObject).code_snipest = dto.code_snipest;

            const new_article = await this.prismaService.article.update({
                where: {id:dto.id},
                data: {
                    explained: explained
                },
                select: {
                    explained:true
                }
            });
            return {explained: new_article};
        } catch(err) {
            console.log(`explained code`);
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
            where: {
                state: true
            },
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

    async getPendingArticles() {
        try {
            const arts = await this.prismaService.article.findMany({
                where: {
                    state: false
                },select: {
                    title:true,
                    id: true,
                    logo: true,
                }
            });
            for (let i = 0; i < arts.length; ++i) {
                arts[i].logo = this.fileHandlerService.readFile(arts[i].logo);
            }
            return arts;
        } catch(err) {
            console.log(`get pendding error`);
            return {failed: true, msg: `could not get pending list of articles`};
        }
    }

    async getArticleAt(article_id: number) {
        try {
            const article = await this.prismaService.article.findUnique({
                where: {id: article_id},
                select: {
                    title:true,
                    state:true,
                    idea: true,
                    preqs: true,
                    next_prev_article: true,
                    explained: true,
                    conclusion:true
                }
            });
            if (!article) {
                return {failed:true, msg: `invalid article id`};
            }
            if (article.state == false){
                return {failed: true, msg: `incomplete article`};
            }
            for (let i = 0; i < article.explained.length; ++i) {
                if (((article.explained[i] as Prisma.JsonObject).explain_img as any).is_local) {
                    ((article.explained[i] as Prisma.JsonObject).explain_img as any).path = this.fileHandlerService.readFile(
                        ((article.explained[i] as Prisma.JsonObject).explain_img as any).path
                    );
                }
            }
            return article;
        } catch(e) {
            console.log(e);
            return {failed:true, msg: `invalid article id`};
        }
    }

    async getPendingArticle(article_id:number) {
        try {
            const article = await this.prismaService.article.findUnique({
                where: {id: article_id},
                select: {
                    title:true,
                    state:true,
                    idea: true,
                    preqs: true,
                    next_prev_article: true,
                    explained: true,
                    conclusion:true
                }
            });
            if (!article) {
                return {failed:true, msg: `invalid article id`};
            }
            if (article.state == true){
                return {failed: true, msg: `should only be article that has state is flase`};
            }
            for (let i = 0; i < article.explained.length; ++i) {
                if (((article.explained[i] as Prisma.JsonObject).explain_img as any).is_local) {
                    ((article.explained[i] as Prisma.JsonObject).explain_img as any).path = this.fileHandlerService.readFile(
                        ((article.explained[i] as Prisma.JsonObject).explain_img as any).path
                    );
                }
            }
            return article;
        } catch(e) {
            console.log(e);
            return {failed:true, msg: `invalid article id`};
        } 
    }
}