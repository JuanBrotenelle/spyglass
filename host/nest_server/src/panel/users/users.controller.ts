import { Controller, Get, Query, UseGuards, Sse, MessageEvent, Post, } from '@nestjs/common';
import { Observable, interval, from, map, switchMap } from 'rxjs';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/jwt/stream.guard';
import { BodyGuard } from 'src/jwt/jwt.guard';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('checktoken')
  @UseGuards(BodyGuard)
  checkToken() {
    return this.usersService.checkToken();
  }

  @Post('deleteuser')
  @UseGuards(BodyGuard)
  deleteUser(@Query('uuid') uuid: string) {
    return this.usersService.deleteUser(uuid);
  }

  @Sse('stream')
  @UseGuards(AuthGuard)
  sendUsers(
    @Query('quantity') quantity: number = -1,
    @Query('sort') sort: string = 'none',
    @Query('order') order: number = 1,
    @Query('strict') strict: number = 0,
    @Query('search') search?: string,
    @Query('token') token?: string
  ): Observable<MessageEvent> {
    return interval(2000).pipe(
      switchMap(() => 
        from(this.usersService.findUsers({ quantity, sort, order, strict, search }))
      ),
      map((users) => ({
        data: users,
      }))
    );
  }
}