import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get access token', () => {
    sessionStorage.setItem('accessToken', 'token');
    expect(service.getAccessToken()).toBe('token');
  });

  it('should get refresh token', () => {
    sessionStorage.setItem('refreshToken', 'token2');
    expect(service.getRefreshToken()).toBe('token2');
  });

  it('should get user', () => {
    sessionStorage.setItem('user', JSON.stringify({id: '1'}));
    expect(service.getUser()?.id).toBe('1');
  });

  it('should handle invalid user json', () => {
    sessionStorage.setItem('user', '{invalid');
    expect(service.getUser()).toBeNull();
  });

  it('should handle no user json', () => {
    expect(service.getUser()).toBeNull();
  });

  it('should clear session', () => {
    sessionStorage.setItem('accessToken', '1');
    sessionStorage.setItem('refreshToken', '2');
    sessionStorage.setItem('user', '3');
    service.clearSession();
    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
    expect(sessionStorage.getItem('user')).toBeNull();
  });

  it('should check if authenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
    sessionStorage.setItem('accessToken', '1');
    expect(service.isAuthenticated()).toBe(true);
  });
});
