import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './file/file.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'), FileModule],
})
export class AppModule {}
