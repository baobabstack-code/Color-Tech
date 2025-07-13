// This service will handle all API calls for the settings page.

const API_BASE_URL = '/api/settings';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }
  return response.json();
};

const apiGet = async (endpoint: string) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);
  return handleResponse(response);
};

const apiPost = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// --- General Settings ---
export const getGeneralSettings = () => apiGet('general');
export const updateGeneralSettings = (settings: any) => apiPost('general', settings);

// --- Profile Settings ---
export const getProfileSettings = () => apiGet('profile');
export const updateProfileSettings = (settings: any) => apiPost('profile', settings);

// --- Appearance Settings ---
export const getAppearanceSettings = () => apiGet('appearance');
export const updateAppearanceSettings = (settings: any) => apiPost('appearance', settings);

// --- Booking Settings ---
export const getBookingSettings = () => apiGet('booking');
export const updateBookingSettings = (settings: any) => apiPost('booking', settings);

// --- Notification Settings ---
export const getNotificationSettings = () => apiGet('notifications');
export const updateNotificationSettings = (settings: any) => apiPost('notifications', settings);

// --- Integration Settings ---
export const getIntegrationSettings = () => apiGet('integrations');
export const updateIntegrationSettings = (settings: any) => apiPost('integrations', settings);
