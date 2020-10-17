<template>
    <header v-if="!hideHeader" class="header">
        <h1 class="logo">
            <router-link to="/" class="handwriting">
                <i class="fas fa-pen-alt"></i> <span class="d-none d-sm-inline-block">SharpPen</span>
            </router-link>
        </h1>

        <div class="search-bar">
            <div class="input-search-bar handwriting">
                <input type="text" placeholder="Buscar..." v-model="textSearch" v-on:input="searchBD">
                <router-link :to="`/buscar/${textSearch}`">
                    <i class="fa fa-search fa-lg"></i>
                </router-link>
            </div>

            <div id="result-options" class="search-result" v-show="textSearch">
                <div class="search-result-content">
                    <b>Faculdades:</b>
                    <p v-if="emptyFaculdades">Nenhuma faculdade encontrada!</p>

                    <span v-else class="d-block" v-for="faculdade in faculdadesResult" :key="faculdade.id">
                        <router-link :to="`/perfil/faculdade/${faculdade.id}`">
                            {{ faculdade.nome }}
                        </router-link>
                    </span>
                    
                    <br v-if="!emptyFaculdades || !emptyVestibulandos">

                    <b>Vestibulandos:</b>
                    <p v-if="emptyVestibulandos">Nenhum vestibulando encontrado!</p>

                    <span v-else class="d-block" v-for="vestibulando in vestibulandosResult" :key="vestibulando.id">
                        <router-link :to="`/perfil/vestibulando/${vestibulando.id}`">
                            {{ vestibulando.nome }}
                        </router-link>
                    </span>
                </div>
            </div>
        </div>

        <div class="right-icons">
            <router-link :to="setRoute('option-1')">
                <i :class="{'fas fa-graduation-cap': user.isFaculdade, 'fas fa-stopwatch': !user.isFaculdade}"></i>
            </router-link>

            <router-link :to="setRoute('option-2')">
                <i :class="{'fas fa-paragraph': user.isFaculdade, 'fas fa-book-open': !user.isFaculdade}"></i>
            </router-link>

            <router-link :to="setRoute('option-3')">
                <i :class="{'fas fa-book': user.isFaculdade, 'fas fa-calendar-week': !user.isFaculdade}"></i>
            </router-link>

            <div class="user-option">
                <div v-if="user.path_imagem">
                    <img :src="getImgUrl(user.path_imagem)" alt="Foto do Perfil">
                </div>
                <i v-else class="fas fa-user-circle"></i>
                <i class="fas fa-caret-down arrow-icon"></i>
            </div>

            <div class="user-dropdown">
                <div class="user-dropdown-content">
                    <span class="d-block">Olá, {{ user.nome }}</span>
                    
                    <router-link :to="setRoute('option-4')">
                        <i class="fas fa-user"></i> Perfil
                    </router-link>

                    <router-link :to="setRoute('option-5')">
                        <i class="fas fa-pen-alt"></i> Editar conta
                    </router-link>

                    <router-link :to="setRoute('option-6')">
                        <i class="fas fa-user-lock"></i> Privacidade
                    </router-link>

                    <router-link :to="setRoute('option-7')">
                        <i class="fas fa-key"></i> Alterar senha
                    </router-link>
                    
                    <a v-b-modal="'confirm-logout'"><i class="fas fa-sign-out-alt"></i> Sair</a>

                    <b-modal id="confirm-logout" size="sm">
                        <template v-slot:modal-title>
                            Por favor, confirme esta ação...
                        </template>
                        <span class="d-block text-center">
                            Deseja mesmo <b>sair</b> de sua conta SharpPen?<br><br>
                            Ao fazer isto, você será redirecionado para a página de Login!
                        </span>
                        <template v-slot:modal-footer>
                            <b-button block pill variant="success" @click="logout">Confirmar</b-button>
                            <b-button block class="mt-2" pill variant="outline-secondary" @click="$bvModal.hide('confirm-logout')">Cancelar</b-button>
                        </template>
                    </b-modal>
                </div>
            </div>

        </div>
    </header>
</template>

<script>
import axios from 'axios'
import { mapState } from "vuex"

import { baseApiUrl, showError, userKey } from '@/global'

