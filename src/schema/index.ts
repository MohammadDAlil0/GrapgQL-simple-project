import {mergeTypeDefs} from '@graphql-tools/merge';

import { usersGQLSchema } from './users';
import { productsGQLSchema } from './products';

export const mergedGQLSchema = mergeTypeDefs([usersGQLSchema, productsGQLSchema]);