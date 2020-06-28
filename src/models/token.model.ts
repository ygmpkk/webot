import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  PrimaryKey,
  Default,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import User from "./user.model";

export enum AuthType {
  MOBILE = "MOBILE",
  WECHAT = "WECHAT",
  APPLE = "APPLE",
  LOCAL = "LOCAL",
  TOKEN = "TOKEN",
}

export interface IToken {
  authId: string;
  type: AuthType;
}

@Table
export class Token extends Model<Token> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id!: string;

  @Unique
  @Column
  identity!: string;

  @Column(DataType.STRING)
  type!: AuthType;

  @ForeignKey(() => User)
  @Column
  userId!: string;

  @Column(DataType.JSON)
  raw!: any;

  @BelongsTo(() => User, {
    constraints: false,
  })
  user!: User;
}

export default Token;
