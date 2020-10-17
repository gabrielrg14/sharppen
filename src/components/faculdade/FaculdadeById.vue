<template>
    <div class="profile" v-if="dataReady && faculdade.ativo">
        
        <div class="left-area">
            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-graduation-cap"></i> <span>Cursos oferecidos pela {{ faculdade.nome }}:</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyCourses">
                    <span>Nenhum curso foi cadastrado pela faculdade ainda!</span>
                </div>

                <div class="side-box-content" v-else>
                    <ul>
                        <li v-for="course in faculdadeCourses" :key="course.id">{{ course.nome_curso }} - {{ course.periodo }}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="main-area">
            <div class="info-box handwriting">
                <div class="info-row">
                    <div v-if="faculdade.path_imagem" class="image-profile">
                        <img :src="getImgUrl(faculdade.path_imagem)" alt="Foto do Perfil">
                    </div>
                    <i v-else class="fas fa-user-circle primary profile-image"></i>
                    <div class="follow-row">
                        <span>{{ faculdade.nome }}</span>
                        <div v-if="!user.isFaculdade">
                            <div class="block-letter" v-if="!isFollower" @click="followUnfollowFaculdade">
                                <span>Seguir</span> <i class="fas fa-question-circle"></i>
                            </div>

                            <div class="block-letter" v-else @click="followUnfollowFaculdade">
                                <span>Seguindo</span> <i class="fas fa-check-circle"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="info-row">
                    <i class="fas fa-envelope primary"></i> <span>{{ faculdade.email }}</span>
                </div>

                <div class="info-row">
                    <i class="fas fa-phone-alt primary"></i> <span>{{ faculdade.telefone }}</span>
                </div>

                <div class="info-row">
                    <i class="fas fa-calendar-day primary"></i> <span>{{ faculdade.data_prova_formatada }}</span>
                </div>

                <div class="info-row">
                    <i class="fas fa-map-marker-alt primary"></i> <span>{{ faculdade.endereco }}</span>
                </div>
            </div>

            <div class="info-box box-centered" v-if="emptyPosts">
                <p>Nenhuma postagem foi feita por esta faculdade ainda!</p>
            </div>

            <div v-else class="post-box" v-for="post in posts" :key="post.id">
                <div class="info-row">
                    <div v-if="faculdade.path_imagem" class="image-profile">
                        <img :src="getImgUrl(faculdade.path_imagem)" alt="Foto do Perfil">
                    </div>
                    <i v-else class="fas fa-user-circle primary profile-image"></i>
                    <div class="info-post">
                        <span>{{ faculdade.nome }}</span>
                        <p>{{ post.data_postagem }}</p>
                    </div>
                </div>

                <div class="content-box">
                    <span v-html="post.conteudo"></span>
                </div>

                <div class="post-actions">
                    <span class="action-post" :class="{'primary': post.wasReacted}" @click="clickReaction(post)">
                        <i class="fas fa-graduation-cap"></i>
                        <span v-if="post.reactions == 1">{{ post.reactions }} <span class="d-none d-sm-inline-block">vestibulando aprovou!</span></span>
                        <span v-else>{{ post.reactions }} <span class="d-none d-sm-inline-block">vestibulandos aprovaram!</span></span>
                    </span>
                    <span class="action-post" v-b-modal="`comments-post-${post.id}`">
                        <i class="fas fa-comments"></i>
                        <span class="d-none d-sm-inline-block">Comentários</span>
                    </span>
                    <span class="action-post">
                        <i class="fas fa-share"></i>
                        <span class="d-none d-sm-inline-block">Compartilhar</span>
                    </span>
                </div>

                <b-modal :id="`comments-post-${post.id}`" size="md">
                    <template v-slot:modal-title>
                        <i class="fas fa-comments"></i> Comentários - Postagem {{ faculdade.nome }}
                    </template>
                    <span class="d-block text-center">
                        <div v-if="post.comments == 0" class="comment-box">
                            <span>Ainda não há comentários nesta postagem!</span>
                        </div>

                        <div v-else class="modal-comments" v-for="comment in post.comments" :key="comment.id">
                            <router-link :to="`/perfil/${comment.tipo_usuario}/${comment.id_usuario}`">
                                <div class="info-row">
                                    <div v-if="comment.path_imagem" class="image-profile">
                                        <img :src="getImgUrl(comment.path_imagem)" alt="Foto do Perfil">
                                    </div>
                                    <i v-else class="fas fa-user-circle primary profile-image"></i>
                                    <div class="info-post">
                                        <span>{{ comment.nome_usuario }}</span>
                                        <p>{{ comment.data_comentario_formatada }}</p>
                                    </div>
                                </div>
                            </router-link>

                            <div class="comment-container" v-if="comment.editComment">
                                <textarea type="text" v-model="comment.edit" name="commentEdit" class="data-input" placeholder="Edite seu comentário..."></textarea>
                                <button class="btn-blue-rounded" @click="updateComment(comment, post)">Salvar</button>
                            </div>

                            <div class="comment-container" v-else>
                                <span v-html="comment.conteudo"></span>
                            </div>
                            
                            <div class="comment-actions" v-if="!user.isFaculdade || post.id_faculdade == userId">
                                <span class="action-comment" :id="`span-icon-${comment.id}`" 
                                    v-if="!comment.editComment" 
                                    @click="toggleAnswer(comment, `showInputAnswer-${comment.id}`, `span-icon-${comment.id}`)"
                                >
                                    <i class="fas fa-reply"></i>Responder
                                </span>

                                <span v-if="comment.editComment" class="action-comment" v-b-modal="`confirm-del-comment-${comment.id}`">
                                    <i class="fas fa-trash-alt"></i>Excluir
                                </span>

                                <b-modal :id="`confirm-del-comment-${comment.id}`" size="sm">
                                    <template v-slot:modal-title>
                                        <i class="fas fa-exclamation-triangle"></i> Por favor, confirme esta ação...
                                    </template>
                                    <span class="d-block text-center">
                                        Deseja mesmo <b>excluir</b> este <b>comentário?</b><br><br>
                                        Ao fazer isto, este comentário será excluído permanentemente, assim como todas as respostas a ele.
                                    </span>
                                    <template v-slot:modal-footer>
                                        <b-button block pill variant="danger" @click="deleteComment(comment, post)">Confirmar</b-button>
                                        <b-button block class="mt-2" pill variant="outline-secondary" @click="$bvModal.hide(`confirm-del-comment-${comment.id}`)">Cancelar</b-button>
                                    </template>
                                </b-modal>
                            </div>

                            <div class="comment-container" v-show="comment.showInputAnswer" :id="`showInputAnswer-${comment.id}`">
                                <textarea type="text" v-model="comment.answer" name="commentEdit" class="data-input" placeholder="Responda este comentário..."></textarea>
                                <button class="btn-blue-rounded" @click="registerComment(post, comment)">Publicar</button>
                            </div>
                            
                            <div class="" v-if="comment.answerComments.length">
                                <div class="answer-container" v-for="answer in comment.answerComments" :key="answer.id">
                                    <router-link :to="`/perfil/${answer.tipo_usuario}/${answer.id_usuario}`">
                                        <div class="info-row answer">
                                            <div v-if="answer.path_imagem" class="image-profile">
                                                <img :src="getImgUrl(answer.path_imagem)" alt="Foto do Perfil">
                                            </div>
                                            <i v-else class="fas fa-user-circle primary profile-image"></i>
                                            <div class="info-user">
                                                <span>{{ answer.nome_usuario }}</span>
                                                <span>{{ answer.data_comentario_formatada }}</span>
                                            </div>
                                        </div>
                                    </router-link>

                                    <div class="comment-container ml-2" v-if="answer.editComment">
                                        <textarea type="text" v-model="answer.edit" name="commentEdit" class="data-input" placeholder="Edite seu comentário..."></textarea>
                                        <button class="btn-blue-rounded" @click="updateComment(answer, post)">Salvar</button>
                                        
                                        <span v-b-modal="`confirm-del-comment-${answer.id}`">
                                            <i class="fas fa-trash-alt icon-action"></i>
                                        </span>

                                        <b-modal :id="`confirm-del-comment-${answer.id}`" size="sm">
                                            <template v-slot:modal-title>
                                                <i class="fas fa-exclamation-triangle"></i> Por favor, confirme esta ação...
                                            </template>
                                            <span class="d-block text-center">
                                                Deseja mesmo <b>excluir</b> este <b>comentário?</b><br><br>
                                                Esta ação é irreversível e este comentário será excluído permanentemente.
                                            </span>
                                            <template v-slot:modal-footer>
                                                <b-button block pill variant="danger" @click="deleteComment(answer, post)">Confirmar</b-button>
                                                <b-button block class="mt-2" pill variant="outline-secondary" @click="$bvModal.hide(`confirm-del-comment-${answer.id}`)">Cancelar</b-button>
                                            </template>
                                        </b-modal>
                                    </div>

                                    <div class="asnwer-content" v-else>
                                        <span v-html="answer.conteudo"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </span>
                    <template v-slot:modal-footer>
                        <b-button block class="mt-2" pill variant="success" @click="$bvModal.hide(`comments-post-${post.id}`)">Fechar</b-button>
                    </template>
                </b-modal>

                <div class="comment-container" v-if="!user.isFaculdade">
                    <textarea type="text" v-model="post.comment" name="comment" class="data-input" placeholder="Escreva um comentário..."></textarea>
                    <button class="btn-blue-rounded" @click="registerComment(post)">Publicar</button>
                </div>
            </div>
        </div>

        <div class="right-area">
            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-book"></i> <span>Livros requisitados:</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyBooks">
                    <span>A faculdade não requisita nenhum livro para o Vestibular!</span>
                </div>

                <div class="side-box-content" v-else>
                    <ul>
                        <li v-for="book in faculdadeBooks" :key="book.id">
                            {{ book.nome_livro }} - {{ book.autor_livro }} 
                        </li>
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

