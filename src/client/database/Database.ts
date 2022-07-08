import { join } from 'path';
import { createConnection, getRepository, Repository } from 'typeorm';

import { User } from '../../entities/user.entity';

export default class Database {
  public userRepository: Repository<User>;

  public async start(): Promise<void> {
    await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [join('src', '**', '*.entity.{js,ts}')],
      synchronize: true,
    });

    this.userRepository = getRepository(User);
  }
}
