import {
  Body,
  Delete,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { EditBookmarkDto } from './dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditUserDto } from '../user/dto/edit-user.dto';
import { Prisma } from '.prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { throws } from 'assert';
import { Bookmark } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarksById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async editBookmarksById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }
    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
