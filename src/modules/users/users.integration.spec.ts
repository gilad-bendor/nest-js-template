import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { UsersModule } from './users.module';

describe('Users (Integration)', () => {
	let app: NestFastifyApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [UsersModule],
		}).compile();

		app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
		await app.init();
		await app.getHttpAdapter().getInstance().ready();
	});

	afterEach(async () => {
		await app.close();
	});

	describe('GET /users', () => {
		it('should return users list with default pagination', () => {
			return request(app.getHttpServer())
				.get('/users')
				.expect(200)
				.expect((res) => {
					expect(res.body).toHaveProperty('users');
					expect(res.body).toHaveProperty('pagination');
					expect(Array.isArray(res.body.users)).toBe(true);
					expect(res.body.users.length).toBeGreaterThan(0);
					expect(res.body.pagination).toMatchObject({
						page: 1,
						limit: 10,
						total: expect.any(Number),
						totalPages: expect.any(Number),
					});
				});
		});

		it('should return paginated results', () => {
			return request(app.getHttpServer())
				.get('/users?page=1&limit=2')
				.expect(200)
				.expect((res) => {
					expect(res.body.pagination.page).toBe(1);
					expect(res.body.pagination.limit).toBe(2);
					expect(res.body.users.length).toBeLessThanOrEqual(2);
				});
		});

		it('should filter by role', () => {
			return request(app.getHttpServer())
				.get('/users?role=admin')
				.expect(200)
				.expect((res) => {
					res.body.users.forEach((user: any) => {
						expect(user.role).toBe('admin');
					});
				});
		});

		it('should search users', () => {
			return request(app.getHttpServer())
				.get('/users?search=john')
				.expect(200)
				.expect((res) => {
					if (res.body.users.length > 0) {
						const user = res.body.users[0];
						const searchTerm = 'john';
						const matchesName = user.name.toLowerCase().includes(searchTerm);
						const matchesEmail = user.email.toLowerCase().includes(searchTerm);
						expect(matchesName || matchesEmail).toBe(true);
					}
				});
		});

		it('should validate query parameters', () => {
			return request(app.getHttpServer())
				.get('/users?page=0') // Invalid page
				.expect(400)
				.expect((res) => {
					expect(res.body).toHaveProperty('message', 'Validation failed');
					expect(res.body).toHaveProperty('errors');
				});
		});

		it('should validate limit parameter', () => {
			return request(app.getHttpServer())
				.get('/users?limit=101') // Exceeds max limit
				.expect(400);
		});

		it('should validate role parameter', () => {
			return request(app.getHttpServer()).get('/users?role=invalid_role').expect(400);
		});
	});

	describe('POST /users', () => {
		it('should create a new user with valid data', () => {
			const newUser = {
				name: 'Integration Test User',
				email: 'integration@test.com',
				age: 25,
				role: 'user',
			};

			return request(app.getHttpServer())
				.post('/users')
				.send(newUser)
				.expect(201)
				.expect((res) => {
					expect(res.body).toMatchObject({
						name: newUser.name,
						email: newUser.email,
						age: newUser.age,
						role: newUser.role,
					});
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
					expect(typeof res.body.id).toBe('string');
				});
		});

		it('should create a user with minimal required fields', () => {
			const newUser = {
				name: 'Minimal User',
				email: 'minimal@test.com',
			};

			return request(app.getHttpServer())
				.post('/users')
				.send(newUser)
				.expect(201)
				.expect((res) => {
					expect(res.body.name).toBe(newUser.name);
					expect(res.body.email).toBe(newUser.email);
					expect(res.body.role).toBe('user'); // Default role
					expect(res.body.age).toBeUndefined();
				});
		});

		it('should validate required fields', () => {
			const invalidUser = {
				age: 25,
				// Missing name and email
			};

			return request(app.getHttpServer())
				.post('/users')
				.send(invalidUser)
				.expect(400)
				.expect((res) => {
					expect(res.body).toHaveProperty('message', 'Validation failed');
					expect(res.body).toHaveProperty('errors');
					expect(Array.isArray(res.body.errors)).toBe(true);
				});
		});

		it('should validate email format', () => {
			const invalidUser = {
				name: 'Test User',
				email: 'invalid-email',
				age: 25,
			};

			return request(app.getHttpServer()).post('/users').send(invalidUser).expect(400);
		});

		it('should validate age constraints', () => {
			const invalidUser = {
				name: 'Young User',
				email: 'young@test.com',
				age: 15, // Below minimum age
			};

			return request(app.getHttpServer()).post('/users').send(invalidUser).expect(400);
		});

		it('should validate role enum', () => {
			const invalidUser = {
				name: 'Invalid Role User',
				email: 'invalid@test.com',
				role: 'invalid_role',
			};

			return request(app.getHttpServer()).post('/users').send(invalidUser).expect(400);
		});

		it('should validate name length constraints', () => {
			const invalidUser = {
				name: '', // Empty name
				email: 'empty@test.com',
			};

			return request(app.getHttpServer()).post('/users').send(invalidUser).expect(400);
		});
	});

	describe('GET /users/:id', () => {
		it('should return a specific user by id', async () => {
			// First, create a user to test with
			const newUser = {
				name: 'Test User for ID',
				email: 'testid@test.com',
				role: 'user',
			};

			const createResponse = await request(app.getHttpServer())
				.post('/users')
				.send(newUser)
				.expect(201);

			const userId = createResponse.body.id;

			return request(app.getHttpServer())
				.get(`/users/${userId}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.id).toBe(userId);
					expect(res.body.name).toBe(newUser.name);
					expect(res.body.email).toBe(newUser.email);
				});
		});

		it('should return error for non-existent user', () => {
			const nonExistentId = 'non-existent-id';

			return request(app.getHttpServer())
				.get(`/users/${nonExistentId}`)
				.expect(500) // Will throw "User not found" error
				.expect((res) => {
					expect(res.body).toHaveProperty('message');
				});
		});
	});

	describe('Integration workflows', () => {
		it('should support complete user lifecycle', async () => {
			// 1. Create a user
			const newUser = {
				name: 'Lifecycle User',
				email: 'lifecycle@test.com',
				age: 30,
				role: 'moderator',
			};

			const createResponse = await request(app.getHttpServer())
				.post('/users')
				.send(newUser)
				.expect(201);

			const userId = createResponse.body.id;

			// 2. Verify user appears in list
			await request(app.getHttpServer())
				.get('/users')
				.expect(200)
				.expect((res) => {
					const foundUser = res.body.users.find((u: any) => u.id === userId);
					expect(foundUser).toBeDefined();
					expect(foundUser.name).toBe(newUser.name);
				});

			// 3. Retrieve user by ID
			await request(app.getHttpServer())
				.get(`/users/${userId}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.id).toBe(userId);
					expect(res.body.name).toBe(newUser.name);
				});

			// 4. Search for the user
			await request(app.getHttpServer())
				.get(`/users?search=${newUser.name.toLowerCase()}`)
				.expect(200)
				.expect((res) => {
					const foundUser = res.body.users.find((u: any) => u.id === userId);
					expect(foundUser).toBeDefined();
				});

			// 5. Filter by role
			await request(app.getHttpServer())
				.get(`/users?role=${newUser.role}`)
				.expect(200)
				.expect((res) => {
					const foundUser = res.body.users.find((u: any) => u.id === userId);
					expect(foundUser).toBeDefined();
				});
		});
	});
});
