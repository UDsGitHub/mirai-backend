import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserProfile } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => UserProfile)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserProfile)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [UserProfile], { name: 'user' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => UserProfile, { name: 'user', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.userService.findOne(id);
  }

  @Mutation(() => UserProfile)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.userId, updateUserInput);
  }

  @Mutation(() => UserProfile)
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.userService.remove(id);
  }
}
