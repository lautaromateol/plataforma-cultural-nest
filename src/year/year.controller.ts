import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { YearService } from './year.service';
import { ZodValidationPipe } from 'pipes/zod-validation.pipe';
import {
  CreateYearDto,
  createYearSchema,
  UpdateYearDto,
  updateYearSchema,
} from './schemas';
import { Auth } from 'decorators/auth.decorator';
import { UserRole } from 'generated/prisma/enums';

@Auth(UserRole.ADMIN)
@Controller('year')
export class YearController {
  constructor(private yearService: YearService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getYears() {
    return await this.yearService.getYears();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getYear(@Param() id: string) {
    return await this.yearService.getYear(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createYearSchema))
  async createYear(@Body() yearData: CreateYearDto) {
    return await this.yearService.createYear(yearData);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateYearSchema))
  async updateYear(@Param() id: string, @Body() yearData: UpdateYearDto) {
    return await this.yearService.updateYear({ id, yearData });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteYear(@Param() id: string) {
    return await this.yearService.deleteYear(id);
  }
}
