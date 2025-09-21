import { z } from 'zod';

export const zodCreateUserDto = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
	email: z.string().email('Invalid email format'),
	age: z.number().min(18, 'Must be at least 18 years old').max(120, 'Invalid age').optional(),
	role: z.enum(['user', 'admin', 'moderator']).default('user'),
});
export type CreateUserDto = z.infer<typeof zodCreateUserDto>;

export const zodUpdateUserDto = zodCreateUserDto.partial();
export type UpdateUserDto = z.infer<typeof zodUpdateUserDto>;

export const zodUserQueryDto = z.object({
	page: z
		.string()
		.transform((val) => parseInt(val, 10))
		.refine((val) => val > 0, 'Page must be positive')
		.optional(),
	limit: z
		.string()
		.transform((val) => parseInt(val, 10))
		.refine((val) => val > 0 && val <= 100, 'Limit must be between 1-100')
		.optional(),
	role: z.enum(['user', 'admin', 'moderator']).optional(),
	search: z.string().min(1).max(50).optional(),
});
export type UserQueryDto = z.infer<typeof zodUserQueryDto>;

export const zodUserResponseDto = z.object({
	id: z.string().uuid(),
	name: z.string(),
	email: z.string().email(),
	age: z.number().optional(),
	role: z.enum(['user', 'admin', 'moderator']),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});
export type UserResponseDto = z.infer<typeof zodUserResponseDto>;

export const zodUsersListResponseDto = z.object({
	users: z.array(zodUserResponseDto),
	pagination: z.object({
		page: z.number(),
		limit: z.number(),
		total: z.number(),
		totalPages: z.number(),
	}),
});
export type UsersListResponseDto = z.infer<typeof zodUsersListResponseDto>;
