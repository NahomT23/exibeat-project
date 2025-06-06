import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose"
import { SubmissionsModule } from './submissions/submissions.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    SubmissionsModule
  ],
})
export class AppModule {}