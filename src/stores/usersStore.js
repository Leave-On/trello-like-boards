import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores';
import { fetchWrapper } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({
        users: {},
        user: {}
    }),
    actions: {
        async register(user) {
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getAll() {
            this.users = { loading: true };
            try{
                this.users = await fetchWrapper.get(baseUrl);    
            }
            catch(err){
                this.users = { error }
            }
        },
        async getById(id) {
            this.user = { loading: true };
            try {
                this.user = await fetchWrapper.get(`${baseUrl}/${id}`);
            } 
            catch (error) {
                this.user = { error };
            }
        }
    }
});