import { Controller, Get, Post, Body, Query, Param, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
	zodCreateUserDto,
	zodUserQueryDto,
	zodUserResponseDto,
	zodUsersListResponseDto,
	CreateUserDto,
	UserQueryDto,
	UserResponseDto,
	UsersListResponseDto,
} from '../../common/dto/user.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@UsePipes(new ZodValidationPipe(zodUserQueryDto))
	findAll(@Query() query: UserQueryDto): UsersListResponseDto {
		const result = this.usersService.findAll(query);
		return zodUsersListResponseDto.parse(result);
	}

	@Post()
	@UsePipes(new ZodValidationPipe(zodCreateUserDto))
	create(@Body() createUserDto: CreateUserDto): UserResponseDto {
		const result = this.usersService.create(createUserDto);
		return zodUserResponseDto.parse(result);
	}

	@Get(':id')
	findOne(@Param('id') id: string): UserResponseDto {
		const user = this.usersService.findOne(id);
		if (!user) {
			throw new Error('User not found');
		}
		return zodUserResponseDto.parse(user);
	}
}
