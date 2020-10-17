<template>
    <div class="profile" v-if="dataReady && vestibulando.ativo">

        <div class="left-area">
            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-university"></i> <span>Faculdade(s) seguida(s) pelo Vestibulando:</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyFollowing">
                    <span>Vestibulando ainda não segue nenhuma faculdade!</span>
                </div>

                <div class="side-box-content" v-else v-for="faculdade in following.slice(0, 5)" :key="faculdade.id">
                    <router-link :to="`/perfil/faculdade/${faculdade.id}`">
                        <div v-if="faculdade.path_imagem" class="image-profile">
                            <img :src="getImgUrl(faculdade.path_imagem)" alt="Foto do Perfil">
                        </div>
                        <i v-else class="fas fa-user-circle primary"></i>
                        <span>{{ faculdade.nome }}</span>
                    </router-link>
                </div>
            </div>

            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-calendar-day"></i> <span>Datas de prova das Faculdade(s) seguida(s):</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyFollowing">
                    <span>Vestibulando ainda não segue nenhuma faculdade!</span>
                </div>

                <div class="side-box-content" v-else>
                    <ul>
                        <li v-for="faculdade in following" :key="faculdade.id">{{ faculdade.nome }}: {{ faculdade.data_prova_formatada }}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="main-area">
            <div class="info-box handwriting">
                <div class="info-row">
                    <div v-if="vestibulando.path_imagem" class="image-profile">
                        <img :src="getImgUrl(vestibulando.path_imagem)" alt="Foto do Perfil">
                    </div>
                    <i v-else class="fas fa-user-circle primary profile-image"></i>
                    <span>{{ vestibulando.nome }}</span>
                </div>

                <div class="info-row">
                    <i class="fas fa-envelope primary"></i> <span>{{ vestibulando.email }}</span>
                </div>

                <div class="info-row">
                    <i class="fas fa-birthday-cake primary"></i> <span>{{ vestibulando.data_nascimento_formatada }}</span>
                </div>

                <div class="info-row">
                    <i class="fas fa-graduation-cap primary"></i> <span>{{ vestibulando.curso }}</span>
                </div>
            </div>
        </div>

        <div class="right-area">
            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-calendar-week"></i> <span>Rotina de estudos do Vestibulando:</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyRoutine">
                    <span>Vestibulando ainda não registrou uma rotina de estudos!</span>
                </div>

                <div class="side-box-content" v-else>
                    <ul>
                        <li>Segunda-feira: {{ routine.segunda_feira }}</li>
                        <li>Terça-feira: {{ routine.terca_feira }}</li>
                        <li>Quarta-feira: {{ routine.quarta_feira }}</li>
                        <li>Quinta-feira: {{ routine.quinta_feira }}</li>
                        <li>Sexta-feira: {{ routine.sexta_feira }}</li>
                        <li>Sábado: {{ routine.sabado }}</li>
                        <li>Domingo: {{ routine.domingo }}</li>
                    </ul>
                </div>
            </div>

            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-book-open"></i> <span>Livros requisitados pelas faculdades seguidas:</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyFollowing">
                    <span>Vestibulando ainda não segue nenhuma faculdade!</span>
                </div>

                <div class="side-box-content text-center" v-else-if="emptyBooks">
                    <span>Nenhum livro foi solicitado pelas faculdades seguidas!</span>
                </div>

                <div class="side-box-content" v-else>
                    <ul>
                        <span v-for="faculdadeBooks in books" :key="faculdadeBooks.id">
                            <li v-for="book in faculdadeBooks" :key="book.id">{{ book.nome_faculdade }}: {{ book.nome_livro }} - {{ book.autor_livro }}</li>
                        </span>
                    </ul>
                </div>
            </div>
        </div>

    </div>

    <div v-else class="account-disabled">
        Essa conta foi desativada!
    </div>
</template>

<script>
import axios from 'axios'
import { mapState } from "vuex"

import { baseApiUrl, showError } from '@/global'

export default {
    name: 'profileVestibulando',
    computed: mapState(['user']),
    data: function() {
        return {
            dataReady: false,
            vestibulandoId: null,
            vestibulando: {},
            emptyFollowing: true,
            following: [],
            emptyRoutine: true,
            routine: {},
            emptyBooks: true,
            books: {}
        }
    },
    methods: {
        setVestibulandoId() {
            this.vestibulandoId = this.$route.params.id
        },
        loadVestibulando() {
            axios.get(`${baseApiUrl}/vestibulando/${this.vestibulandoId}`)
                .then(res => {
                    this.vestibulando = res.data
                })
                .catch(showError)
        },
        getImgUrl(path) {
            return require('../../assets/' + path)
        },
        loadFollowing() {
            axios.get(`${baseApiUrl}/vestibulando_faculdade/following/${this.vestibulandoId}`)
                .then(res => {
                    if(res.data[0].length == 0) {
                        this.emptyFollowing = true
                    } else {
                        this.emptyFollowing = false
                        this.following = res.data
                    }
                })
                .catch(showError)
        },
        loadRoutine() {
            axios.get(`${baseApiUrl}/vestibulando_rotina/vestibulando/${this.vestibulandoId}`)
                .then(res => {
                    if(res.data.length == 0) {
                        this.emptyRoutine = true
                    } else {
                        this.emptyRoutine = false
                        this.routine = res.data
                    }
                })
                .catch(showError)
        },
        loadBooks() {
            axios.get(`${baseApiUrl}/faculdade_livro/vestibulando/${this.vestibulandoId}`)
                .then(res => {
                    if(res.data[0].length == 0) {
                        this.emptyBooks = true
                    } else {
                        this.emptyBooks = false
                        this.books = res.data
                    }
                })
                .catch(showError)
        },
    },
    created() {
        this.setVestibulandoId()
    },
    mounted() {
        this.loadVestibulando()
        this.loadFollowing()
        this.loadRoutine()
        this.loadBooks()
        this.dataReady = true
    }
}
</script>

<style>

</style>