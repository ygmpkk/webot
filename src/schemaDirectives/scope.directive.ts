import { DirectiveLocation, GraphQLDirective, GraphQLEnumType, GraphQLSchema, defaultFieldResolver } from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";
import { Scope } from "../models/scope.enum";
import { AuthService } from "../services/auth.service";

export class ScopeDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { type } = this.args;
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async function (...args) {
      const [, , ctx] = args;
      const { req, reply } = ctx;

      if (type === Scope.PUBLIC_OR_PRIVATE) {
        try {
          const auth = new AuthService(ctx);
          if (auth.getToken(req)) {
            await auth.authenticate();
            checkVerify(req);
          }
        } catch (error) {
          reply.code(401);
          throw error;
        }
      } else if (type === Scope.PRIVATE) {
        try {
          const auth = new AuthService(ctx);
          await auth.authenticate();
          checkVerify(req);
        } catch (error) {
          req.log.error("score error => ", error);
          reply.code(401);
          throw error;
        }
      }

      return resolve.apply(this, args);
    };
  }

  public static getDirectiveDeclaration(directiveName: string, schema: GraphQLSchema): GraphQLDirective {
    return new GraphQLDirective({
      name: directiveName,
      locations: [DirectiveLocation.FIELD_DEFINITION],
      args: {
        type: {
          type: schema.getType("Scope") as GraphQLEnumType,
          defaultValue: "PUBLIC",
        },
      },
    });
  }
}

const checkVerify = (req) => {
  if (!(req && req.user && req.user.id)) {
    throw new Error("未认证");
  }
};
