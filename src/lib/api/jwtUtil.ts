// Mock implementation for jwtUtil
export const verifyJWT = async () => {
  return {
    id: 1,
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    role: "admin",
  };
};
