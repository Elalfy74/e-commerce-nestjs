import { Test } from '@nestjs/testing';

import { UsersService } from '../users.service';
import { AuthService } from './auth.service';

it('Can create instance of auth service', async () => {
  const module = await Test.createTestingModule({
    providers: [AuthService],
  }).compile();

  const service = module.get(AuthService);
});
