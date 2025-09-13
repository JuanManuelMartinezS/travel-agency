import { Role } from './role.model';

describe('Role', () => {
  it('should create an instance', () => {
    const testRole: Role = {
      id: 1,
      name: 'tralala',
      description: ''
    };
    expect(testRole).toBeTruthy();
  });
});
