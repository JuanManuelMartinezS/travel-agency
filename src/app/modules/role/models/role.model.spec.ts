import { Role } from './role.model';

describe('Role', () => {
  it('should create an instance', () => {
    const testRole: Role = {
      _id: '',
      name: 'tralala',
      description: ''
    };
    expect(testRole).toBeTruthy();
  });
});
