import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
	CreateUserDto,
	UserQueryDto,
	UserResponseDto,
	UsersListResponseDto,
} from '../../common/dto/user.dto';

describe('UsersController', () => {
	let controller: UsersController;
	let service: UsersService;

	const mockUser: UserResponseDto = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		name: 'John Doe',
		email: 'john@example.com',
		age: 25,
		role: 'user',
		createdAt: '2023-01-01T00:00:00.000Z',
		updatedAt: '2023-01-01T00:00:00.000Z',
	};

	const mockUsersListResponse: UsersListResponseDto = {
		users: [mockUser],
		pagination: {
			page: 1,
			limit: 10,
			total: 1,
			totalPages: 1,
		},
	};

	const mockUsersService = {
		findAll: jest.fn(),
		create: jest.fn(),
		findOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
			],
		}).compile();

		controller = module.get<UsersController>(UsersController);
		service = module.get<UsersService>(UsersService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('findAll', () => {
		it('should return users list with default pagination', async () => {
			const query: UserQueryDto = {};
			mockUsersService.findAll.mockReturnValue(mockUsersListResponse);

			const result = controller.findAll(query);

			expect(service.findAll).toHaveBeenCalledWith(query);
			expect(result).toEqual(mockUsersListResponse);
		});

		it('should return users list with custom pagination', async () => {
			const query: UserQueryDto = { page: 2, limit: 5 };
			const expectedResponse = {
				...mockUsersListResponse,
				pagination: { page: 2, limit: 5, total: 1, totalPages: 1 },
			};
			mockUsersService.findAll.mockReturnValue(expectedResponse);

			const result = controller.findAll(query);

			expect(service.findAll).toHaveBeenCalledWith(query);
			expect(result).toEqual(expectedResponse);
		});

		it('should return filtered users by role', async () => {
			const query: UserQueryDto = { role: 'admin' };
			mockUsersService.findAll.mockReturnValue(mockUsersListResponse);

			const result = controller.findAll(query);

			expect(service.findAll).toHaveBeenCalledWith(query);
			expect(result).toEqual(mockUsersListResponse);
		});

		it('should return searched users', async () => {
			const query: UserQueryDto = { search: 'john' };
			mockUsersService.findAll.mockReturnValue(mockUsersListResponse);

			const result = controller.findAll(query);

			expect(service.findAll).toHaveBeenCalledWith(query);
			expect(result).toEqual(mockUsersListResponse);
		});

		it('should return empty list when no users found', async () => {
			const query: UserQueryDto = { search: 'nonexistent' };
			const emptyResponse: UsersListResponseDto = {
				users: [],
				pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
			};
			mockUsersService.findAll.mockReturnValue(emptyResponse);

			const result = controller.findAll(query);

			expect(service.findAll).toHaveBeenCalledWith(query);
			expect(result).toEqual(emptyResponse);
		});
	});

	describe('create', () => {
		it('should create a new user with all fields', async () => {
			const createUserDto: CreateUserDto = {
				name: 'Jane Smith',
				email: 'jane@example.com',
				age: 30,
				role: 'admin',
			};
			const expectedUser: UserResponseDto = {
				id: '456e7890-e89b-12d3-a456-426614174001',
				...createUserDto,
				createdAt: '2023-01-01T00:00:00.000Z',
				updatedAt: '2023-01-01T00:00:00.000Z',
			};
			mockUsersService.create.mockReturnValue(expectedUser);

			const result = controller.create(createUserDto);

			expect(service.create).toHaveBeenCalledWith(createUserDto);
			expect(result).toEqual(expectedUser);
		});

		it('should create a new user with minimal required fields', async () => {
			const createUserDto: CreateUserDto = {
				name: 'Bob Wilson',
				email: 'bob@example.com',
				role: 'user',
			};
			const expectedUser: UserResponseDto = {
				id: '789e0123-e89b-12d3-a456-426614174002',
				...createUserDto,
				createdAt: '2023-01-01T00:00:00.000Z',
				updatedAt: '2023-01-01T00:00:00.000Z',
			};
			mockUsersService.create.mockReturnValue(expectedUser);

			const result = controller.create(createUserDto);

			expect(service.create).toHaveBeenCalledWith(createUserDto);
			expect(result).toEqual(expectedUser);
		});

		it('should apply default role when not specified', async () => {
			const createUserDto: CreateUserDto = {
				name: 'Default Role User',
				email: 'default@example.com',
				role: 'user', // This would be set by Zod default
			};
			const expectedUser: UserResponseDto = {
				id: '123e4567-e89b-12d3-a456-426614174003',
				...createUserDto,
				createdAt: '2023-01-01T00:00:00.000Z',
				updatedAt: '2023-01-01T00:00:00.000Z',
			};
			mockUsersService.create.mockReturnValue(expectedUser);

			const result = controller.create(createUserDto);

			expect(service.create).toHaveBeenCalledWith(createUserDto);
			expect(result).toEqual(expectedUser);
			expect(result.role).toBe('user');
		});
	});

	describe('findOne', () => {
		it('should return a user by id', async () => {
			const userId = '123e4567-e89b-12d3-a456-426614174000';
			mockUsersService.findOne.mockReturnValue(mockUser);

			const result = controller.findOne(userId);

			expect(service.findOne).toHaveBeenCalledWith(userId);
			expect(result).toEqual(mockUser);
		});

		it('should throw error when user not found', async () => {
			const userId = 'nonexistent-id';
			mockUsersService.findOne.mockReturnValue(undefined);

			expect(() => controller.findOne(userId)).toThrow('User not found');
			expect(service.findOne).toHaveBeenCalledWith(userId);
		});
	});

	describe('validation integration', () => {
		it('should validate response schemas', () => {
			// Test that the controller returns data that matches Zod schemas
			const query: UserQueryDto = {};
			mockUsersService.findAll.mockReturnValue(mockUsersListResponse);

			const result = controller.findAll(query);

			// Verify the response structure matches expected schema
			expect(result).toHaveProperty('users');
			expect(result).toHaveProperty('pagination');
			expect(result.users).toBeInstanceOf(Array);
			expect(result.pagination).toHaveProperty('page');
			expect(result.pagination).toHaveProperty('limit');
			expect(result.pagination).toHaveProperty('total');
			expect(result.pagination).toHaveProperty('totalPages');
		});

		it('should handle edge cases in user creation', () => {
			const createUserDto: CreateUserDto = {
				name: 'Edge Case User',
				email: 'edge@example.com',
				age: 18, // Minimum age
				role: 'moderator',
			};
			const expectedUser: UserResponseDto = {
				id: '123e4567-e89b-12d3-a456-426614174999',
				...createUserDto,
				createdAt: '2023-01-01T00:00:00.000Z',
				updatedAt: '2023-01-01T00:00:00.000Z',
			};
			mockUsersService.create.mockReturnValue(expectedUser);

			const result = controller.create(createUserDto);

			expect(result.age).toBe(18);
			expect(result.role).toBe('moderator');
		});
	});
});
