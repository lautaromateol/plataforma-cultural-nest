import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { YearModule } from './year/year.module';
import { PrismaModule } from './prisma/prisma.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [AuthModule, UserModule, YearModule, PrismaModule, CourseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
