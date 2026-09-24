import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UploadController } from './upload/upload.controller.js';
import { PaginationController } from './pagination/pagination.controller.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController, UploadController, PaginationController],
  providers: [AppService],
})
export class AppModule {}
