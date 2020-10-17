<template>
    <div class="signup">
        <div class="signup-content">

            <div class="signup-title logo-text">
                <i class="fas fa-pen-alt"></i> <span>SharpPen</span>
            </div>

            <p>
                Organize sua vida acadêmica com o SharpPen.<br>
                Cadastre-se gratuitamente!
            </p>

            <b-col cols="10">
                <input v-model="vestibulando.nome" name="nome" class="data-input" type="text" placeholder="Nome Completo">
                <input v-model="vestibulando.data_nascimento" name="data_nascimento" class="data-input" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" placeholder="Data de Nascimento">
                <input v-model="vestibulando.curso" name="curso" class="data-input" type="text" placeholder="Curso desejado">
                <input v-model="vestibulando.email" name="email" class="data-input" type="text" placeholder="E-mail">
                <input v-model="vestibulando.senha" name="senha" class="data-input" type="password" placeholder="Senha">
                <input v-model="vestibulando.confirmacao_senha" name="confirmacao_senha" class="data-input" type="password" placeholder="Confirmação de Senha">

                <button @click="signup" class="btn-blue-rounded handwriting mt-1 mb-3">Cadastrar</button>

                É uma Faculdade? <router-link to="/signup/faculdade">Cadastre-se</router-link><br>
                Já possui uma conta? <router-link to="/login">Entre</router-link>
            </b-col>

        </div>
    </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'signupVestibulando',
    data: function() {
        return {
            vestibulando: {}
        }
    },
    methods: {
        signup() {
            axios.post(`${baseApiUrl}/signup/vestibulando`, this.vestibulando)
                .then(() => {
                    this.$router.push({ path: '/login' })
                    this.$toasted.global.defaultSuccess({ msg: 'Conta cadastrada!' })
                })
                .catch(showError)
        },
    }
}
</script>

<style scoped>
    .signup {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 0px 30px;
    }

    .signup .signup-content {
        width: 400px;
        font-size: 1.1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .signup .signup-content button {
        font-size: 1.5rem;
        margin-bottom: 15px;
    }

    .signup .signup-title {
        margin-bottom: 15px;
    }
</style>