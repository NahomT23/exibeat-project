// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { MongooseModule } from "@nestjs/mongoose"
// import { SubmissionsModule } from './submissions/submissions.module';


// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     MongooseModule.forRoot('mongodb+srv://nest:abc123abc@nest-crud.oha0nq5.mongodb.net/?retryWrites=true&w=majority&appName=Nest-crud'),
//     SubmissionsModule
//   ],
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  MongooseModule,
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { SubmissionsModule } from './submissions/submissions.module';

class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: process.env.MONGO_URI,
      serverSelectionTimeoutMS: 30000, // wait up to 30 seconds to find a server
      socketTimeoutMS: 30000,         // wait up to 30 seconds for a reply
      connectionFactory: (conn: Connection) => {
        conn.on('connected', () => console.log('✅ Mongoose connected successfully'));
        conn.on('error', (err) => console.error('❌ Mongoose connection error:', err));
        conn.on('disconnected', () => console.warn('⚠️ Mongoose disconnected'));
        return conn;
      },
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    SubmissionsModule,
  ],
})
export class AppModule {}
