<template>
    <div class="feed" v-if="dataReady">

        <div class="left-area">
            <div class="side-box handwriting">
                <div class="side-box-header">
                    <router-link to="vestibulando/perfil">
                        <div v-if="vestibulando.path_imagem" class="image-profile">
                            <img :src="getImgUrl(vestibulando.path_imagem)" alt="Foto do Perfil">
                        </div>
                        <i v-else class="fas fa-user-circle primary profile-image"></i>
                    </router-link>
                    <span>
                        {{ vestibulando.nome }}
                        <router-link to="/vestibulando/perfil/editar">
                            <i class="fas fa-pen-alt icon-action"></i>
                        </router-link>
                    </span> 
                    
                </div>

                <div class="side-box-content user-info">
                    <i class="fas fa-envelope primary"></i> <span>{{ vestibulando.email }}</span>
                </div>

                <div class="side-box-content user-info">
                    <i class="fas fa-birthday-cake primary"></i> <span>{{ vestibulando.data_nascimento_formatada }}</span>
                </div>

                <div class="side-box-content user-info">
                    <i class="fas fa-graduation-cap primary"></i> <span>{{ vestibulando.curso }}</span>
                </div>
            </div>
        </div>

        <div class="main-area">

            <div class="info-box box-centered" v-if="emptyFollowing">
                <span>Você ainda não segue nenhuma faculdade!</span>
            </div>

            <div class="info-box box-centered" v-else-if="emptyPosts">
                <p>Nenhuma postagem foi feita pelas faculdades seguidas ainda!</p>
            </div>

            <div v-else class="post-box" v-for="post in posts" :key="post.id">
                <router-link :to="`/perfil/faculdade/${post.id_faculdade}`">
                    <div class="info-row">
                        <div v-if="post.path_imagem" class="image-profile">
                            <img :src="getImgUrl(post.path_imagem)" alt="Foto do Perfil">
                        </div>
                        <i v-else class="fas fa-user-circle primary profile-image"></i>
                        <div class="info-post">
                            <span>{{ post.nome_faculdade }}</span>
                            <p>{{ post.data_postagem_formatada }}</p>
                        </div>
                    </div>
                </router-link>

                <div class="content-box">
                    <span v-html="post.conteudo"></span>
                </div>

                <span v-if="post.reactions == 1">{{ post.reactions }} vestibulando aprovou!</span>
                <span v-else>{{ post.reactions }} vestibulandos aprovaram!</span>

                <div class="post-actions">
                    <span class="action-post" :class="{'primary': post.wasReacted}" @click="clickReaction(post)">
                        <i class="fas fa-graduation-cap"></i> 
                        <span v-if="post.wasReacted" class="d-none d-sm-inline-block">Aprovado!</span>
                        <span v-else class="d-none d-sm-inline-block">Aprovar!</span>
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
                        <i class="fas fa-comments"></i> Comentários - Postagem {{ post.nome_faculdade }}
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
                                <button class="btn-blue-rounded" @click="updateComment(comment)">Salvar</button>
                            </div>

                            <div class="comment-container" v-else>
                                <span v-html="comment.conteudo"></span>
                            </div>
                            
                            <div class="comment-actions">
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

                <div class="comment-container">
                    <textarea type="text" v-model="post.comment" name="comment" class="data-input" placeholder="Escreva um comentário..."></textarea>
                    <button class="btn-blue-rounded" @click="registerComment(post)">Publicar</button>
                </div>
            </div>
        </div>

        <div class="right-area">
            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-university"></i> <span>Faculdades seguidas:</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyFollowing">
                    <span>Você ainda não segue nenhuma faculdade!</span>
                </div>

                <div class="side-box-content" v-else v-for="faculdade in following.slice(0, 5)" :key="faculdade.id" >
                    <router-link :to="`/perfil/faculdade/${faculdade.id}`">
                        <div v-if="faculdade.path_imagem" class="image-profile">
                            <img :src="getImgUrl(faculdade.path_imagem)" alt="Foto do Perfil">
                        </div>
                        <i v-else class="fas fa-user-circle primary"></i>
                        <span>{{ faculdade.nome }}</span>
                    </router-link>
                </div>

                <button class="btn-blue-rounded mt-3" v-b-modal="`view-all-following`">Visualizar tudo</button>

                <b-modal :id="`view-all-following`" size="sm">
                    <template v-slot:modal-title>
                        <i class="fas fa-university"></i> Faculdades que você segue:
                    </template>

                    <div class="side-box-content text-center" v-if="emptyFollowing">
                        <span>Você ainda não segue nenhuma faculdade!</span>
                    </div>

                    <span class="d-block row-perfis" v-for="faculdade in following" :key="faculdade.id">
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
        </div>

    </div>
</template>

<script>
import axios from 'axios'
import { mapState } from "vuex"

import { baseApiUrl, showError, userKey } from '@/global'

