import { Module } from "@nestjs/common"
import { UsersController } from "./controllers/users.controller"
import { ProfileController } from "./controllers/profile.controller"
import { FindUserService } from "./services/findUser.service"
import { CreateUserService } from "./services/createUser.service"

@Module({
  controllers: [UsersController, ProfileController],
  providers: [CreateUserService, FindUserService],
  exports: [CreateUserService, FindUserService],
})
export class AppModule {}
