import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(input: {x: string, y: number[]}): { a: string, b: { c: number[] } } {
    return {a:'Hello World! x=' + input.x, b: {c: input.y}};
  }
}
