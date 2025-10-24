import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: '/login', name: 'login',component: () => import('@/views/Login.vue') },
    { path: '/about', name: 'about', component: () => import('@/views/About.vue') },
    { path: '/reviews', name: 'reviews', component: () => import('@/views/Reviews.vue') },
    { path: '/marketing', name: 'marketing', component: () => import('@/views/Marketing.vue') },
    { path: '/summaries', name: 'summaries', component: () => import('@/views/Summaries.vue') },
    { path: '/account', name: 'account', component: () => import('@/views/Account.vue') },
    { path: '/plans', name: 'plans', component: () => import('@/views/Plans.vue') },



]

const router = createRouter({
    history: createWebHistory(),
    routes
}) 

export default router;