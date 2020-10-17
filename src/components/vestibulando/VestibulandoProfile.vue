<template>
    <div class="profile" v-if="dataReady">

        <div class="left-area">
            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-university"></i> <span>Faculdades seguidas:</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyFollowing">
                    <span>Você ainda não segue nenhuma faculdade!</span>
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

                <button class="btn-blue-rounded mt-3" v-b-modal="`view-all-following`" v-if="!emptyFollowing">Visualizar tudo</button>

                <b-modal :id="`view-all-following`" size="sm">
                    <template v-slot:modal-title>
                        <i class="fas fa-university"></i> Faculdades que você segue:
                    </template>

                    <div class="side-box-content text-center" v-if="emptyFollowing">
                        <span>Você ainda não segue nenhuma faculdade!</span>
                    </div>

                    <span v-else class="d-block row-perfis" v-for="faculdade in following" :key="faculdade.id">
                        <router-link :to="`/perfil/faculdade/${faculdade.id}`">
                            <div v-if="faculdade.path_imagem" class="image-profile">
                                <img :src="getImgUrl(faculdade.path_imagem)" alt="Foto do Perfil">
                            </div>
                            <i v-else class="fas fa-user-circle primary"></i>
                            <span>{{ faculdade.nome }}</span>
                        </router-link>
                    </span>
                    <template v-slot:modal-footer>
                        <b-button block class="mt-2" pill variant="success" @click="$bvModal.hide(`view-all-following`)">Fechar</b-button>
                    </template>
                </b-modal>
            </div>

            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-calendar-day"></i> <span>Datas de prova das Faculdade(s) seguida(s):</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyFollowing">
                    <span>Você ainda não segue nenhuma faculdade!</span>
                </div>

                <div class="side-box-content" v-else>
                    <ul>
                        <li v-for="faculdade in following" :key="faculdade.id">{{ faculdade.nome }}: {{ faculdade.data_prova_formatada }}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="main-area">

            <!-- Mode view Profile -->
            <div v-if="mode === 'viewProfile'">
                <div class="info-box handwriting">
                    <div class="info-row">
                        <div v-if="vestibulando.path_imagem" class="image-profile">
                            <img :src="getImgUrl(vestibulando.path_imagem)" alt="Foto do Perfil">
                        </div>
                        <i v-else class="fas fa-user-circle primary profile-image"></i>
                        <span>{{ vestibulando.nome }}</span> 
                        <i @click="editProfile" class="fas fa-pen-alt icon-action"></i>
                        <i @click="changeMode('perfil', 'privacidade')" class="fas fa-user-lock icon-action"></i>
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

            <!-- Mode Edit Profile -->
            <div v-if="mode === 'editProfile'" class="custom-main-area">
                <div class="info-box">
                    <form @submit.prevent="updateProfile" enctype="multipart/form-data">
                        <div class="info-row upload">
                            <div v-if="vestibulando.path_imagem" class="image-profile">
                                <img :src="getImgUrl(vestibulando.path_imagem)" alt="Foto do Perfil">
                            </div>
                            <i v-else class="fas fa-user-circle primary profile-image"></i>
                            <label for="select-file" class="input-file-label">Procurar...</label>
                            <input type="file" ref="file" name="file" id="select-file" class="upload-image" @change="onSelectImage">
                            <span id="file-name">Nenhum arquivo selecionado</span>
                        </div>

                        <input v-model="vestibulandoEdit.nome" name="nome" class="data-input" type="text" placeholder="Nome Completo">
                        <input v-model="vestibulandoEdit.email" name="email" class="data-input" type="text" placeholder="E-mail">
                        <input v-model="vestibulandoEdit.data_nascimento" name="data_nascimento" class="data-input" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" placeholder="Data de Nascimento">
                        <input v-model="vestibulandoEdit.curso" name="curso" class="data-input" type="text" placeholder="Curso desejado">

                        <button type="submit" class="btn-blue-rounded handwriting mt-2 mb-3">Salvar</button>
                    </form>

                    <button class="btn-transparent-rounded handwriting" @click="reset('perfil')">Cancelar</button>
                </div>

                <button class="btn-blue-rounded handwriting mb-3" @click="changeMode('perfil', 'senha')">Alterar minha senha</button>
            </div>

            <!-- Mode User Privacy -->
            <div v-if="mode === 'userPrivacy'" class="custom-main-area">
                <div class="info-box box-centered">

                    <div class="user-privacy" v-if="vestibulando.ativo">
                        <i class="fas fa-check-circle primary mb-2"></i><h3>Sua conta está ativa!</h3>
                        <button class="btn-blue-rounded handwriting mt-2 mb-3" v-b-modal="'confirm-deactivate-account'">Desativar conta</button>

                        <b-modal id="confirm-deactivate-account" size="sm">
                            <template v-slot:modal-title>
                                <i class="fas fa-exclamation-triangle"></i> Por favor, confirme esta ação...
                            </template>
                            <span class="d-block text-center">
                                Deseja mesmo <b>desativar</b> sua <b>conta?</b><br><br>
                                Ao fazer isto, seu perfil deixará de ser exibido aos outros usuários.
                            </span>
                            <template v-slot:modal-footer>
                                <b-button block pill variant="danger" @click="deactivateAccount">Confirmar</b-button>
                                <b-button block class="mt-2" pill variant="outline-secondary" @click="$bvModal.hide('confirm-deactivate-account')">Cancelar</b-button>
                            </template>
                        </b-modal>
                    </div>

                    <div class="user-privacy" v-else>
                        <i class="fas fa-power-off primary mb-2"></i><h3>Sua conta está desativada!</h3>
                        <button class="btn-blue-rounded handwriting mt-2 mb-3" v-b-modal="'confirm-reactivate-account'">Reativar conta</button>

                        <b-modal id="confirm-reactivate-account" size="sm">
                            <template v-slot:modal-title>
                                Por favor, confirme esta ação...
                            </template>
                            <span class="d-block text-center">
                                Deseja mesmo <b>reativar</b> a sua conta?<br><br>
                                Ao fazer isto, seu perfil poderá ser exibido novamente aos outros usuários.
                            </span>
                            <template v-slot:modal-footer>
                                <b-button block pill variant="success" @click="reactivateAccount">Confirmar</b-button>
                                <b-button block class="mt-2" pill variant="outline-secondary" @click="$bvModal.hide('confirm-reactivate-account')">Cancelar</b-button>
                            </template>
                        </b-modal>
                    </div>

                    <button class="btn-transparent-rounded handwriting" @click="reset('perfil')">Voltar</button>
                </div>
            </div>

            <!-- Mode Edit Password -->
            <div v-if="mode === 'editPassword'" class="custom-main-area">
                <div class="info-box box-centered">

                    <h3 class="box-title">Alteração de Senha</h3>

                    <input v-model="editPassword.senha_atual" name="senha_atual" class="data-input" type="password" placeholder="Senha atual">
                    <input v-model="editPassword.senha" name="senha" class="data-input" type="password" placeholder="Nova senha">
                    <input v-model="editPassword.confirmacao_senha" name="confirmacao_senha" class="data-input" type="password" placeholder="Confirmação da Nova Senha">

                    <button class="btn-blue-rounded handwriting mt-2 mb-3" @click="updatePassword">Salvar</button>
                    <button class="btn-transparent-rounded handwriting" @click="reset('perfil', 'editar')">Cancelar</button>
                </div>
            </div>

            <!-- Mode View Routine -->
            <div v-if="mode === 'viewRoutine'" class="custom-main-area">
                <div class="info-box box-centered" v-if="emptyRoutine">
                    <h3 class="box-title">Rotina de Estudos - {{ vestibulando.nome }}</h3>

                    <p>Você ainda não registrou uma rotina de estudos!</p>

                    <button class="btn-blue-rounded handwriting mt-2 mb-3" @click="changeMode('rotina', 'nova')">Cadastrar rotina</button>
                    <button class="btn-transparent-rounded handwriting" @click="reset('perfil')">Voltar</button>
                </div>

                <div class="info-box box-centered" v-else>
                    <h3 class="box-title">Rotina de Estudos - {{ vestibulando.nome }} <i v-b-modal="`confirm-del-routine-${routine.id}`" class="fas fa-trash-alt icon-action delete-icon"></i></h3>

                    <b-modal :id="`confirm-del-routine-${routine.id}`" size="sm">
                        <template v-slot:modal-title>
                            <i class="fas fa-exclamation-triangle"></i> Por favor, confirme esta ação...
                        </template>
                        <span class="d-block text-center">Deseja mesmo <b>excluir</b> sua <b>Rotina de Estudos</b>, {{ vestibulando.nome }}?</span>
                        <template v-slot:modal-footer>
                            <b-button block pill variant="danger" @click="deleteRoutine(routine.id)">Excluir</b-button>
                            <b-button block class="mt-2" pill variant="outline-secondary" @click="$bvModal.hide(`confirm-del-routine-${routine.id}`)">Cancelar</b-button>
                        </template>
                    </b-modal>

                    <ul class="text-left">
                        <li>Segunda-feira: {{ routine.segunda_feira }}</li>
                        <li>Terça-feira: {{ routine.terca_feira }}</li>
                        <li>Quarta-feira: {{ routine.quarta_feira }}</li>
                        <li>Quinta-feira: {{ routine.quinta_feira }}</li>
                        <li>Sexta-feira: {{ routine.sexta_feira }}</li>
                        <li>Sábado: {{ routine.sabado }}</li>
                        <li>Domingo: {{ routine.domingo }}</li>
                    </ul>

                    <button class="btn-blue-rounded handwriting mt-2 mb-3" @click="getRoutine(routine.id)">Editar rotina</button>
                    <button class="btn-transparent-rounded handwriting" @click="reset('perfil')">Voltar</button>
                </div>
            </div>

            <!-- Mode New Routine -->
            <div v-if="mode === 'newRoutine'" class="custom-main-area">
                <div class="info-box box-centered">

                    <h3 class="box-title">Cadastro de Rotina de Estudos</h3>

                    <input v-model="routineEdit.segunda_feira" name="segunda_feira" class="data-input" type="text" placeholder="Segunda-feira">
                    <input v-model="routineEdit.terca_feira" name="terca_feira" class="data-input" type="text" placeholder="Terça-feira">
                    <input v-model="routineEdit.quarta_feira" name="quarta_feira" class="data-input" type="text" placeholder="Quarta-feira">
                    <input v-model="routineEdit.quinta_feira" name="quinta_feira" class="data-input" type="text" placeholder="Quinta-feira">
                    <input v-model="routineEdit.sexta_feira" name="sexta_feira" class="data-input" type="text" placeholder="Sexta-feira">
                    <input v-model="routineEdit.sabado" name="sabado" class="data-input" type="text" placeholder="Sábado">
                    <input v-model="routineEdit.domingo" name="domingo" class="data-input" type="text" placeholder="Domingo">

                    <button class="btn-blue-rounded handwriting mt-2 mb-3" @click="registerRoutine">Cadastrar</button>
                    <button class="btn-transparent-rounded handwriting" @click="reset('rotina')">Cancelar</button>
                </div>
            </div>

            <!-- Mode Edit Routine -->
            <div v-if="mode === 'editRoutine'" class="custom-main-area">
                <div class="info-box box-centered">

                    <h3 class="box-title">Editar Rotina de Estudos</h3>

                    <input v-model="routineEdit.segunda_feira" name="segunda_feira" class="data-input" type="text" placeholder="Segunda-feira">
                    <input v-model="routineEdit.terca_feira" name="terca_feira" class="data-input" type="text" placeholder="Terça-feira">
                    <input v-model="routineEdit.quarta_feira" name="quarta_feira" class="data-input" type="text" placeholder="Quarta-feira">
                    <input v-model="routineEdit.quinta_feira" name="quinta_feira" class="data-input" type="text" placeholder="Quinta-feira">
                    <input v-model="routineEdit.sexta_feira" name="sexta_feira" class="data-input" type="text" placeholder="Sexta-feira">
                    <input v-model="routineEdit.sabado" name="sabado" class="data-input" type="text" placeholder="Sábado">
                    <input v-model="routineEdit.domingo" name="domingo" class="data-input" type="text" placeholder="Domingo">

                    <button class="btn-blue-rounded handwriting mt-2 mb-3" @click="updateRoutine">Salvar</button>
                    <button class="btn-transparent-rounded handwriting" @click="reset('rotina')">Cancelar</button>
                </div>
            </div>

            <!-- Mode View Books -->
            <div v-if="mode === 'viewBooks'" class="custom-main-area">
                <div class="info-box box-centered">
                    <h3 class="box-title">Livros Requisitados pelas Faculdades seguidas</h3>

                    <p v-if="emptyFollowing">
                        <span>Você ainda não segue nenhuma faculdade!</span>
                    </p>

                    <p v-else-if="emptyBooks">
                        Nenhum livro requisitado pelas faculdades seguidas!
                    </p>

                    <ul v-else class="text-left">
                        <span v-for="faculdadeBooks in books" :key="faculdadeBooks.id">
                            <li v-for="book in faculdadeBooks" :key="book.id">{{ book.nome_faculdade }}: {{ book.nome_livro }} - {{ book.autor_livro }}</li>
                        </span>
                    </ul>
                    <button class="btn-transparent-rounded handwriting" @click="reset('perfil')">Voltar</button>
                </div>
            </div>
        </div>

        <div class="right-area">
            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-calendar-week"></i> <span>Sua rotina de estudos:</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyRoutine">
                    <span>Você ainda não registrou uma rotina de estudos!</span>
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

                <button class="btn-blue-rounded mt-3" @click="changeMode('rotina')">Gerenciar Rotina</button>
            </div>

            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-book-open"></i> <span>Livros requisitados pelas faculdades seguidas:</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyFollowing">
                    <span>Você ainda não segue nenhuma faculdade!</span>
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

                <button class="btn-blue-rounded mt-3" @click="changeMode('livros')" v-if="!emptyFollowing && !emptyBooks">Visualizar livros</button>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios'
