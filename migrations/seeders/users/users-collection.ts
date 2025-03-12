import { Schema } from 'mongoose';

import { UserDTO } from '@modules/shared/users/infrastructure/users-model';

const users: UserDTO[] = [
  {
    _id: 'fd7dae8e-7d41-495f-a445-2b741c97252b' as unknown as Schema.Types.UUID,
    name: 'John Doe',
    email: 'john.doe@example.com',
    created_at: new Date('2023-01-15T08:30:00Z'),
    updated_at: new Date('2023-01-15T08:30:00Z'),
  },
  {
    _id: '66ec0221-b6ae-4ede-a39f-a2917dfa78d0' as unknown as Schema.Types.UUID,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    created_at: new Date('2023-02-20T14:45:00Z'),
    updated_at: new Date('2023-03-10T11:22:00Z'),
  },
  {
    _id: 'c11b8652-a0a9-44ed-b2b4-9eee99200501' as unknown as Schema.Types.UUID,
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    created_at: new Date('2023-03-05T09:15:00Z'),
    updated_at: new Date('2023-03-05T09:15:00Z'),
  },
  {
    _id: 'e95d4bd8-76cc-4a3e-b5e3-4030a8c5f252' as unknown as Schema.Types.UUID,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    created_at: new Date('2023-04-12T16:20:00Z'),
    updated_at: new Date('2023-05-01T10:05:00Z'),
  },
  {
    _id: '0f2baa7a-bdb5-48e7-ad1e-77a6d1fe9d67' as unknown as Schema.Types.UUID,
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    created_at: new Date('2023-05-25T13:40:00Z'),
    updated_at: new Date('2023-05-25T13:40:00Z'),
  },
];

export default users;
