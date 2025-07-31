export const mockMutate = jest.fn();

export const useDeletePatient = () => ({
  mutate: mockMutate,
});

export const useDeleteTeamMember = () => ({
  mutate: mockMutate,
});

export const useCreatePatient = () => ({
  mutateAsync: mockMutate,
  isLoading: false,
});

export const useUpdateTeamMember = () => ({
  mutate: mockMutate,
});

export const useAuth = () => ({
  user: { role: "admin" },
  login: jest.fn(),
  isLoginPending: false,
  isErrorLogin: false,
});
