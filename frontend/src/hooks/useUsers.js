import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../services/api';

// Kullanıcıları getir
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userAPI.getUsers(),
    select: (data) => data.data, // Sadece data kısmını dön
    staleTime: 5 * 60 * 1000, // 5 dakika fresh tut
  });
};

// Tek kullanıcı getir
export const useUser = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userAPI.getUser(userId),
    select: (data) => data.data,
    enabled: !!userId, // userId varsa çalış
  });
};

// Kullanıcı oluştur
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userAPI.createUser,
    onSuccess: (data) => {
      // Cache'i güncelle
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // Yeni kullanıcıyı cache'e ekle
      queryClient.setQueryData(['user', data.data.id], data);
    },
    onError: (error) => {
      console.error('User creation failed:', error);
    },
  });
};

// Kullanıcı güncelle
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }) => userAPI.updateUser(id, userData),
    onSuccess: (data, { id }) => {
      // İlgili cache'leri güncelle
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.setQueryData(['user', id], data);
    },
  });
};

// Kullanıcı sil
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userAPI.deleteUser,
    onSuccess: (_, userId) => {
      // Cache'den kaldır
      queryClient.removeQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};