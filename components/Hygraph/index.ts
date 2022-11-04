import { GraphQLClient } from 'graphql-request';
const hygraph = new GraphQLClient(
  'https://api-us-west-2.hygraph.com/v2/cla132w820ass01ugauwkf0y8/master'
);

export { hygraph };
