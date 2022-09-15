import { createRouter, createWebHistory } from 'vue-router'
import { Home, Login} from '../views'
import { useAuthStore, useAlertStore  } from '@/stores';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    { 
      path: '/:pathMatch(.*)*', 
      redirect: '/' 
    }
  ]
})

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
      // clear alert on route change
  const alertStore = useAlertStore();
  alertStore.clear();

  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (authRequired && !auth.user) {
      auth.returnUrl = to.fullPath;
      return '/login';
  }
})

export default router
