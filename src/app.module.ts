import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    UserModule,
    PrismaModule,
    ArticlesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
