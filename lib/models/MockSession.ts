import MockDatabase from '../../src/lib/mock-db';

export interface ISession {
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  device?: string;
  ip?: string;
  userAgent?: string;
  isActive: boolean;
}

export class MockSession {
  public userId: string;
  public token: string;
  public createdAt: Date;
  public expiresAt: Date;
  public device?: string;
  public ip?: string;
  public userAgent?: string;
  public isActive: boolean;

  constructor(data: {
    userId: string;
    token: string;
    expiresAt: Date;
    device?: string;
    ip?: string;
    userAgent?: string;
  }) {
    this.userId = data.userId;
    this.token = data.token;
    this.createdAt = new Date();
    this.expiresAt = data.expiresAt;
    this.device = data.device;
    this.ip = data.ip;
    this.userAgent = data.userAgent;
    this.isActive = true;
  }

  async save(): Promise<this> {
    // Session is already saved in MockDatabase when created
    return this;
  }

  toObject(): any {
    return {
      userId: this.userId,
      token: this.token,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
      device: this.device,
      ip: this.ip,
      userAgent: this.userAgent,
      isActive: this.isActive
    };
  }

  static findActiveByToken(token: string): Promise<MockSession | null> {
    const session = MockDatabase.findActiveSession(token);
    if (session) {
      return Promise.resolve(new MockSession({
        userId: session.userId,
        token: session.token,
        expiresAt: session.expiresAt,
        device: session.device,
        ip: session.ip,
        userAgent: session.userAgent
      }));
    }
    return Promise.resolve(null);
  }

  static findActiveByUserId(_userId: string): Promise<MockSession[]> {
    // This is a simplified implementation for mock
    return Promise.resolve([]);
  }

  static deactivateByToken(token: string): Promise<{ modifiedCount: number }> {
    const deactivated = MockDatabase.deactivateSession(token);
    return Promise.resolve({ modifiedCount: deactivated ? 1 : 0 });
  }

  static deactivateByUserId(_userId: string): Promise<{ modifiedCount: number }> {
    // This is a simplified implementation for mock
    return Promise.resolve({ modifiedCount: 0 });
  }

  static cleanupExpired(): Promise<{ deletedCount: number }> {
    // This is a simplified implementation for mock
    return Promise.resolve({ deletedCount: 0 });
  }
}

export const Session = MockSession;
