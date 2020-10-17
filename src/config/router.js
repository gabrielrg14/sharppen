import Vue from 'vue'
import VueRouter from 'vue-router'

import Auth from '@/components/login/Auth'
import Feed from '@/components/template/Feed'
import Search from '@/components/template/Search'
import RegisterVestibulando from '@/components/login/RegisterVestibulando'
import RegisterFaculdade from '@/components/login/RegisterFaculdade'
import FaculdadeProfile from '@/components/faculdade/FaculdadeProfile'
import VestibulandoProfile from '@/components/vestibulando/VestibulandoProfile'
import FaculdadeById from '@/components/faculdade/FaculdadeById'
import VestibulandoById from '@/components/vestibulando/VestibulandoById'
import TimeManagementTool from '@/components/vestibulando/TimeManagementTool'

import { userKey } from '@/global'

Vue.use(VueRouter)

const routes = [{
    name: 'auth',
    path: '/login',
    component: Auth,
    meta: { disconnected: true }
}, {
    name: 'feed',
    path: '/',
    component: Feed,
    meta: { vestibulandoRestriction: true }
}, {
    name: 'search',
    path: '/buscar/:textSearch',
    component: Search,
}, {
    name: 'registerVestibulando',
    path: '/signup/vestibulando',
    component: RegisterVestibulando
}, {
    name: 'registerFaculdade',
    path: '/signup/faculdade',
    component: RegisterFaculdade
}, {
    name: 'faculdadeProfile',
    path: '/faculdade/:mode',
    component: FaculdadeProfile,
    meta: { faculdadeRestriction: true }
}, {
    name: 'faculdadeProfileAction',
    path: '/faculdade/:mode/:action',
    component: FaculdadeProfile,
    meta: { faculdadeRestriction: true }
}, {
    name: 'vestibulandoProfile',
    path: '/vestibulando/:mode',
    component: VestibulandoProfile,
    meta: { vestibulandoRestriction: true }
}, {
    name: 'vestibulandoProfileAction',
    path: '/vestibulando/:mode/:action',
    component: VestibulandoProfile,
    meta: { vestibulandoRestriction: true }
}, {
    name: 'profileFaculdade',
    path: '/perfil/faculdade/:id',
    component: FaculdadeById,
}, {
    name: 'profileVestibular',
    path: '/perfil/vestibulando/:id',
    component: VestibulandoById,
}, {
    name: 'timeManagementTool',
    path: '/ferramenta-gestao-tempo',
    component: TimeManagementTool,
    meta: { vestibulandoRestriction: true }
}]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)
    const user = JSON.parse(json)

    if(to.matched.some(record => record.meta.faculdadeRestriction)) {
        user && user.isFaculdade ? next() : next({ path: '/vestibulando' })
    } else if(to.matched.some(record => record.meta.vestibulandoRestriction)) {
        user && user.isFaculdade ? next({ path: '/faculdade/perfil' }) : next()
    } else if(to.matched.some(record => record.meta.disconnected)) {
        user ? next({ path: '/' }) : next()
    } else {
        next()
    }
})

export default router