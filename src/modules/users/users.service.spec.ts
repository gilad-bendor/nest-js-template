import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto, UserQueryDto, UserResponseDto } from '../../common/dto/user.dto';

describe('UsersService', () => {
	let service: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersService],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	afterEach(() => {
		// Reset the service state after each test
		service['users'] = [
			{
				id: expect.any(String),
				name: 'John Doe',
				email: 'john@example.com',
				age: 25,
				role: 'user',
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
			{
				id: expect.any(String),
				name: 'Jane Smith',
				email: 'jane@example.com',
				age: 30,
				role: 'admin',
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
			{
				id: expect.any(String),
				name: 'Bob Wilson',
				email: 'bob@example.com',
				role: 'moderator',
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
		] as UserResponseDto[];
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('findAll', () => {
		it('should return all users with default pagination', () => {
			const query: UserQueryDto = {};
			const result = service.findAll(query);

			expect(result.users).toHaveLength(3);
			expect(result.pagination).toEqual({
				page: 1,
				limit: 10,
				total: 3,
				totalPages: 1,
			});
		});

		it('should return paginated results', () => {
			const query: UserQueryDto = { page: 1, limit: 2 };
			const result = service.findAll(query);

			expect(result.users).toHaveLength(2);
			expect(result.pagination).toEqual({
				page: 1,
				limit: 2,
				total: 3,
				totalPages: 2,
			});
		});

		it('should return second page of paginated results', () => {
			const query: UserQueryDto = { page: 2, limit: 2 };
			const result = service.findAll(query);

			expect(result.users).toHaveLength(1);
			expect(result.pagination).toEqual({
				page: 2,
				limit: 2,
				total: 3,
				totalPages: 2,
			});
		});

		it('should filter users by role', () => {
			const query: UserQueryDto = { role: 'admin' };
			const result = service.findAll(query);

			expect(result.users).toHaveLength(1);
			expect(result.users[0].role).toBe('admin');
			expect(result.users[0].name).toBe('Jane Smith');
		});

		it('should filter users by multiple roles', () => {
			const queryUser: UserQueryDto = { role: 'user' };
			const queryModerator: UserQueryDto = { role: 'moderator' };

			const resultUser = service.findAll(queryUser);
			const resultModerator = service.findAll(queryModerator);

			expect(resultUser.users).toHaveLength(1);
			expect(resultUser.users[0].role).toBe('user');

			expect(resultModerator.users).toHaveLength(1);
			expect(resultModerator.users[0].role).toBe('moderator');
		});

		it('should search users by name', () => {
			const query: UserQueryDto = { search: 'john' };
			const result = service.findAll(query);

			expect(result.users).toHaveLength(1);
			expect(result.users[0].name.toLowerCase()).toContain('john');
		});

		it('should search users by email', () => {
			const query: UserQueryDto = { search: 'jane@example.com' };
			const result = service.findAll(query);

			expect(result.users).toHaveLength(1);
			expect(result.users[0].email).toContain('jane@example.com');
		});

		it('should search case-insensitively', () => {
			const query: UserQueryDto = { search: 'JOHN' };
			const result = service.findAll(query);

			expect(result.users).toHaveLength(1);
			expect(result.users[0].name).toBe('John Doe');
		});

		it('should return empty results for no matches', () => {
			const query: UserQueryDto = { search: 'nonexistent' };
			const result = service.findAll(query);

			expect(result.users).toHaveLength(0);
			expect(result.pagination.total).toBe(0);
			expect(result.pagination.totalPages).toBe(0);
		});

		it('should combine filters (role + search)', () => {
			const query: UserQueryDto = { role: 'admin', search: 'jane' };
			const result = service.findAll(query);

			expect(result.users).toHaveLength(1);
			expect(result.users[0].role).toBe('admin');
			expect(result.users[0].name.toLowerCase()).toContain('jane');
		});

		it('should combine pagination with filters', () => {
			// Add more test data first
			const newUser: CreateUserDto = {
				name: 'Alice Admin',
				email: 'alice@example.com',
				role: 'admin',
			};
			service.create(newUser);

			const query: UserQueryDto = { role: 'admin', page: 1, limit: 1 };
			const result = service.findAll(query);

			expect(result.users).toHaveLength(1);
			expect(result.pagination.total).toBe(2); // Jane + Alice
			expect(result.pagination.totalPages).toBe(2);
		});
	});

	describe('create', () => {
		it('should create a new user with all fields', () => {
			const createUserDto: CreateUserDto = {
				name: 'Test User',
				email: 'test@example.com',
				age: 25,
				role: 'user',
			};

			const result = service.create(createUserDto);

			expect(result).toMatchObject({
				name: 'Test User',
				email: 'test@example.com',
				age: 25,
				role: 'user',
			});
			expect(result.id).toBeDefined();
			expect(result.createdAt).toBeDefined();
			expect(result.updatedAt).toBeDefined();
			expect(typeof result.id).toBe('string');
		});

		it('should create a user without optional age', () => {
			const createUserDto: CreateUserDto = {
				name: 'No Age User',
				email: 'noage@example.com',
				role: 'moderator',
			};

			const result = service.create(createUserDto);

			expect(result.age).toBeUndefined();
			expect(result.name).toBe('No Age User');
			expect(result.role).toBe('moderator');
		});

		it('should add the user to the users array', () => {
			const initialCount = service['users'].length;
			const createUserDto: CreateUserDto = {
				name: 'Added User',
				email: 'added@example.com',
				role: 'user',
			};

			service.create(createUserDto);

			expect(service['users']).toHaveLength(initialCount + 1);
			const addedUser = service['users'][service['users'].length - 1];
			expect(addedUser.name).toBe('Added User');
		});

		it('should generate unique IDs for different users', () => {
			const user1 = service.create({
				name: 'User 1',
				email: 'user1@example.com',
				role: 'user',
			});

			const user2 = service.create({
				name: 'User 2',
				email: 'user2@example.com',
				role: 'user',
			});

			expect(user1.id).not.toBe(user2.id);
			expect(user1.id).toMatch(
				/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
			);
			expect(user2.id).toMatch(
				/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
			);
		});
	});

	describe('findOne', () => {
		it('should return a user by id', () => {
			const users = service['users'];
			const existingUser = users[0];

			const result = service.findOne(existingUser.id);

			expect(result).toEqual(existingUser);
		});

		it('should return undefined for non-existent id', () => {
			const result = service.findOne('non-existent-id');

			expect(result).toBeUndefined();
		});

		it('should return the correct user when multiple users exist', () => {
			const users = service['users'];
			const targetUser = users[1]; // Jane Smith

			const result = service.findOne(targetUser.id);

			expect(result).toEqual(targetUser);
			expect(result?.name).toBe('Jane Smith');
		});
	});

	describe('edge cases', () => {
		it('should handle empty search string gracefully', () => {
			const query: UserQueryDto = { search: '' };
			const result = service.findAll(query);

			// Empty search should return all users
			expect(result.users).toHaveLength(3);
		});

		it('should handle page beyond available data', () => {
			const query: UserQueryDto = { page: 10, limit: 10 };
			const result = service.findAll(query);

			expect(result.users).toHaveLength(0);
			expect(result.pagination.page).toBe(10);
			expect(result.pagination.total).toBe(3);
		});

		it('should handle very large limit values', () => {
			const query: UserQueryDto = { limit: 1000 };
			const result = service.findAll(query);

			expect(result.users).toHaveLength(3); // Only 3 users exist
			expect(result.pagination.limit).toBe(1000);
			expect(result.pagination.totalPages).toBe(1);
		});
	});
});
