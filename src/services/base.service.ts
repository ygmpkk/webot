import { IUser } from "../models/user.model";
import { Context } from "../context";

export class BaseService {
  protected context: Context<IUser>;

  constructor(context: Context<IUser>) {
    this.context = context;
  }
}
