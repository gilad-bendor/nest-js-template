import { z } from 'zod';

export const zodHelloInput = z.object({
    x: z.string(),
    y: z.array(z.number()),
});

export const zodHelloOutput = z.object({
    a: z.string(),
    b: z.object({
        c: z.array(z.number()),
    }),
});

export type HelloInput = z.infer<typeof zodHelloInput>;
export type HelloOutput = z.infer<typeof zodHelloOutput>;