import { baseApiUrl, showError, userKey } from '@/global'

export default {
    name: 'profileFaculdade',
    computed: mapState(['user']),
    data: function() {
        return {
            dataReady: false,
            userId: null,
            faculdadeData: {},
            isFollower: false,
            faculdade: {},
            emptyPosts: true,
            posts: [],
            emptyCourses: true,
            faculdadeCourses: [],
            emptyBooks: true,
            faculdadeBooks: [],
        }
    },
    methods: {
        setUserId() {
            const json = localStorage.getItem(userKey)
            const userData = JSON.parse(json)
            this.userId = userData.id
            this.$store.commit('setUser', userData)
        },
        setFaculdadeId() {
            this.faculdadeData.id_faculdade = this.$route.params.id
        },
        checkFollower() {
            if(!this.user.isFaculdade) {
                axios.post(`${baseApiUrl}/vestibulando_faculdade/check/${this.userId}`, this.faculdadeData)
                .then(res => { 
                    this.isFollower = res.data 
                })
                .catch(showError)
            }
        },
        loadFaculdade() {
            axios.get(`${baseApiUrl}/faculdade/${this.faculdadeData.id_faculdade}`)
                .then(res => {
                    this.faculdade = res.data
                })
                .catch(showError)
        },
        getImgUrl(path) {
            return require('../../assets/' + path)
        },
        loadCourses() {
            axios.get(`${baseApiUrl}/faculdade_curso/faculdade/${this.faculdadeData.id_faculdade}`)
                .then(res => {
                    if(res.data.length == 0) {
                        this.emptyCourses = true
                    } else {
                        this.emptyCourses = false
                        this.faculdadeCourses = res.data
                    }
                })
                .catch(showError)
        },
        loadPosts() {
            axios.get(`${baseApiUrl}/faculdade_postagem/faculdade/${this.faculdadeData.id_faculdade}`)
                .then(res => {
                    if(res.data.length == 0) {
                        this.emptyPosts = true
                    } else {
                        this.emptyPosts = false
                        res.data.map(post => {
                            if(!this.user.isFaculdade) {
                                this.checkPostReacted(post)
                            }
                            this.loadPostTotalReactions(post)
                            this.loadPostComments(post, false)
                        })
                        this.posts = res.data
                    }
                })
                .catch(showError)
        },
        loadBooks() {
            axios.get(`${baseApiUrl}/faculdade_livro/faculdade/${this.faculdadeData.id_faculdade}`)
                .then(res => {
                    if(res.data.length == 0) {
                        this.emptyBooks = true
                    } else {
                        this.emptyBooks = false
                        this.faculdadeBooks = res.data
                    }
                })
                .catch(showError)
        },
        followUnfollowFaculdade() {
            axios.post(`${baseApiUrl}/vestibulando_faculdade/follow_unfollow/${this.userId}`, this.faculdadeData)
                .then(() => {
                    this.isFollower = !this.isFollower
                })
                .catch(showError)
        },
        clickReaction(post) {
            if(this.user.isFaculdade) {
                alert("Apenas Vestibulandos podem reagir a publicações de Faculdades!")
            } else {
                let data = {}
                data.id_faculdade = post.id_faculdade
                data.id_vestibulando = this.userId

                axios.post(`${baseApiUrl}/reacao_postagem/react_unreact/${post.id}`, data)
                    .then(() => { 
                        post.wasReacted = !post.wasReacted
                        this.loadPostTotalReactions(post)
                    })
                    .catch(showError)
            }
        },
        checkPostReacted(post) {
            let data = {}
            data.id_vestibulando = this.userId
            axios.post(`${baseApiUrl}/reacao_postagem/check/${post.id}`, data)
                .then(res => { 
                    post.wasReacted = res.data
                })
                .catch(showError)
        },
        loadPostTotalReactions(post) {
            axios.get(`${baseApiUrl}/reacao_postagem/numberOfReactions/${post.id}`)
            .then(res => {
                post.reactions = res.data
            })
            .catch(showError)
        },
        loadPostComments(post) {
            let viewer_type
            if(this.user.isFaculdade) {
                viewer_type = "faculdade"
            } else {
                viewer_type = "vestibulando"
            }
            axios.get(`${baseApiUrl}/comentario_postagem/${post.id}/${this.userId}/${viewer_type}`)
                .then(res => {
                    post.comments = res.data
                    this.$bvModal.hide(`comments-post-${post.id}`)
                })
                .catch(showError)
        },
        registerComment(post, comment = null) {
            let data = {}
            data.id_postagem = post.id
            data.id_vestibulando = this.userId
            data.id_faculdade = post.id_faculdade
            if(comment) {
                data.conteudo = comment.answer
                data.id_comentario_origem = comment.id
            } else {
                data.conteudo = post.comment
            }
            if(this.user.isFaculdade) {
                data.tipo_usuario = "faculdade"
            } else {
                data.tipo_usuario = "vestibulando"
            }
            axios.post(`${baseApiUrl}/comentario_postagem/${post.id}`, data)
                .then(() => { 
                    this.$toasted.global.defaultSuccess({ msg: 'Comentário publicado com sucesso!' })
                    setInterval(function () {
                        this.refreshPage()
                    }.bind(this), 1000); 
                })
                .catch(showError)
        },
        deleteComment(comment) {
            axios.delete(`${baseApiUrl}/comentario_postagem/${comment.id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Comentário excluído com sucesso!' })
                    setInterval(function () {
                        this.refreshPage()
                    }.bind(this), 1000); 
                })
                .catch(showError)
        },
        updateComment(comment) {
            axios.put(`${baseApiUrl}/comentario_postagem/${comment.id}`, comment)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Comentário editado com sucesso!' })
                    setInterval(function () {
                        this.refreshPage()
                    }.bind(this), 1000)
                })
                .catch(showError)
        },
        toggleAnswer(comment, div, span) {
            var divInput = document.getElementById(div)
            var spanIcon = document.getElementById(span)
            if(comment.showInputAnswer) {
                divInput.style.display = "none"
                spanIcon.classList.remove("primary")
            } else {
                divInput.style.display = "flex"
                spanIcon.classList.add("primary")
            }
            comment.showInputAnswer = !comment.showInputAnswer
        },
        refreshPage() {
            window.location.reload()
        }
    },
    created() {
        this.setUserId()
        this.setFaculdadeId()
        this.checkFollower()
    },
    mounted() {
        this.loadFaculdade()
        this.loadCourses()
        this.loadBooks()
        this.loadPosts()
        this.dataReady = true
    }
}
</script>

<style scoped>
    .profile .main-area .info-box .info-row .follow-row {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .profile .main-area .info-box .info-row .follow-row .block-letter {
        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: #3A65DB;
        color: #FFF;
        border-radius: 1rem;
        padding: 2px 15px;
        cursor: pointer;
        font-size: 1rem;
    }

    .profile .main-area .info-box .info-row .follow-row .block-letter i {
        margin: auto auto auto 5px;
        font-size: 1rem;
    }

    .profile .main-area .post-box .comment-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 10px;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .profile .main-area .post-box .comment-container textarea {
        margin-bottom: 0px;
        height: 45px;
    }

    .profile .main-area .post-box .comment-container textarea::placeholder {
        font-family: Script-MT, Roboto, Arial, sans-serif;
    }

    .profile .main-area .post-box .comment-container button {
        width: auto;
        margin-left: 15px;
    }
</style>