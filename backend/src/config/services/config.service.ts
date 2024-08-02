import { Config } from "../types"
import { ConfigService as BaseConfigService } from "@nestjs/config"
import { Injectable } from "@nestjs/common"

@Injectable()
export class ConfigService {
  constructor(private baseConfig: BaseConfigService<Config, true>) {}

  public get<Key extends keyof Config>(key: Key): Config[Key] {
    return this.baseConfig.get(key)
  }

  public isTest() {
    return process.env.NODE_ENV === "test"
  }
}
