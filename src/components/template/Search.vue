<template>
    <div class="search">
        <div class="search-result-content">
            <p>Resultado da busca por: "<b>{{ textSearch }}</b>"</p>

            <b class="centralize-in-box">Faculdades:</b>
            <div class="info-box" v-if="emptyFaculdades">
                <p class="centralize-in-box">Nenhuma faculdade encontrada!</p>
            </div>

            <div class="info-box result" v-else>
                <span v-for="faculdade in faculdadesResult" :key="faculdade.id">
                    <router-link :to="`/perfil/faculdade/${faculdade.id}`">
                        <div class="info-row"> 
                            <div v-if="faculdade.path_imagem" class="image-profile">
                                <img :src="getImgUrl(faculdade.path_imagem)" alt="Foto do Perfil">
                            </div>
                            <i v-else class="fas fa-user-circle primary profile-image"></i>
                            <div class="text-data">
                                <span>{{ faculdade.nome }}</span>
                                <span><i class="fas fa-calendar-day primary"></i> {{ faculdade.data_prova_formatada }}</span>
                            </div>
                        </div>
                    </router-link>
                </span>
            </div>

            <b class="centralize-in-box">Vestibulandos:</b>
            <div class="info-box" v-if="emptyVestibulandos">
                <p class="centralize-in-box">Nenhum vestibulando encontrado!</p>
            </div>

            <div class="info-box result" v-else>
                <span v-for="vestibulando in vestibulandosResult" :key="vestibulando.id">
                    <router-link :to="`/perfil/vestibulando/${vestibulando.id}`">
                        <div class="info-row">
                            <div v-if="vestibulando.path_imagem" class="image-profile">
                                <img :src="getImgUrl(vestibulando.path_imagem)" alt="Foto do Perfil">
                            </div>
                            <i v-else class="fas fa-user-circle primary profile-image"></i>
                            <div class="text-data">
                                <span>{{ vestibulando.nome }}</span>
                                <span><i class="fas fa-birthday-cake primary"></i> {{ vestibulando.data_nascimento_formatada }}</span>
                            </div>
                        </div>
                    </router-link>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import { baseApiUrl, showError } from '@/global'

export default {
    name: 'Search',
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
        searchBD() {
            this.textSearch = this.$route.params.textSearch
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
        },
        getImgUrl(path) {
            return require('../../assets/' + path)
        },
    },
    watch: {
        $route(to) {
            if(to.params.textSearch) {
                this.searchBD()
            }
        }
    },
    mounted() {
        this.searchBD()
    }
}
</script>

<style>
    .search {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .search .search-result-content .centralize-in-box {
        display: flex;
        justify-content: center;
    }

    .search .search-result-content b.centralize-in-box {
        border: 1px solid rgba(0, 0, 0, 0.2);
        background-color: #3A65DB;
        color: #FFF;
        text-shadow: 0px 1px #332A2A;
    }

    .search .search-result-content .info-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        
        background-color: #FAFAFA;
        padding: 30px;
        margin-bottom: 30px;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .search .search-result-content .info-box.result {
        padding: 0px
    }

    .search .search-result-content .info-box .info-row {
        display: flex;
        flex-direction: row;
    }

    .search .search-result-content .info-box .text-data {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .search .search-result-content .info-box i.profile-image {
        font-size: 3rem;
        margin-right: 15px;
    }

    .search .search-result-content .info-box a {
        text-decoration: none;
        color: #332A2A;
        padding: 5px 5px;
    }

    .search .search-result-content .info-box span {
        text-decoration: none;
        padding: 0px 15px;
        width: 100%;
    }

    .search .search-result-content .info-box span:hover {
        text-decoration: none;
        background-color: #EDEDED;
    }
</style>