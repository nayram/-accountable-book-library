import { userRepositoryBuilder } from './user-repository';
import { userModel } from './users-model';

export const userRepository = userRepositoryBuilder({ model: userModel });
