# Claude Code Configuration

This file contains configuration and commands for Claude Code to help with development.

## Development Commands

### Start Application
```bash
yarn start          # Start application with ts-node
yarn start:dev      # Start with watch mode
yarn start:debug    # Start with debug and watch mode
```

### Code Quality
```bash
yarn format         # Format code with Prettier
yarn format:check   # Check code formatting
```

### Testing
```bash
yarn test           # Run all tests
yarn test:watch     # Run tests in watch mode
yarn test:coverage  # Run tests with coverage report
yarn test:debug     # Run tests with debugger
```

## Project Structure

- **Framework**: NestJS with Fastify adapter
- **Language**: TypeScript (direct execution with ts-node, no transpiling)
- **Package Manager**: Yarn
- **Validation**: Zod schemas (naming: `zodT` for type `T`)
- **Formatting**: Prettier
- **Environment**: dotenv (.env file)

## Environment Variables

The application uses the following environment variables (see `.env.example`):

- `PORT`: Application port (default: 10000)
- `NODE_ENV`: Environment mode (development/production)
- `DATABASE_URL`: Database connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: JWT expiration time

## Folder Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
├── modules/               # Feature modules
├── common/
│   ├── dto/              # Data transfer objects with Zod schemas
│   ├── guards/           # Guards
│   ├── interceptors/     # Interceptors
│   ├── pipes/            # Validation pipes
│   └── decorators/       # Custom decorators
└── config/               # Configuration files
```

## API Endpoints

### Users API

#### GET /users - List users with query parameters
Query parameters (all optional):
- `page`: Page number (positive integer, default: 1)
- `limit`: Items per page (1-100, default: 10)
- `role`: Filter by role (`user`, `admin`, `moderator`)
- `search`: Search in name/email (1-50 characters)

Response: Paginated list with users array and pagination metadata

#### POST /users - Create new user
JSON payload:
- `name`: User name (1-100 characters, required)
- `email`: Valid email address (required)
- `age`: Age 18-120 (optional)
- `role`: Role enum (`user`, `admin`, `moderator`, default: `user`)

Response: Created user object with generated ID and timestamps

#### GET /users/:id - Get user by ID
Response: User object or error if not found

### Other Endpoints
- `GET /` - Hello World
- `GET /health` - Health check with uptime

## Testing with cURL

### Basic Endpoints
```bash
# Hello World
curl http://localhost:10000

# Health check
curl http://localhost:10000/health
```

### Users API Tests

#### GET /users - List all users (default pagination)
```bash
curl http://localhost:10000/users
```

#### GET /users - With pagination
```bash
curl "http://localhost:10000/users?page=1&limit=2"
```

#### GET /users - Filter by role
```bash
curl "http://localhost:10000/users?role=admin"
```

#### GET /users - Search by name/email
```bash
curl "http://localhost:10000/users?search=john"
```

#### GET /users - Combined filters
```bash
curl "http://localhost:10000/users?page=1&limit=5&role=user&search=doe"
```

#### POST /users - Create new user (valid)
```bash
curl -X POST http://localhost:10000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 28,
    "role": "moderator"
  }'
```

#### POST /users - Create user (minimal required fields)
```bash
curl -X POST http://localhost:10000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Smith",
    "email": "bob@example.com"
  }'
```

#### POST /users - Invalid data (triggers validation errors)
```bash
# Invalid email
curl -X POST http://localhost:10000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid User",
    "email": "not-an-email",
    "age": 15
  }'

# Missing required fields
curl -X POST http://localhost:10000/users \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25
  }'

# Invalid role
curl -X POST http://localhost:10000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "role": "invalid_role"
  }'
```

#### GET /users/:id - Get specific user
```bash
# First, create a user and note the returned ID, then:
curl http://localhost:10000/users/[USER_ID]

# Or use one of the seeded user IDs from the initial GET /users call
```

### Query Parameter Validation Tests
```bash
# Invalid page (should fail)
curl "http://localhost:10000/users?page=0"

# Invalid limit (should fail)
curl "http://localhost:10000/users?limit=101"

# Invalid role (should fail)
curl "http://localhost:10000/users?role=invalid"

# Empty search (should fail)
curl "http://localhost:10000/users?search="
```

## Development Notes

- TypeScript is configured to run directly with `ts-node`
- No build/dist folder needed for development
- Zod schemas follow naming convention: `zodCreateUserDto` for `CreateUserDto`
- All API input/output is validated using Zod schemas
- Comprehensive error messages for validation failures
- Prettier is configured for consistent code formatting
- Environment variables are loaded via dotenv
- Application runs on port 10000 by default

### WebStorm/tsx Compatibility

If you're using WebStorm and encounter dependency injection issues (usersService undefined), the following fixes have been applied:

1. **Explicit injection tokens** - Using `@Inject(USERS_SERVICE_TOKEN)` for more reliable DI
2. **Import order** - `reflect-metadata` imported first in main.ts
3. **tsx configuration** - Added tsx-specific tsconfig options for decorator metadata
4. **Explicit decorators** - All services use explicit `@Inject()` decorators

The application works with both:
- `ts-node src/main.ts` (yarn start)
- WebStorm's tsx runner with custom loader

## Testing Framework

**Jest** is configured as the testing framework with:

### Test Types
- **Unit Tests** - Test individual components in isolation
  - `*.controller.spec.ts` - Controller unit tests with mocked services
  - `*.service.spec.ts` - Service unit tests with actual business logic
- **Integration Tests** - Test complete API workflows
  - `*.integration.spec.ts` - Full HTTP request/response testing with Fastify

### Test Features
- **Mocking** - Services mocked in controller tests using `@nestjs/testing`
- **Validation Testing** - Comprehensive Zod schema validation tests
- **Error Scenarios** - Tests for validation failures and edge cases
- **Coverage Reports** - Code coverage with `yarn test:coverage`
- **Watch Mode** - Auto-rerun tests with `yarn test:watch`

### Sample Test Coverage
- **GET /users** - Pagination, filtering, search, validation
- **POST /users** - Creation, validation, error handling
- **GET /users/:id** - Retrieval by ID, not found scenarios
- **Edge Cases** - Invalid inputs, boundary conditions, empty results

Run unit tests only: `yarn test --testPathPatterns="controller|service"`