import { mapState } from "vuex"

import { baseApiUrl, showError, userKey } from '@/global'

export default {
    name: 'VestibulandoProfile',
    computed: mapState(['user']),
    data: function() {
        return {
            dataReady: false,
            mode: 'viewProfile',
            userId: null,
            vestibulando: {},
            vestibulandoEdit: {},
            file: null,
            editPassword: {},
            emptyFollowing: true,
            following: [],
            emptyRoutine: true,
            routine: {},
            routineEdit: {},
            emptyBooks: true,
            books: {}
        }
    },
    methods: {
        setUserId() {
            const json = localStorage.getItem(userKey)
            const userData = JSON.parse(json)
            this.userId = userData.id
            this.$store.commit('setUser', userData)
        },
        setMode(mode, action) {
            if(mode) {
                if(action) {
                    if(mode == "perfil" && action == "editar") {
                        this.mode = "editProfile"
                        this.editProfile()
                    } else if(mode == "rotina" && action == "editar") {
                        this.mode = "editRoutine"
                    } else if(mode == "perfil" && action == "privacidade") {
                        this.mode = "userPrivacy"
                    } else if(mode == "perfil" && action == "senha") {
                        this.mode = "editPassword"
                    } else if(mode == "rotina" && action == "nova") {
                        this.mode = "newRoutine"
                    }
                } else {
                    if(mode == "perfil") {
                        this.mode = "viewProfile"
                    } else if(mode == "rotina") {
                        this.mode = "viewRoutine"
                    } else if(mode == "livros") {
                        this.mode = "viewBooks"
                    }
                }
            }
        },
        loadVestibulando() {
            axios.get(`${baseApiUrl}/vestibulando/${this.userId}`)
                .then(res => {
                    this.vestibulando = res.data
                })
                .catch(showError)
        },
        loadFollowing() {
            axios.get(`${baseApiUrl}/vestibulando_faculdade/following/${this.userId}`)
                .then(res => {
                    if(res.data.length == 0) {
                        this.emptyFollowing = true
                    } else {
                        this.emptyFollowing = false
                        this.following = res.data
                    }
                })
                .catch(showError)
        },
        loadRoutine() {
            axios.get(`${baseApiUrl}/vestibulando_rotina/vestibulando/${this.userId}`)
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
            axios.get(`${baseApiUrl}/faculdade_livro/vestibulando/${this.userId}`)
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
        editProfile() {
            axios.get(`${baseApiUrl}/vestibulando/${this.userId}`)
                .then(res => {
                    this.vestibulandoEdit = res.data
                })
                .catch(showError)
            this.changeMode('perfil', 'editar')
        },
        getImgUrl(path) {
            return require('../../assets/' + path)
        },
        onSelectImage() {
            var selectFile= document.getElementById('select-file').value
            var fileName = document.getElementById('file-name')
            fileName.textContent = selectFile

            const file = this.$refs.file.files[0]
            this.file = file
        },
        updateProfile() {
            if(this.file) {
                const formData = new FormData()
                formData.append('file', this.file)
                axios.post(`${baseApiUrl}/upload/vestibulando/${this.vestibulandoEdit.id}`, formData)
            }

            axios.put(`${baseApiUrl}/vestibulando/${this.vestibulandoEdit.id}`, this.vestibulandoEdit)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Perfil editado com sucesso!' })
                    this.reset('perfil')
                })
                .catch(showError)
        },
        updatePassword() {
            axios.patch(`${baseApiUrl}/vestibulando/${this.userId}`, this.editPassword)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Senha atualizada!' })
                    this.reset('perfil', 'editar')
                })
                .catch(showError)
        },
        deactivateAccount() {
            axios.post(`${baseApiUrl}/vestibulando/deactivate/${this.userId}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Sua conta foi desativada!' })
                    this.reset('perfil', 'privacidade')
                })
                .catch(showError)
            this.$bvModal.hide('confirm-deactivate-account')
        },
        reactivateAccount() {
            axios.post(`${baseApiUrl}/vestibulando/reactivate/${this.userId}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Sua conta foi reativada!' })
                    this.reset('perfil', 'privacidade')
                })
                .catch(showError)
            this.$bvModal.hide('confirm-reactivate-account')
        },
        registerRoutine() {
            axios.post(`${baseApiUrl}/vestibulando_rotina/${this.userId}`, this.routineEdit)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Rotina cadastrada com sucesso!' })
                    this.reset('rotina')
                })
                .catch(showError)
        },
        getRoutine(id) {
            axios.get(`${baseApiUrl}/vestibulando_rotina/${id}`)
                .then(res => {
                    this.routineEdit = res.data
                })
                .catch(showError)
            this.changeMode('rotina', 'editar')
        },
        updateRoutine() {
            axios.put(`${baseApiUrl}/vestibulando_rotina/${this.routineEdit.id}`, this.routineEdit)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Rotina editada com sucesso!' })
                    this.reset('rotina')
                })
                .catch(showError)
        },
        deleteRoutine(id) {
            axios.delete(`${baseApiUrl}/vestibulando_rotina/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Rotina excluída com sucesso!' })
                    this.reset('rotina')
                })
                .catch(showError)
            this.$bvModal.hide(`confirm-del-routine-${id}`)
        },
        changeMode(mode, action) {
            if(mode) {
                if(action) {
                    this.$router.push({ path: `/vestibulando/${mode}/${action}` })
                } else {
                    this.$router.push({ path: `/vestibulando/${mode}` })
                }
            }
        },
        reset(mode, action = null) {
            this.changeMode(mode, action)
            this.file = null,
            this.routineEdit = {}
            this.editPassword = {}
            this.loadVestibulando()
            this.loadRoutine()
        }
    },
    watch: {
        $route(to) {
            if(to.params.mode) {
                if(to.params.action) {
                    this.setMode(to.params.mode, to.params.action)
                } else {
                    this.setMode(to.params.mode)
                }
            }
        }
    },
    created() {
        this.setUserId()
        this.setMode(this.$route.params.mode, this.$route.params.action)
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
    .profile .main-area .custom-main-area button {
        font-size: 1.5rem;
    }

    .profile .main-area .info-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        
        background-color: #FAFAFA;
        padding: 30px;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .profile .main-area .info-box .box-title {
        margin-bottom: 20px
    }

    .profile .main-area .info-box.box-centered {
        align-items: center;
        text-align: center
    }

    .profile .main-area .info-box .info-row {
        display: flex;
        align-items: center;

        font-size: 1.5rem;
        margin-bottom: 10px;
        margin-left: 25px;
        word-break: break-word;
    }

    .profile .main-area .info-box .info-row:first-of-type {
        display: flex;
        align-items: flex-start;

        margin-left: 0px;
    }

    .profile .main-area .info-box .info-row.upload:first-of-type {
        align-items: center;
    }

    .profile .main-area .info-box .info-row.upload:first-of-type span {
        margin-left: 15px;
        font-size: 1rem;
    }

    .profile .main-area .info-box .info-row:first-of-type .profile-image {
        font-size: 5rem;
    }

    .profile .main-area .info-box .user-privacy {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: center;
    }
</style>