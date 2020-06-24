import { Table, Column, Model, DataType, Default, PrimaryKey, Unique, Scopes, BelongsTo, ForeignKey, HasMany, HasOne } from "sequelize-typescript";
import Token from "./token.model";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IUser {
  id: string;

  status: UserStatus;

  createdAt: Date;
  updatedAt: Date;
}

@Table
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id!: string;

  @Column
  status!: UserStatus;

  @HasMany(() => Token, {
    constraints: false,
  })
  auth!: Token[];
}

export default User;
