import { Command, CommandRunner, Option } from "nest-commander"
import { CreateUserService } from "src/app/services/createUser.service"

type Options = {
  firstName: string
  lastName: string
  email: string
  password: string
}

@Command({ name: "create-user", description: "creates a user" })
export class CreateUserCommand extends CommandRunner {
  constructor(private createUserService: CreateUserService) {
    super()
  }

  public async run(_: string[], data: Options) {
    await this.createUserService.execute(data)
  }

  @Option({
    name: "email",
    flags: "-e --email [string]",
    description: "email",
  })
  protected parseEmail(value: string) {
    return value
  }

  @Option({
    name: "password",
    flags: "-p --password [string]",
    description: "password",
  })
  protected parsePassword(value: string) {
    return value
  }

  @Option({
    name: "firstName",
    flags: "-f --first-name [string]",
    description: "first name",
  })
  protected parseFirstName(value: string) {
    return value
  }

  @Option({
    name: "lastName",
    flags: "-l --last-name [string]",
    description: "last name",
  })
  protected parseLastName(value: string) {
    return value
  }
}