export default {
    name: 'Header',
    props: {
        hideHeader: Boolean,
    },
    computed: mapState(['user']),
    data: function() {
        return {
            textSearch: "",
            emptyFaculdades: true,
            faculdadesResult: [],
            emptyVestibulandos: true,
            vestibulandosResult: []
        }
    },
    methods: {
        setRoute(route) {
            switch (route) {
                case "option-1":
                    if(this.user.isFaculdade) {
                        return '/faculdade/cursos';
                    } else {
                        return '/ferramenta-gestao-tempo';
                    }

                case "option-2":
                    if(this.user.isFaculdade) {
                        return '/faculdade/postagens';
                    } else {
                        return '/vestibulando/livros';
                    }

                case "option-3":
                    if(this.user.isFaculdade) {
                        return '/faculdade/livros';
                    } else {
                        return '/vestibulando/rotina';
                    }

                case "option-4":
                    if(this.user.isFaculdade) {
                        return '/faculdade/perfil';
                    } else {
                        return '/vestibulando/perfil';
                    }

                case "option-5":
                    if(this.user.isFaculdade) {
                        return '/faculdade/perfil/editar';
                    } else {
                        return '/vestibulando/perfil/editar';
                    }

                case "option-6":
                    if(this.user.isFaculdade) {
                        return '/faculdade/perfil/privacidade';
                    } else {
                        return '/vestibulando/perfil/privacidade';
                    }

                case "option-7":
                    if(this.user.isFaculdade) {
                        return '/faculdade/perfil/senha';
                    } else {
                        return '/vestibulando/perfil/senha';
                    }
            }
        },
        getImgUrl(path) {
            return require('../../assets/' + path)
        },
        showResultOptions() {
            var divResult = document.getElementById("result-options")
            divResult.style.display = "block"
        },
        hideResultOptions(e) {
            var divResult = document.getElementById("result-options")
            if(e.path[2].className == "search-bar") {
                divResult.style.display = "block"
            } else {
                divResult.style.display = "none"
            }
        },
        searchBD() {
            let search = {}
            search.textSearch = this.textSearch
            axios.post(`${baseApiUrl}/vestibulando_faculdade/search`, search)
                .then(res => {
                    if(res.data.faculdades.length == 0) {
                        this.emptyFaculdades = true
                    } else {
                        this.emptyFaculdades = false
                        this.faculdadesResult = res.data.faculdades
                    }

                    if(res.data.vestibulandos.length == 0) {
                        this.emptyVestibulandos = true
                    } else {
                        this.emptyVestibulandos = false
                        this.vestibulandosResult = res.data.vestibulandos
                    }
                })
                .catch(showError)
            this.showResultOptions()
        },
        logout() {
            localStorage.removeItem(userKey)
            this.$store.commit('setUser', null)
            this.$router.push({ name: 'auth' })
        },
    },
    watch: {
        $route() {
            this.textSearch = ""
        }
    },
    created() {
        var elementos = document.getElementsByTagName('html');
        var tagHtml = elementos[0]
        tagHtml.addEventListener('click', this.hideResultOptions, HTMLHtmlElement)
    }
}
</script>

<style>
    .header {
        background-color: #3A65DB;
        height: 60px;
        align-items: center;

        display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		grid-template-areas:
			"logo search-bar right-icons";
    }

    @media (max-width: 768px) {
        .header {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-areas:
                "logo search-bar right-icons";
        }
    }

    .header .logo {
        grid-area: logo;

        display: flex;
        justify-content: center;
        align-items: center;
        
        margin: auto;
        font-size: 1.5rem;
        color: #fff;
        font-weight: 600;
    }

    .header .logo span {
        font-size: 1.8rem;
    }

    .header .logo a {
        color: #FFF;
        text-decoration: none;
    }

    .header .logo a:hover {
        color: #FFF;
        text-decoration: none;
    }

    .header i {
        color: #FFF;
        font-size: 1.5rem;
    }

    .header .search-bar {
        grid-area: search-bar;
        background-color: #FFF;

        padding: 0px 5px 0 5px;
    }

    .header .search-bar .input-search-bar {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .header .search-bar .input-search-bar input {
        font-size: 1.3rem;
        border: 0;
        outline: 0;
        width: 100%;
        background: #FFF;
    }

    .header .search-bar .input-search-bar i {
        color: #3A65DB;
        margin-top: 5px;
    }

    .header .right-icons {
        grid-area: right-icons;
        
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header .right-icons a {
        margin-left: 30px;
    }

    .header .right-icons .user-option {
        display: flex;
        align-self: flex-start;

        margin-left: 30px;
        margin-right: 30px;
        cursor: pointer;
    }

    @media (max-width: 450px) {
        .header .right-icons a {
            margin-left: 15px;
        }

        .header .right-icons .user-option {
            margin-left: 15px;
            margin-right: 15px;
        }

    }

    .header .search-result {
        position: relative;
        height: 100%;
        width: 100%;
    }

    .header .search-result-content {
        position: absolute;
        background-color: #FAFAFA;
        border: 1px solid rgba(0, 0, 0, 0.2);
        margin-top: 5px;
        padding: 15px;
        z-index: 1;

        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        transition: visibility 0s, opacity 0.5s linear;
    }

    .header .search-result-content a {
        text-decoration: none;
        color: #332A2A;
        padding: 5px 5px;
    }

    .header .search-result-content span {
        text-decoration: none;
        padding: 5px 0px;
        width: 100%;
    }

    .header .search-result-content span:hover {
        text-decoration: none;
        background-color: #EDEDED;
    }

    .header .right-icons .user-option img {
        height: 30px;
        width: 30px;
        border-radius: 50%;
    }

    .header .right-icons .user-option .arrow-icon {
        margin-left: 5px;
    }

    .header .right-icons .user-dropdown {
        position: relative;
        height: 100%;
    }

    .header .right-icons .user-dropdown-content {
        position: absolute;
        right: 0px;
        background-color: #f9f9f9;
        min-width: 170px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        margin-top: 10px;
        z-index: 1;

        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;

        visibility: hidden;
        opacity: 0;
        transition: visibility 0s, opacity 0.5s linear;
    }

    .header .right-icons .user-option:hover ~ .user-dropdown .user-dropdown-content,
    .header .right-icons .user-dropdown .user-dropdown-content:hover {
        visibility: visible;
        opacity: 1;
    }

    .header .right-icons .user-dropdown .user-dropdown-content span {
        padding: 10px 20px 5px 20px;
    }

    .header .right-icons .user-dropdown .user-dropdown-content i {
        color: #000;
        margin-right: 5px;
    }

    .header .right-icons .user-dropdown .user-dropdown-content a {
        text-decoration: none;
        color: #000;
        padding: 10px 20px 10px 20px;
        margin-right: 0px;
        margin-left: 0px;
    }

    .header .right-icons .user-dropdown .user-dropdown-content a:hover {
        text-decoration: none;
        color: #000;
        background-color: #EDEDED;
    }
</style>
