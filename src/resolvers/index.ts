import { requireGraphql } from "../requireGraphql";
import { makeExecutableSchema } from "graphql-tools";
import { ScopeDirective } from "../schemaDirectives/scope.directive";

export const typeDefs = [
  requireGraphql("./typedefs/scope.graphql"),
  requireGraphql("./typedefs/base.graphql"),
  requireGraphql("./typedefs/admin.graphql"),
  requireGraphql("./typedefs/webhook.graphql"),
];

export const resolvers = [
  require("./base.resolve"),
  require("./admin.resolve"),
  require("./webhook.resolve"),
];

export const schemaDirectives = {
  scope: ScopeDirective,
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives,
});
