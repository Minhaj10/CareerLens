const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const handleResponse = async (res: Response) => {
  try {
    return await res.json();
  } catch {
    return { message: 'Server error — please try again' };
  }
};

export const api = {
  register: async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      return handleResponse(res);
    } catch {
      return { message: 'Cannot connect to server' };
    }
  },

  login: async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return handleResponse(res);
    } catch {
      return { message: 'Cannot connect to server' };
    }
  },

  getJobs: async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return handleResponse(res);
    } catch {
      return { message: 'Cannot connect to server' };
    }
  },

  createJob: async (token: string, jobData: object) => {
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });
      return handleResponse(res);
    } catch {
      return { message: 'Cannot connect to server' };
    }
  },

  deleteJob: async (token: string, jobId: string) => {
    try {
      const res = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return handleResponse(res);
    } catch {
      return { message: 'Cannot connect to server' };
    }
  },

  updateJob: async (token: string, jobId: string, data: object) => {
    try {
      const res = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    } catch {
      return { message: 'Cannot connect to server' };
    }
  }
};

export const saveToken = (token: string) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');