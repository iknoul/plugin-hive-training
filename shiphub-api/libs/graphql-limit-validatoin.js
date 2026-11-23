import { GraphQLError } from 'graphql';

export function checkLimit(limit) {
  if (limit !== undefined && (limit < 1 || limit > 100)) {
    throw new GraphQLError('Limit must be between 1 and 100', {
      extensions: { code: 'BAD_USER_INPUT', argumentName: 'limit' },
    });
  }
}
