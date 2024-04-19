import bcrypt from "bcrypt";

export const crypted = async (password: string) => {
  const salt = await bcrypt.genSalt(8);
  const encryptedPassword = await bcrypt.hash(password, salt);
  return encryptedPassword;
};

export const compare = async (password: string, encrypted: string) => {
  return await bcrypt.compare(password, encrypted);
};
