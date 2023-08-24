/**
 * generates a one time password for user
 * @returns : string containing one time password
 */
export const generateOtp = (): string => {
  return Math.floor(Math.random() * 899999 + 10000).toString();
};
