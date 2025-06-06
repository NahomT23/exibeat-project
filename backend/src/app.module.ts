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
      serverSelectionTimeoutMS: 30000, 
      socketTimeoutMS: 30000,         
      connectionFactory: (conn: Connection) => {
        conn.on('connected', () => console.log('Mongoose connected successfully'));
        conn.on('error', (err) => console.error('Mongoose connection error:', err));
        conn.on('disconnected', () => console.warn('mongoose disconnected'));
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
