const STEAM_AUTH_URL = 'https://functions.poehali.dev/23fd9d10-5341-4daf-a521-53c651f532f9';

export interface SteamUser {
  steamId: string;
  name: string;
  avatar: string;
  profileUrl: string;
}

export const getSteamLoginUrl = async (): Promise<string> => {
  const response = await fetch(STEAM_AUTH_URL);
  const data = await response.json();
  return data.loginUrl;
};

export const getSteamUser = async (queryParams: URLSearchParams): Promise<SteamUser | null> => {
  if (!queryParams.has('openid.claimed_id')) {
    return null;
  }

  const url = `${STEAM_AUTH_URL}?${queryParams.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to authenticate with Steam');
  }
  
  const user: SteamUser = await response.json();
  return user;
};

export const saveUser = (user: SteamUser) => {
  localStorage.setItem('steamUser', JSON.stringify(user));
};

export const getUser = (): SteamUser | null => {
  const userJson = localStorage.getItem('steamUser');
  return userJson ? JSON.parse(userJson) : null;
};

export const logout = () => {
  localStorage.removeItem('steamUser');
};

export const isAdmin = (user: SteamUser | null): boolean => {
  if (!user) return false;
  
  const adminIds = localStorage.getItem('adminSteamIds');
  if (!adminIds) {
    return true;
  }
  
  const adminList = JSON.parse(adminIds);
  return adminList.includes(user.steamId);
};
