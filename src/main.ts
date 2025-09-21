import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

async function bootstrap() {
    const fastifyAdapter = new FastifyAdapter();

    // Configure Fastify with Zod type provider
    fastifyAdapter.getInstance().withTypeProvider<ZodTypeProvider>();
    fastifyAdapter.getInstance().setValidatorCompiler(validatorCompiler);
    fastifyAdapter.getInstance().setSerializerCompiler(serializerCompiler);

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);

    // Enable CORS if needed
    app.enableCors();

    const port = process.env.PORT || 10000;
    await app.listen(port);

    console.log(`Application is running on: http://localhost:${port}`);
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();
