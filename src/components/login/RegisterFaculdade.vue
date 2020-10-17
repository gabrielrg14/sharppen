<template>
    <div class="signup">
        <div class="signup-content">

            <div class="signup-title logo-text">
                <i class="fas fa-pen-alt"></i> <span>SharpPen</span>
            </div>

            <p>
                Descomplique a vida de seus Vestibulandos com o SharpPen.
                Cadastre sua Faculdade gratuitamente!
            </p>

            <b-col cols="10">
                <input v-model="faculdade.nome" name="nome" class="data-input" type="text" placeholder="Nome da Faculdade">
                <input v-model="faculdade.email" name="email" class="data-input" type="text" placeholder="E-mail Institucional">
                <input v-model="faculdade.data_prova" name="data_prova" class="data-input" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" placeholder="Data da Prova">
                <input v-model="faculdade.endereco" name="endereco" class="data-input" type="text" placeholder="Endereço">
                <input v-model="faculdade.telefone" name="telefone" class="data-input" type="text" placeholder="Telefone">
                <input v-model="faculdade.senha" name="senha" class="data-input" type="password" placeholder="Senha">
                <input v-model="faculdade.confirmacao_senha" name="confirmacao_senha" class="data-input" type="password" placeholder="Confirmação de Senha">

                <button @click="signup" class="btn-blue-rounded handwriting mt-1 mb-3">Cadastrar</button>

                É uma Vestibulando? <router-link to="/signup/vestibulando">Cadastre-se</router-link><br>
                Já possui uma conta? <router-link to="/login">Entre</router-link>
            </b-col>

        </div>
    </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'signupFaculdade',
    data: function() {
        return {
            faculdade: {}
        }
    },
    methods: {
        signup() {
            axios.post(`${baseApiUrl}/signup/faculdade`, this.faculdade)
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