import { AppService } from './app.service';
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello({x: 'stub-x', b:[]});
  }

  @Post()
  postHello(@Body() input: {x: string, y: number[]}): { a: string, b: { c: number[] } } {
    return this.appService.getHello(input);
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}
