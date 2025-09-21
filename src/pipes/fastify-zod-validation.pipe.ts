import {
    Injectable,
    PipeTransform,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import { z, ZodError } from 'zod';

@Injectable()
export class FastifyZodValidationPipe implements PipeTransform {
    constructor(private schema: z.ZodSchema) {}

    transform(value: any, metadata: ArgumentMetadata) {
        try {
            return this.schema.parse(value);
        } catch (error) {
            if (error instanceof ZodError) {
                const message = error.issues
                    .map(issue => `${issue.path.join('/')} ${issue.message}`)
                    .join(', ');
                throw new BadRequestException(message);
            }
            throw new BadRequestException('Validation failed');
        }
    }
}

export const ZodValidationPipe = (schema: z.ZodSchema) =>
    new FastifyZodValidationPipe(schema);