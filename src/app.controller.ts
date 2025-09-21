import { AppService } from './app.service';
import { Controller, Get, Post, Body } from '@nestjs/common';
import type { HelloInput, HelloOutput } from './schemas/hello.schema';
import { zodHelloInput, zodHelloOutput } from './schemas/hello.schema';
import { ZodValidationPipe } from './pipes/fastify-zod-validation.pipe';
import { z } from 'zod';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): HelloOutput {
        return this.appService.getHello({ x: 'stub-x', y: [] });
    }

    @Post()
    postHello(@Body(ZodValidationPipe(zodHelloInput)) input: HelloInput): HelloOutput {
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
