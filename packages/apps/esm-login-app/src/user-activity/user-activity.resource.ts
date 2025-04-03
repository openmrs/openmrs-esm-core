import { openmrsFetch } from '@openmrs/esm-framework';

export interface LoginActivity {
  timestamp: string;
  status: 'success' | 'failed';
  ipAddress: string;
  deviceInfo: string;
}

export interface SecurityStatus {
  lastLogin: string;
  activeSessions: number;
  failedAttempts: number;
  securityAlerts: string[];
}

export interface ActiveSession {
  userUuid: string;
  username: string;
  loginTime: string;
  ipAddress: string;
  deviceInfo: string;
}

export async function getUserLoginHistory(userUuid: string): Promise<LoginActivity[]> {
  try {
    // In a real implementation, this would fetch from the backend
    // For now, returning mock data
    return [
      {
        timestamp: new Date().toISOString(),
        status: 'success',
        ipAddress: '192.168.1.1',
        deviceInfo: 'Chrome on Windows',
      },
      {
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: 'success',
        ipAddress: '192.168.1.1',
        deviceInfo: 'Chrome on Windows',
      },
    ];
  } catch (error) {
    console.error('Error fetching login history:', error);
    throw new Error('Failed to fetch login history');
  }
}

export async function getSecurityStatus(userUuid: string): Promise<SecurityStatus> {
  try {
    // In a real implementation, this would fetch from the backend
    return {
      lastLogin: new Date().toISOString(),
      activeSessions: 1,
      failedAttempts: 0,
      securityAlerts: [],
    };
  } catch (error) {
    console.error('Error fetching security status:', error);
    throw new Error('Failed to fetch security status');
  }
}

export async function exportActivityLog(userUuid: string): Promise<Blob> {
  try {
    // In a real implementation, this would generate and return a CSV/PDF
    const mockData = 'Timestamp,Status,IP Address,Device Info\n';
    return new Blob([mockData], { type: 'text/csv' });
  } catch (error) {
    console.error('Error exporting activity log:', error);
    throw new Error('Failed to export activity log');
  }
}

export async function getAllActiveSessions(): Promise<ActiveSession[]> {
  try {
    // In a real implementation, this would fetch from the backend
    return [
      {
        userUuid: '123',
        username: 'admin',
        loginTime: new Date().toISOString(),
        ipAddress: '192.168.1.1',
        deviceInfo: 'Chrome on Windows',
      },
    ];
  } catch (error) {
    console.error('Error fetching active sessions:', error);
    throw new Error('Failed to fetch active sessions');
  }
}

export async function getSecurityAlerts(): Promise<string[]> {
  try {
    // In a real implementation, this would fetch from the backend
    return ['Multiple failed login attempts detected', 'Unusual login location detected'];
  } catch (error) {
    console.error('Error fetching security alerts:', error);
    throw new Error('Failed to fetch security alerts');
  }
}
