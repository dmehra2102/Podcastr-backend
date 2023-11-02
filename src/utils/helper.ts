import { UserRole } from "@/enums/user.enum";

const isFileValid = (file: any) => {
  const type = file.type.split("/").pop();
  const validTypes = ["jpg", "jpeg", "png"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};

export const isUserAdmin = (role: UserRole) => {
  return [UserRole.ADMIN].includes(role);
};
