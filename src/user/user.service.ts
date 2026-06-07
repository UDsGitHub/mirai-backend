import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma.service';
import { Prisma, PrismaPromise } from '../generated/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const { genrePreferences, tagPreferences, ...userProfileData } =
      createUserInput;

    const insertGenrePreferences = this.prisma.userGenrePreference.createMany({
      data: genrePreferences.map((genreId) => ({
        userId: createUserInput.userId,
        genreId: genreId,
        weight: 1,
      })),
    });

    const insertTagPreferences = this.prisma.userTagPreference.createMany({
      data: tagPreferences.map((tagId) => ({
        userId: createUserInput.userId,
        tagId: tagId,
        weight: 1,
      })),
    });

    const createUserProfile = this.prisma.userProfile.create({
      data: userProfileData,
    });

    return await this.prisma.$transaction([
      insertGenrePreferences,
      insertTagPreferences,
      createUserProfile,
    ]);
  }

  async findAll() {
    return await this.prisma.userProfile.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.userProfile.findUnique({
      where: {
        userId: id,
      },
    });
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const { genrePreferences, tagPreferences, ...userProfileData } =
      updateUserInput;
    const operations: PrismaPromise<Prisma.BatchPayload>[] = [];

    if (genrePreferences) {
      const deleteGenrePreferences = this.prisma.userGenrePreference.deleteMany(
        {
          where: {
            userId: id,
          },
        },
      );
      const createUpdatedGenrePreferences =
        this.prisma.userGenrePreference.createMany({
          data: genrePreferences.map((genreId) => ({
            userId: id,
            genreId: genreId,
            weight: 1,
          })),
        });

      operations.push(deleteGenrePreferences);
      operations.push(createUpdatedGenrePreferences);
    }

    if (tagPreferences) {
      const deleteTagPreferences = this.prisma.userTagPreference.deleteMany({
        where: {
          userId: id,
        },
      });
      const createUpdatedTagPreferences =
        this.prisma.userTagPreference.createMany({
          data: tagPreferences.map((tagId) => ({
            userId: id,
            tagId: tagId,
            weight: 1,
          })),
        });

      operations.push(deleteTagPreferences);
      operations.push(createUpdatedTagPreferences);
    }

    const updateUserProfile = this.prisma.userProfile.update({
      where: {
        userId: id,
      },
      data: userProfileData,
    });

    return await this.prisma.$transaction([...operations, updateUserProfile]);
  }

  async remove(id: string) {
    return await this.prisma.userProfile.delete({
      where: {
        userId: id,
      },
    });
  }
}
