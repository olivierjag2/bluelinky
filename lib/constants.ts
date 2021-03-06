// moved all the US constants to its own file, we can use this file for shared constants
import { CA_ENDPOINTS } from './constants/canada';

export const EU_BASE_URL = 'https://prd.eu-ccapi.hyundai.com:8080';

export const EU_ENDPOINTS = {
  session: `${EU_BASE_URL}/api/v1/user/oauth2/authorize?response_type=code&state=test&client_id=6d477c38-3ca4-4cf3-9557-2a1929a94654&redirect_uri=${EU_BASE_URL}/api/v1/user/oauth2/redirect`,
  login: `${EU_BASE_URL}/api/v1/user/signin`,
  redirectUri: `${EU_BASE_URL}/api/v1/user/oauth2/redirect`,
  token: `${EU_BASE_URL}/api/v1/user/oauth2/token`
};

export const EU_CONSTANTS = {
  basicToken: 'Basic NmQ0NzdjMzgtM2NhNC00Y2YzLTk1NTctMmExOTI5YTk0NjU0OktVeTQ5WHhQekxwTHVvSzB4aEJDNzdXNlZYaG10UVI5aVFobUlGampvWTRJcHhzVg==',
  GCMSenderID: '199360397125'
}

export const ALL_ENDPOINTS =  {
  CA: CA_ENDPOINTS,
  EU: EU_ENDPOINTS,
};

export const GEN2 = 2;
export const GEN1 = 1;

export enum REGIONS {
  US = 'US',
  CA = 'CA',
  EU = 'EU'
}
