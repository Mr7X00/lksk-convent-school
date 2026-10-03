/**
 * L.K.S.K Convent School - Administrator Authentication Client Utility
 */

const TOKEN_KEY = 'lksk_admin_token';
const ADMIN_KEY = 'lksk_admin_data';

export const AdminAuth = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getAdmin() {
    const raw = localStorage.getItem(ADMIN_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setAuth(token, adminData) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(adminData));
  },

  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },

  /**
   * Verify token validity against the backend API
   */
  async verifySession() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        this.clearAuth();
        return null;
      }

      const json = await response.json();
      if (json.success && json.data?.admin) {
        // Update stored profile with latest server record
        localStorage.setItem(ADMIN_KEY, JSON.stringify(json.data.admin));
        return json.data.admin;
      }

      this.clearAuth();
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Perform secure logout
   */
  async logout() {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        console.warn('Backend logout notification failed:', err);
      }
    }

    this.clearAuth();
    window.location.href = '/admin/login.html';
  },

  /**
   * Wrapper for making authenticated API requests
   */
  async authFetch(url, options = {}) {
    const token = this.getToken();
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, { ...options, headers });

    // Handle token expiration or revocation
    if (response.status === 401) {
      this.clearAuth();
      window.location.href = '/admin/login.html';
      throw new Error('Session expired or revoked');
    }

    return response;
  },

  /**
   * Protect an admin page - redirect to login if not authenticated
   */
  async requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.replace('/admin/login.html');
      return null;
    }

    const verifiedAdmin = await this.verifySession();
    if (!verifiedAdmin) {
      window.location.replace('/admin/login.html');
      return null;
    }

    return verifiedAdmin;
  },
};
