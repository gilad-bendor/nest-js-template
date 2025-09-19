import { Injectable } from '@nestjs/common';
import type { HelloInput, HelloOutput } from './schemas/hello.schema';

@Injectable()
export class AppService {
    getHello(input: HelloInput): HelloOutput {
        return { a: 'Hello World! x=' + input.x, b: { c: input.y } };
    }
}
