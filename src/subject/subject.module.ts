import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';

@Module({
  imports: [PrismaModule],
  providers: [SubjectService],
  controllers: [SubjectController],
})
export class SubjectModule {}
