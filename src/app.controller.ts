import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('saludo/:id')
  getHello(@Param('id') id: string): string {
    console.log(id);
    return this.appService.getHello();
  }

  @Post(':ids')
  createData(@Param('ids') id: string, @Body() payload: any): string {
    const dat = '';
    console.log(id);
    return payload;
  }
}
