<template>
    <div class="auth">
        <div class="auth-content">

            <div class="auth-title logo-text">
                <i class="fas fa-pen-alt"></i> <span>SharpPen</span>
            </div>

            <p>Faça login para seguir as faculdades que irá prestar o Vestibular e ficar por dentro de tudo!</p>

            <b-col cols="10">
                <input v-model="user.email" name="email" class="data-input" type="text" placeholder="E-mail">
                <input v-model="user.senha" name="senha" class="data-input" type="password" placeholder="Senha">

                <button @click="signin" class="btn-blue-rounded handwriting mt-1 mb-3">Entrar</button>

                <p>
                    Novo no SharpPen? <router-link to="/signup/vestibulando">Cadastre-se</router-link>
                </p>
                <a href>Esqueceu a senha?</a>
            </b-col>

        </div>
    </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from '@/global'
import axios from 'axios'

export default {
    name: 'Auth',
    data: function() {
        return {
            user: {}
        }
    },
    methods: {
        signin() {
            axios.post(`${baseApiUrl}/signin`, this.user)
                .then(res => {
                    this.$store.commit('setUser', res.data)
                    localStorage.setItem(userKey, JSON.stringify(res.data))
                    if(res.data.data_prova) {
                        this.$router.push({ path: '/faculdade/perfil' })
                    } else {
                        this.$router.push({ path: '/' })
                    }
                })
                .catch(showError)
        }
    }
}
</script>

<style>
    .auth {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 0px 30px;
    }

    .auth .auth-content {
        width: 400px;
        font-size: 1.1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .auth .auth-content button {
        font-size: 1.5rem;
        margin-bottom: 15px;
    }

    .auth .auth-title {
        margin-bottom: 15px;
    }
</style>