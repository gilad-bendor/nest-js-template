import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	CreateUserDto,
	UserQueryDto,
	UserResponseDto,
	UsersListResponseDto,
} from '../../common/dto/user.dto';

@Injectable()
export class UsersService {
	private users: UserResponseDto[] = [
		{
			id: randomUUID(),
			name: 'John Doe',
			email: 'john@example.com',
			age: 25,
			role: 'user',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: randomUUID(),
			name: 'Jane Smith',
			email: 'jane@example.com',
			age: 30,
			role: 'admin',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: randomUUID(),
			name: 'Bob Wilson',
			email: 'bob@example.com',
			role: 'moderator',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	];

	findAll(query: UserQueryDto): UsersListResponseDto {
		const { page = 1, limit = 10, role, search } = query;

		let filteredUsers = this.users;

		if (role) {
			filteredUsers = filteredUsers.filter((user) => user.role === role);
		}

		if (search) {
			filteredUsers = filteredUsers.filter(
				(user) =>
					user.name.toLowerCase().includes(search.toLowerCase()) ||
					user.email.toLowerCase().includes(search.toLowerCase()),
			);
		}

		const total = filteredUsers.length;
		const totalPages = Math.ceil(total / limit);
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;

		const users = filteredUsers.slice(startIndex, endIndex);

		return {
			users,
			pagination: {
				page,
				limit,
				total,
				totalPages,
			},
		};
	}

	create(createUserDto: CreateUserDto): UserResponseDto {
		const newUser: UserResponseDto = {
			id: randomUUID(),
			...createUserDto,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		this.users.push(newUser);
		return newUser;
	}

	findOne(id: string): UserResponseDto | undefined {
		return this.users.find((user) => user.id === id);
	}
}
