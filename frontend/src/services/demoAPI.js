// Demo/Mock data for testing without backend
export const demoUsers = [
  {
    id: 1,
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'demo123', // In real app, this would be hashed
    role: 'admin'
  },
  {
    id: 2,
    name: 'Test User',
    email: 'test@example.com', 
    password: 'test123',
    role: 'user'
  }
];

export const demoData = [
  {
    id: 1,
    title: 'Demo Veri 1',
    description: 'Bu bir demo veridir. Backend bağlantısı olmadan test edebilirsiniz.'
  },
  {
    id: 2,
    title: 'Test Verisi',
    description: 'İkinci test verisi. Uygulamanın nasıl çalıştığını gösterir.'
  },
  {
    id: 3,
    title: 'Örnek İçerik',
    description: 'Üçüncü örnek veri. Frontend özellikleri burada test edilebilir.'
  }
];

// Demo API functions
export const demoAPI = {
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    const user = demoUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (user) {
      const token = 'demo-jwt-token-' + Date.now();
      return {
        data: {
          token,
          user: { id: user.id, name: user.name, email: user.email, role: user.role }
        }
      };
    } else {
      throw new Error('Geçersiz email veya şifre');
    }
  },
  
  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (demoUsers.find(u => u.email === userData.email)) {
      throw new Error('Bu email adresi zaten kayıtlı');
    }
    
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'user'
    };
    
    demoUsers.push({ ...newUser, password: userData.password });
    
    const token = 'demo-jwt-token-' + Date.now();
    return {
      data: {
        token,
        user: newUser
      }
    };
  },
  
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const token = localStorage.getItem('token');
    if (!token || !token.startsWith('demo-jwt-token')) {
      throw new Error('Invalid token');
    }
    
    return {
      data: {
        user: demoUsers.find(u => u.email === 'demo@example.com') || demoUsers[0]
      }
    };
  },
  
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      data: demoUsers.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }))
    };
  },
  
  getData: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { data: [...demoData] };
  },
  
  postData: async (newData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const item = {
      id: Date.now(),
      ...newData
    };
    demoData.push(item);
    return { data: item };
  }
};

// Check if we should use demo mode
export const isDemoMode = () => {
  return !import.meta.env.VITE_API_URL || import.meta.env.VITE_DEMO_MODE === 'true';
};

export default demoAPI;