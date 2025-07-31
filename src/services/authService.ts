interface User {
  uid: string;
  displayName?: string;
  email?: string;
}

export const authService = {
  async register(email: string, password: string, displayName: string) {
    // Mock registration
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          uid: 'mock-user-id',
          email,
          displayName
        };
        resolve(mockUser);
      }, 1000);
    });
  },

  async login(email: string, password: string) {
    // Mock login
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          uid: 'mock-user-id',
          email,
          displayName: 'Test User'
        };
        resolve(mockUser);
      }, 1000);
    });
  },

  async logout() {
    // Mock logout
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }
}; 