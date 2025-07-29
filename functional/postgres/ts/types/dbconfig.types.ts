import { Dialect } from 'sequelize';

export interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
}

export interface EnvConfig {
  development: DBConfig;
  test: DBConfig;
  production: DBConfig;
}