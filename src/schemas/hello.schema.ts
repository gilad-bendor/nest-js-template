import { z } from 'zod';

export const HelloInputSchema = z.object({
    x: z.string(),
    y: z.array(z.number()),
});

export const HelloOutputSchema = z.object({
    a: z.string(),
    b: z.object({
        c: z.array(z.number()),
    }),
});

export type HelloInput = z.infer<typeof HelloInputSchema>;
export type HelloOutput = z.infer<typeof HelloOutputSchema>;
