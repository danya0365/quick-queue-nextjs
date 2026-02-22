import { IAuthRepository } from '@/src/application/repositories/IAuthRepository';

export interface AdminLayoutViewModel {
  isAuthenticated: boolean;
  authChecking: boolean;
}

export class AdminLayoutPresenter {
  private state: AdminLayoutViewModel = {
    isAuthenticated: false,
    authChecking: true,
  };
  private notifyStateChange?: (state: AdminLayoutViewModel) => void;

  constructor(private readonly authRepository: IAuthRepository) {}

  bind(callback: (state: AdminLayoutViewModel) => void) {
    this.notifyStateChange = callback;
  }

  getInitialViewModel(): AdminLayoutViewModel {
    return this.state;
  }

  private updateState(partialState: Partial<AdminLayoutViewModel>) {
    this.state = { ...this.state, ...partialState };
    if (this.notifyStateChange) {
      this.notifyStateChange(this.state);
    }
  }

  async checkSession(): Promise<void> {
    this.updateState({ authChecking: true });
    try {
      const user = await this.authRepository.validateSession('');
      this.updateState({
        isAuthenticated: !!user,
        authChecking: false,
      });
    } catch {
      this.updateState({
        isAuthenticated: false,
        authChecking: false,
      });
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authRepository.logout('');
      this.updateState({ isAuthenticated: false });
    } catch (e) {
      console.error('Logout error:', e);
    }
  }

  setAuthenticated(isAuthenticated: boolean) {
    this.updateState({ isAuthenticated });
  }
}