export default {
    name: 'Feed',
    computed: mapState(['user']),
    data: function() {
        return {
            dataReady: false,
            userId: null,
            vestibulando: {},
            emptyPosts: true,
            posts: [],
            emptyFollowing: true,
            following: [],
        }
    },
    methods: {
        setUserId() {
            const json = localStorage.getItem(userKey)
            const userData = JSON.parse(json)
            this.userId = userData.id
            this.$store.commit('setUser', userData)
        },
        loadVestibulando() {
            axios.get(`${baseApiUrl}/vestibulando/${this.userId}`)
                .then(res => {
                    this.vestibulando = res.data
                })
                .catch(showError)
        },
        getImgUrl(path) {
            return require('../../assets/' + path)
        },
        loadPostsFollowing() {
            axios.get(`${baseApiUrl}/faculdade_postagem/${this.userId}`)
                .then(res => {
                    if(res.data.length == 0) {
                        this.emptyPosts = true
                    } else {
                        this.emptyPosts = false
                        res.data.forEach(post => {
                            if(!this.user.isFaculdade) {
                                this.checkPostReacted(post)
                            }
                            this.loadPostTotalReactions(post)
                            this.loadPostComments(post, false)
                        });
                        this.posts = res.data
                    }
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
    },
    mounted() {
        this.loadVestibulando()
        this.loadFollowing()
        this.loadPostsFollowing()
        this.dataReady = true
    }
}
</script>

<style>
    .feed {
        display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		grid-template-areas:
			"left-area main-area right-area";
    }

    .feed .side-box-content {
        align-self: flex-start;
    }

    .feed .side-box .profile-image {
        font-size: 3rem;
    }

     @media (max-width: 992px) {
        .feed {
            display: grid;
            grid-template-columns: 1fr 1fr;
            padding: 0px 30px 0px 30px;
            column-gap: 30px;
            grid-template-areas:
                "main-area main-area"
                "right-area left-area";
        }

        .left-area {
            padding: 0px;
        }

        .right-area {
            padding: 0px;
        }

        .feed .side-box-content {
            align-self: center;
        }
    }

    @media (max-width: 767px) {
        .feed {
            display: grid;
            grid-template-columns: 1fr;  
            grid-template-areas:
                "main-area"
                "left-area"
                "right-area";
        }
    }

    .feed i {
        margin-right: 15px;
        font-size: 1.7rem;
    }

    .feed .main-area .post-box {
        background-color: #FAFAFA;
        padding: 15px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        margin-bottom: 30px;
    }

    .feed .main-area .info-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        
        background-color: #FAFAFA;
        padding: 30px;
        margin-bottom: 30px;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .feed .main-area .info-box .box-title {
        margin-bottom: 20px
    }

    .feed .main-area .info-box.box-centered {
        align-items: center;
        text-align: center
    }

    .feed .main-area .info-box .info-row {
        display: flex;
        align-items: center;

        font-size: 1.5rem;
        margin-bottom: 10px;
        margin-left: 25px;
    }

    .feed .main-area .info-box .info-row:first-of-type {
        display: flex;
        align-items: flex-start;

        margin-left: 0px;
    }

    .feed .main-area .info-box .info-row:first-of-type .profile-image {
        font-size: 5rem;
    }

    .feed .main-area .post-box > a,
    .feed .main-area .post-box .content-box > a {
        text-decoration: none;
        color: #332A2A;
    }

    .feed .main-area .post-box .info-row {
        display: flex;
        flex-direction: row;
    }

    .feed .main-area .post-box .info-row i {
        font-size: 3rem;
    }

    .feed .main-area .post-box .info-row .info-post {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .feed .main-area .post-box .content-box {
        background-color: #FFF;
        padding: 15px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        margin-bottom: 15px;
    }

    .feed .main-area .post-box .content-box span p {
        margin-bottom: auto;
    }

    .feed .main-area .post-box .post-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: #FFF;
        margin: 5px auto 15px auto;
        padding: 5px 15px 5px 15px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 10px;
    }

    .feed .main-area .post-box .post-actions .action-post:hover {
        color: #3A65DB;
        cursor: pointer;
    }

    .feed .main-area .post-box .post-actions .action-post i {
        margin-right: 5px;
        font-size: 1.4rem;
    }

    .feed .main-area .post-box .comment-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 10px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        background-color: #FFF;
    }

    .feed .main-area .post-box .comment-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 10px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        background-color: #FFF;
        word-wrap: break-word;
    }

    .feed .main-area .post-box .comment-container textarea {
        margin-bottom: 0px;
        height: 45px;
        background-color: #FFF;
    }

    .feed .main-area .post-box .comment-container textarea::placeholder {
        font-family: Script-MT, Roboto, Arial, sans-serif;
    }

    .feed .main-area .post-box .comment-container button {
        width: auto;
        margin-left: 15px;
    }

    .feed .main-area .post-box .comment-box {
        display: flex;
        flex-direction: row;

        background-color: #FAFAFA;
        padding: 15px;
        margin-bottom: 15px;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .feed .main-area .post-box .comment-box i {
        margin-top: 5px;
        font-size: 2.5rem;
    }

    .feed .main-area .post-box .content-box .comment-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: #FAFAFA;
        padding: 5px 15px;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .feed .main-area .post-box .content-box .comment-actions .action-comment i {
        margin-right: 5px;
        font-size: 1rem;
    }

    .feed .main-area .post-box .content-box .comment-actions .action-comment:hover {
        color: #3A65DB;
        cursor: pointer;
    }
</style>