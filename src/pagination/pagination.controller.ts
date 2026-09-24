// src/pagination/pagination.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Pagination')
@Controller('items')
export class PaginationController {
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách item có phân trang' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Số trang, mặc định là 1',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số item mỗi trang, mặc định là 10',
    example: 10,
  })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return {
      page: Number(page),
      limit: Number(limit),
    };
  }
}
