import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { YearController } from './year.controller';
import { YearService } from './year.service';

@Module({
  imports: [PrismaModule],
  controllers: [YearController],
  providers: [YearService],
})
export class YearModule {}
