import { requireGraphql } from "../requireGraphql";
import { makeExecutableSchema } from "graphql-tools";
import { ScopeDirective } from "../schemaDirectives/scope.directive";

export const schemaDirectives = {
  scope: ScopeDirective,
};

export const adminSchema = makeExecutableSchema({
  typeDefs: [
    requireGraphql("./typedefs/scope.graphql"),
    requireGraphql("./typedefs/base.graphql"),
    requireGraphql("./typedefs/admin.graphql"),
  ],
  resolvers: [require("./base.resolve"), require("./admin.resolve")],
  schemaDirectives,
});

export const webhookSchema = makeExecutableSchema({
  typeDefs: [
    requireGraphql("./typedefs/scope.graphql"),
    requireGraphql("./typedefs/base.graphql"),
    requireGraphql("./typedefs/webhook.graphql"),
  ],
  resolvers: [require("./base.resolve"), require("./webhook.resolve")],
  schemaDirectives,
});
