<template>
    <div class="profile" v-if="dataReady">

        <div class="left-area">
            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-user-graduate"></i> <span>Seguidores da {{ faculdade.nome }}:</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyFollowers">
                    <span>Ainda não há seguidores!</span>
                </div>

                <div class="side-box-content" v-else v-for="follower in followers.slice(0, 5)" :key="follower.id">
                    <router-link :to="`/perfil/vestibulando/${follower.id}`">
                        <div v-if="follower.path_imagem" class="image-profile">
                            <img :src="getImgUrl(follower.path_imagem)" alt="Foto do Perfil">
                        </div>
                        <i v-else class="fas fa-user-circle primary"></i>
                        <span>{{ follower.nome }}</span>
                    </router-link>
                </div>

                <button class="btn-blue-rounded mt-3" v-b-modal="`view-all-followers`" v-if="!emptyFollowers">Visualizar tudo</button>

                <b-modal :id="`view-all-followers`" size="sm">
                    <template v-slot:modal-title>
                        <i class="fas fa-user-graduate"></i> Seguidores da {{ faculdade.nome }}:
                    </template>
                    <span class="d-block row-perfis" v-for="follower in followers" :key="follower.id">
                        <router-link :to="`/perfil/vestibulando/${follower.id}`">
                            <div v-if="follower.path_imagem" class="image-profile">
                                <img :src="getImgUrl(follower.path_imagem)" alt="Foto do Perfil">
                            </div>
                            <i v-else class="fas fa-user-circle primary"></i>
                            <span>{{ follower.nome }}</span>
                        </router-link>
                    </span>
                    <template v-slot:modal-footer>
                        <b-button block class="mt-2" pill variant="success" @click="$bvModal.hide(`view-all-followers`)">Fechar</b-button>
                    </template>
                </b-modal>
            </div>
        </div>

        <div class="main-area">

            <!-- Mode view Profile -->
            <div v-if="mode === 'viewProfile'">
                <div class="post-box">
                    <div class="post-container">
                        <VueEditor v-model="postEdit.conteudo" placeholder="Escreva uma postagem para seus Vestibulandos aqui..." />
                        <button class="btn-blue-rounded" @click="registerPost">Publicar</button>
                    </div>
                </div>

                <div class="button-posts">
                    <button class="btn-blue-rounded" @click="changeMode('postagens')">Visualizar todas postagens</button>
                </div>

                <div class="info-box handwriting">
                    <div class="info-row">
                        <div v-if="faculdade.path_imagem" class="image-profile">
                            <img :src="getImgUrl(faculdade.path_imagem)" alt="Foto do Perfil">
                        </div>
                        <i v-else class="fas fa-user-circle primary profile-image"></i>
                        <span>{{ faculdade.nome }}</span> 
                        <i @click="editProfile" class="fas fa-pen-alt icon-action"></i>
                        <i @click="changeMode('perfil', 'privacidade')" class="fas fa-user-lock icon-action"></i>
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
            </div>
            
            <!-- Mode view Posts -->
            <div v-if="mode === 'viewPosts'">
                <div class="info-box box-centered">
                    <h3>Postagens - {{ faculdade.nome }}</h3>
                    <i class="fas fa-chevron-circle-left icon-action" @click="reset('perfil')"></i>
                </div>

                <div class="info-box box-centered" v-if="emptyPosts">
                    <p>Nenhuma postagem foi feita ainda!</p>
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

                    <div v-if="post.editPost">
                        <VueEditor v-model="post.conteudo_edit" placeholder="Escreva uma postagem para seus Vestibulandos aqui..." />

                        <button class="btn-blue-rounded mt-3" @click="updatePost(post)">Salvar</button>
                        <button class="btn-transparent-rounded mt-3" @click="toggleEditPost(post)">Cancelar</button>
                    </div>

                    <div v-else class="content-box">
                        <span v-html="post.conteudo"></span>
                    </div>

                    <div class="post-actions">
                        <span class="action-post" v-b-modal="`view-vestibulandos-reactions-${post.id}`"><i class="fas fa-graduation-cap"></i>
                            <span v-if="post.reactions == 1">{{ post.reactions }} vestibulando aprovou!</span>
                            <span v-else>{{ post.reactions }} vestibulandos aprovaram!</span>
                        </span>

                        <span class="action-post" v-b-modal="`comments-post-${post.id}`">
                            <i class="fas fa-comments"></i>
                            <span class="d-none d-sm-inline-block">Comentários</span>
                        </span>

                        <b-modal :id="`view-vestibulandos-reactions-${post.id}`" size="sm">
                            <template v-slot:modal-title>
                                <i class="fas fa-graduation-cap"></i> Vestibulandos que reagiram a postagem:
                            </template>
                            <span v-if="post.reactions == '0'" class="d-block text-center">
                                Nenhum Vestibulando reagiu a postagem ainda!
                            </span>

                            <span v-else class="d-block row-perfis" v-for="reactor in post.reactors" :key="reactor.id">
                                <router-link :to="`/perfil/vestibulando/${reactor.id}`">
                                    <div v-if="reactor.path_imagem" class="image-profile">
                                        <img :src="getImgUrl(reactor.path_imagem)" alt="Foto do Perfil">
                                    </div>
                                    <i v-else class="fas fa-user-circle primary"></i>
                                    <span>{{ reactor.nome }}</span>
                                </router-link>
                            </span>
                            <template v-slot:modal-footer>
                                <b-button block class="mt-2" pill variant="success" @click="$bvModal.hide(`view-vestibulandos-reactions-${post.id}`)">Fechar</b-button>
                            </template>
                        </b-modal>

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
                                        <button class="btn-blue-rounded" @click="updateComment(comment, post)">Salvar</button>
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
                    </div>

                    <div class="post-actions">
                        <span class="action-post" :class="{'primary': post.editPost}" @click="toggleEditPost(post)">
                            <i class="fas fa-pen-alt"></i>
                            <span>Editar</span>
                        </span>
                        <span class="action-post" v-b-modal="`confirm-del-post-${post.id}`">
                            <i class="fas fa-trash-alt"></i>
                            <span>Excluir</span>
                        </span>

                        <b-modal :id="`confirm-del-post-${post.id}`" size="sm">
                            <template v-slot:modal-title>
                                <i class="fas fa-exclamation-triangle"></i> Por favor, confirme esta ação...
                            </template>
                            <span class="d-block text-center">Deseja mesmo <b>excluir</b> esta <b>Postagem</b>?<br><br>
                                Ao fazer isto, todos os comentários e reações serão apagados.
                            </span>

                            <template v-slot:modal-footer>
                                <b-button block pill variant="danger" @click="deletePost(post.id)">Excluir</b-button>
                                <b-button block class="mt-2" pill variant="outline-secondary" @click="$bvModal.hide(`confirm-del-post-${post.id}`)">Cancelar</b-button>
                            </template>
                        </b-modal>
                    </div>
                </div>
            </div>

            <!-- Mode Edit Profile -->
            <div v-if="mode === 'editProfile'" class="custom-main-area">
                <div class="info-box">
                    <form @submit.prevent="updateProfile" enctype="multipart/form-data">
                        <div class="info-row upload">
                            <div v-if="faculdadeEdit.path_imagem" class="image-profile">
                                <img :src="getImgUrl(faculdadeEdit.path_imagem)" alt="Foto do Perfil">
                            </div>
                            <i v-else class="fas fa-user-circle primary profile-image"></i>
                            <label for="select-file" class="input-file-label">Procurar...</label>
                            <input type="file" ref="file" name="file" id="select-file" class="upload-image" @change="onSelectImage">
                            <span id="file-name">Nenhum arquivo selecionado</span>
                        </div>

                        <input v-model="faculdadeEdit.nome" name="nome" class="data-input" type="text" placeholder="Nome da Faculdade">
                        <input v-model="faculdadeEdit.email" name="email" class="data-input" type="text" placeholder="E-mail Institucional">
                        <input v-model="faculdadeEdit.data_prova" name="data_prova" class="data-input" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" placeholder="Data da Prova">
                        <input v-model="faculdadeEdit.endereco" name="endereco" class="data-input" type="text" placeholder="Endereço">
                        <input v-model="faculdadeEdit.telefone" name="telefone" class="data-input" type="text" placeholder="Telefone">

                        <button type="submit" class="btn-blue-rounded handwriting mt-2 mb-3">Salvar</button>
                    </form>

                    <button class="btn-transparent-rounded handwriting" @click="reset('perfil')">Cancelar</button>
                </div>

                <button class="btn-blue-rounded handwriting mb-3" @click="changeMode('perfil', 'senha')">Alterar minha senha</button>
            </div>

            <!-- Mode User Privacy -->
            <div v-if="mode === 'userPrivacy'" class="custom-main-area">
                <div class="info-box box-centered">

                    <div v-if="faculdade.ativo">
                        <i class="fas fa-check-circle primary mb-2"></i><h3>Sua conta está ativa!</h3>
                        <button class="btn-blue-rounded handwriting mt-2 mb-3" v-b-modal="'confirm-deactivate-account'">Desativar conta</button>

                        <b-modal id="confirm-deactivate-account" size="sm">
                            <template v-slot:modal-title>
                                <i class="fas fa-exclamation-triangle"></i> Por favor, confirme esta ação...
                            </template>
                            <span class="d-block text-center">
                                Deseja mesmo <b>desativar</b> a <b>conta?</b><br><br>
                                Ao fazer isto, o perfil e as postagens não poderão ser acessadas pelos outros usuários.
                            </span>
                            <template v-slot:modal-footer>
                                <b-button block pill variant="danger" @click="deactivateAccount">Confirmar</b-button>
                                <b-button block class="mt-2" pill variant="outline-secondary" @click="$bvModal.hide('confirm-deactivate-account')">Cancelar</b-button>
                            </template>
                        </b-modal>
                    </div>

                    <div v-else>
                        <i class="fas fa-power-off primary mb-2"></i><h3>Sua conta está desativada!</h3>
                        <button class="btn-blue-rounded handwriting mt-2 mb-3" v-b-modal="'confirm-reactivate-account'">Reativar conta</button>

                        <b-modal id="confirm-reactivate-account" size="sm">
                            <template v-slot:modal-title>
                                Por favor, confirme esta ação...
                            </template>
                            <span class="d-block text-center">
                                Deseja mesmo <b>reativar</b> a conta?<br><br>
                                Ao fazer isto, o perfil e as postagens poderão ser acessadas novamente pelos outros usuários.
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
                    <input v-model="editPassword.senha" name="senha" class="data-input" type="password" placeholder="Nova Senha">
                    <input v-model="editPassword.confirmacao_senha" name="confirmacao_senha" class="data-input" type="password" placeholder="Confirmação da Nova Senha">

                    <button class="btn-blue-rounded handwriting mt-2 mb-3" @click="updatePassword">Salvar</button>
                    <button class="btn-transparent-rounded handwriting" @click="reset('perfil', 'editar')">Cancelar</button>
                </div>
            </div>

            <!-- Mode View Courses -->
            <div v-if="mode === 'viewCourses'" class="custom-main-area">
                <div class="info-box box-centered">
                    <h3 class="box-title">Gerencie seus Cursos</h3>

                    <p v-if="emptyCourses">
                        Nenhum curso foi cadastrado ainda!
                    </p>

                    <ul v-else class="text-left">
                        <li v-for="course in faculdadeCourses" :key="course.id">
                            {{ course.nome_curso }} - {{ course.periodo }}
                            <i @click="getCourse(course.id)" class="fas fa-pen-alt icon-action edit-icon"></i>
                            <i v-b-modal="`confirm-del-course-${course.id}`" class="fas fa-trash-alt icon-action delete-icon"></i>
                            
                            <b-modal :id="`confirm-del-course-${course.id}`" size="sm">
                                <template v-slot:modal-title>
                                    <i class="fas fa-exclamation-triangle"></i> Por favor, confirme esta ação...
                                </template>
                                <span class="d-block text-center">Deseja mesmo <b>excluir</b> o <b>Curso</b> de {{ course.nome_curso }} - Período {{ course.periodo }}?</span>
                                <template v-slot:modal-footer>
                                    <b-button block pill variant="danger" @click="deleteCourse(course.id)">Excluir</b-button>
                                    <b-button block class="mt-2" pill variant="outline-secondary" @click="$bvModal.hide(`confirm-del-course-${course.id}`)">Cancelar</b-button>
                                </template>
                            </b-modal>
                        </li>
                    </ul>

                    <button class="btn-blue-rounded handwriting mt-2 mb-3" @click="changeMode('cursos', 'novo')">Cadastrar novo</button>
                    <button class="btn-transparent-rounded handwriting" @click="reset('perfil')">Voltar</button>
                </div>
            </div>

            <!-- Mode New Course -->
            <div v-if="mode === 'newCourse'" class="custom-main-area">
                <div class="info-box box-centered">
                    <h3 class="box-title">Cadastro de novo Curso</h3>

                    <input v-model="course.nome_curso" name="nome_curso" class="data-input" type="text" placeholder="Nome do Curso">
                    <!-- <input v-model="course.periodo" name="periodo" class="data-input" type="text" placeholder="Período do Curso"> -->
                    <select id="periodo" v-model="course.periodo" name="periodo" class="data-input">
                        <option :value="null" disabled selected>Período do Curso</option>
                        <option value="Matutino">Matutino/Manhã (6:00 às 11:59)</option>
                        <option value="Vespertino">Vespertino/Tarde (12:00 às 17:59)</option>
                        <option value="Noturno">Noite ou Noturno (18:00 às 23:59)</option>
                    </select>

                    <button class="btn-blue-rounded handwriting mt-2 mb-3" @click="registerCourse">Cadastrar</button>
                    <button class="btn-transparent-rounded handwriting" @click="reset('cursos')">Cancelar</button>
                </div>
            </div>

            <!-- Mode Edit Course -->
            <div v-if="mode === 'editCourse'" class="custom-main-area">
                <div class="info-box box-centered">
                    <h3 class="box-title">Editar Curso de {{ course.nome_curso }} - Período {{ course.periodo }}</h3>

                    <input v-model="courseEdit.nome_curso" name="nome_curso" class="data-input" type="text" placeholder="Nome do Curso">
                    <!-- <input v-model="course.periodo" name="periodo" class="data-input" type="text" placeholder="Período do Curso"> -->
                    <select id="periodo" v-model="courseEdit.periodo" name="periodo" class="data-input">
                        <option :value="null" disabled>Período do Curso</option>
                        <option value="Matutino">Matutino/Manhã (6:00 às 11:59)</option>
                        <option value="Vespertino">Vespertino/Tarde (12:00 às 17:59)</option>
                        <option value="Noturno">Noite ou Noturno (18:00 às 23:59)</option>
                    </select>

                    <button class="btn-blue-rounded handwriting mt-2 mb-3" @click="updateCourse(course.id)">Editar</button>
                    <button class="btn-transparent-rounded handwriting" @click="reset('cursos')">Cancelar</button>
                </div>
            </div>

            <!-- Mode View Books -->
            <div v-if="mode === 'viewBooks'" class="custom-main-area">
                <div class="info-box box-centered">
                        <h3 class="box-title">Gerencie seus Livros</h3>

                        <p v-if="emptyBooks">
                            Nenhum livro foi cadastrado ainda!
                        </p>

                        <ul v-else class="text-left">
                            <li v-for="book in faculdadeBooks" :key="book.id">
                                {{ book.nome_livro }} - {{ book.autor_livro }}
                                <i @click="getBook(book.id)" class="fas fa-pen-alt icon-action edit-icon"></i>
                                <i v-b-modal="`confirm-del-book-${book.id}`" class="fas fa-trash-alt icon-action delete-icon"></i>
                                
                                <b-modal :id="`confirm-del-book-${book.id}`" size="sm">
                                    <template v-slot:modal-title>
                                        <i class="fas fa-exclamation-triangle"></i> Por favor, confirme esta ação...
                                    </template>
                                    <span class="d-block text-center">Deseja mesmo <b>excluir</b> o <b>Livro</b> {{ book.nome_livro }} - Autor {{ book.autor_livro }}?</span>
                                    <template v-slot:modal-footer>
                                        <b-button block pill variant="danger" @click="deleteBook(book.id)">Excluir</b-button>
                                        <b-button block class="mt-2" pill variant="outline-secondary" @click="$bvModal.hide(`confirm-del-book-${book.id}`)">Cancelar</b-button>
                                    </template>
                                </b-modal>
                            </li>
                        </ul>
                    <button class="btn-blue-rounded handwriting mt-2 mb-3" @click="changeMode('livros', 'novo')">Cadastrar novo</button>
                    <button class="btn-transparent-rounded handwriting" @click="reset('perfil')">Voltar</button>
                </div>
            </div>

            <!-- Mode New Book -->
            <div v-if="mode === 'newBook'" class="custom-main-area">
                <div class="info-box box-centered">
                    <h3 class="box-title">Cadastro de novo Livro</h3>

                    <input v-model="book.nome_livro" name="nome_livro" class="data-input" type="text" placeholder="Nome do Livro">
                    <input v-model="book.autor_livro" name="autor_livro" class="data-input" type="text" placeholder="Autor do Livro">

                    <button class="btn-blue-rounded handwriting mt-2 mb-3" @click="registerBook">Cadastrar</button>
                    <button class="btn-transparent-rounded handwriting" @click="reset('livros')">Cancelar</button>
                </div>
            </div>

            <!-- Mode Edit Book -->
            <div v-if="mode === 'editBook'" class="custom-main-area">
                <div class="info-box box-centered">
                    <h3 class="box-title">Editar Livro {{ book.nome_livro }} - Autor {{ book.autor_livro }}</h3>

                    <input v-model="bookEdit.nome_livro" name="nome_livro" class="data-input" type="text" placeholder="Nome do Livro">
                    <input v-model="bookEdit.autor_livro" name="autor_livro" class="data-input" type="text" placeholder="Autor do Livro">

                    <button class="btn-blue-rounded handwriting mt-2 mb-3" @click="updateBook(book.id)">Editar</button>
                    <button class="btn-transparent-rounded handwriting" @click="reset('livros')">Cancelar</button>
                </div>
            </div>
        </div>
            
        <div class="right-area">
            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-graduation-cap"></i> <span>Cursos oferecidos:</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyCourses">
                    <span>Nenhum curso foi cadastrado ainda!</span>
                </div>

                <div class="side-box-content" v-else>
                    <ul>
                        <li v-for="course in faculdadeCourses" :key="course.id">{{ course.nome_curso }} - {{ course.periodo }}</li>
                    </ul>
                </div>

                <button class="btn-blue-rounded mt-3" @click="changeMode('cursos')">Gerenciar Cursos</button>
            </div>

            <div class="side-box">
                <div class="side-box-header">
                    <i class="fas fa-book"></i> <span>Livros requisitados:</span>
                </div>

                <div class="side-box-content text-center" v-if="emptyBooks">
                    <span>Nenhum livro foi requisitado para o Vestibular ainda!</span>
                </div>

                <div class="side-box-content" v-else>
                    <ul>
                        <li v-for="book in faculdadeBooks" :key="book.id">
                            {{ book.nome_livro }} - {{ book.autor_livro }} 
                        </li>
                    </ul>
                </div>
                
                <button class="btn-blue-rounded mt-3" @click="changeMode('livros')">Gerenciar Livros</button>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios'
import { mapState } from "vuex"
import { VueEditor } from "vue2-editor"

import { baseApiUrl, showError, userKey } from '@/global'

export default {
    name: 'FaculdadeProfile',
    components: { VueEditor },
    computed: mapState(['user']),
    data: function() {
        return {
            dataReady: false,
            mode: 'viewProfile',
            userId: null,
            faculdade: {},
            faculdadeEdit: {},
            editPassword: {},
            emptyFollowers: true,
            followers: [],
            emptyPosts: true,
            posts: [],
            postEdit: {},
            emptyCourses: true,
            faculdadeCourses: [],
            course: { periodo: null },
            courseEdit: {},
            faculdadeBooks: [],
            emptyBooks: true,
            book: {},
            bookEdit: {}
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
                    } else if(mode == "perfil" && action == "privacidade") {
                        this.mode = "userPrivacy"
                    } else if(mode == "perfil" && action == "senha") {
                        this.mode = "editPassword"
                    } else if(mode == "cursos" && action == "editar") {
                        this.mode = "editCourse"
                    } else if(mode == "cursos" && action == "novo") {
                        this.mode = "newCourse"
                    } else if(mode == "livros" && action == "editar") {
                        this.mode = "editBook"
                    } else if(mode == "livros" && action == "novo") {
                        this.mode = "newBook"
                    }
                } else {
                    if(mode == "perfil") {
                        this.mode = "viewProfile"
                    } else if(mode == "cursos") {
                        this.mode = "viewCourses"
                    } else if(mode == "livros") {
                        this.mode = "viewBooks"
                    } else if(mode == "postagens") {
                        this.mode = "viewPosts"
                    }
                }
            }
        },
        loadFaculdade() {
            axios.get(`${baseApiUrl}/faculdade/${this.userId}`)
                .then(res => {
                    this.faculdade = res.data
                })
                .catch(showError)
        },
        getImgUrl(path) {
            return require('../../assets/' + path)
        },
        loadFollowers() {
            axios.get(`${baseApiUrl}/vestibulando_faculdade/followers/${this.userId}`)
                .then(res => {
                    if(res.data.length == 0) {
                        this.emptyFollowers = true
                    } else {
                        this.emptyFollowers = false
                        this.followers = res.data
                    }
                })
                .catch(showError)
        },
        loadCourses() {
            axios.get(`${baseApiUrl}/faculdade_curso/faculdade/${this.userId}`)
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
        loadBooks() {
            axios.get(`${baseApiUrl}/faculdade_livro/faculdade/${this.userId}`)
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
        registerPost() {
            axios.post(`${baseApiUrl}/faculdade_postagem/${this.userId}`, this.postEdit)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Postagem publicada com sucesso!' })
                    this.reset('perfil')
                })
                .catch(showError)
        },
        loadPosts() {
            axios.get(`${baseApiUrl}/faculdade_postagem/faculdade/${this.userId}`)
                .then(res => {
                    if(res.data.length == 0) {
                        this.emptyPosts = true
                    } else {
                        this.emptyPosts = false
                        res.data.map(post => {
                            this.loadPostTotalReactions(post)
                            this.loadPostReactors(post)
                            this.loadPostComments(post, false)
                        })
                        this.posts = res.data
                    }
                })
                .catch(showError)
        },
        toggleEditPost(post) {
            post.editPost = !post.editPost
        },
        updatePost(post) {
            axios.put(`${baseApiUrl}/faculdade_postagem/${post.id}`, post)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Postagem editada com sucesso!' })
                    this.reset('postagens')
                })
                .catch(showError)
            this.toggleEditPost(post)
        },
        deletePost(id) {
            axios.delete(`${baseApiUrl}/faculdade_postagem/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Postagem excluída com sucesso!' })
                    this.reset('postagens')
                })
                .catch(showError)
            this.$bvModal.hide(`confirm-del-post-${id}`)
        },
        loadPostTotalReactions(post) {
            axios.get(`${baseApiUrl}/reacao_postagem/numberOfReactions/${post.id}`)
                .then(res => {
                    post.reactions = res.data
                })
                .catch(showError)
        },
        loadPostReactors(post) {
            axios.get(`${baseApiUrl}/reacao_postagem/reactors/${post.id}`)
                .then(res => {
                    post.reactors = res.data
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
        editProfile() {
            axios.get(`${baseApiUrl}/faculdade/${this.userId}`)
                .then(res => {
                    this.faculdadeEdit = res.data
                })
                .catch(showError)
            this.changeMode('perfil', 'editar')
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
                axios.post(`${baseApiUrl}/upload/faculdade/${this.faculdadeEdit.id}`, formData)
            }

            axios.put(`${baseApiUrl}/faculdade/${this.faculdadeEdit.id}`, this.faculdadeEdit)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Perfil editado com sucesso!' })
                    this.reset('perfil')
                })
                .catch(showError)
        },
        updatePassword() {
            axios.patch(`${baseApiUrl}/faculdade/${this.userId}`, this.editPassword)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Senha atualizada!' })
                    this.reset('perfil', 'editar')
                })
                .catch(showError)
        },
        deactivateAccount() {
            axios.post(`${baseApiUrl}/faculdade/deactivate/${this.userId}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Sua conta foi desativada!' })
                    this.reset('perfil', 'privacidade')
                })
                .catch(showError)
                this.$bvModal.hide('confirm-deactivate-account')
        },
        reactivateAccount() {
            axios.post(`${baseApiUrl}/faculdade/reactivate/${this.userId}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Sua conta foi reativada!' })
                    this.reset('perfil', 'privacidade')
                })
                .catch(showError)
                this.$bvModal.hide('confirm-reactivate-account')
        },
        registerCourse() {
            axios.post(`${baseApiUrl}/faculdade_curso/${this.userId}`, this.course)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Curso cadastrado com sucesso!' })
                    this.reset('cursos')
                })
                .catch(showError)
        },
        getCourse(id) {
            axios.get(`${baseApiUrl}/faculdade_curso/${id}`)
                .then(res => {
                    this.course = res.data
                    this.courseEdit = { ...res.data }
                })
                .catch(showError)
            this.changeMode('cursos', 'editar')
        },
        updateCourse(id) {
            axios.put(`${baseApiUrl}/faculdade_curso/${id}`, this.courseEdit)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Curso editado com sucesso!' })
                    this.reset('cursos')
                })
                .catch(showError)
        },
        deleteCourse(id) {
            axios.delete(`${baseApiUrl}/faculdade_curso/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Curso excluído com sucesso!' })
                    this.reset('cursos')
                })
                .catch(showError)
            this.$bvModal.hide(`confirm-del-course-${id}`)
        },
        registerBook() {
            axios.post(`${baseApiUrl}/faculdade_livro/${this.userId}`, this.book)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Livro cadastrado com sucesso!' })
                    this.reset('livros')
                })
                .catch(showError)
        },
        getBook(id) {
            axios.get(`${baseApiUrl}/faculdade_livro/${id}`)
                .then(res => {
                    this.book = res.data
                    this.bookEdit = { ...res.data }
                })
                .catch(showError)
            this.changeMode('livros', 'editar')
        },
        updateBook(id) {
            axios.put(`${baseApiUrl}/faculdade_livro/${id}`, this.bookEdit)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Livro editado com sucesso!' })
                    this.reset('livros')
                })
                .catch(showError)
        },
        deleteBook(id) {
            axios.delete(`${baseApiUrl}/faculdade_livro/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess({ msg: 'Livro excluído com sucesso!' })
                    this.reset('livros')
                })
                .catch(showError)
            this.$bvModal.hide(`confirm-del-book-${id}`)
        },
        changeMode(mode, action) {
            if(mode) {
                if(action) {
                    this.$router.push({ path: `/faculdade/${mode}/${action}` })
                } else {
                    this.$router.push({ path: `/faculdade/${mode}` })
                }
            }
        },
        reset(mode, action = null) {
            this.changeMode(mode, action)
            this.editPassword = {}
            this.course = { periodo: null }
            this.courseEdit = {}
            this.book = {}
            this.bookEdit = {}
            this.postEdit = {}
            this.loadFaculdade()
            this.loadPosts()
            this.loadCourses()
            this.loadBooks()
        },
        refreshPage() {
            window.location.reload()
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
        this.loadFaculdade()
        this.loadFollowers()
        this.loadPosts()
        this.loadCourses()
        this.loadBooks()
        this.dataReady = true
    }
}
</script>

<style>
    .profile .main-area .post-box {
        background-color: #FAFAFA;
        padding: 15px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        margin-bottom: 30px;
    }

    .profile .main-area .post-box .post-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .profile .main-area .post-box .post-container button {
        width: auto;
        margin-left: 15px;
    }

    .profile .main-area .custom-main-area button {
        font-size: 1.5rem;
    }

    .profile .main-area .button-posts {
        margin-bottom: 30px;
    }

    .profile .main-area .button-posts button {
        border-radius: 5px;
    }

    .profile .main-area .info-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        
        background-color: #FAFAFA;
        padding: 30px;
        margin-bottom: 30px;
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
        word-wrap: break-word; 
    }

    .profile .main-area .info-box .info-row:first-of-type {
        display: flex;
        align-items: flex-start;

        margin-left: 0px;
    }

    .profile .main-area .info-box .info-row:first-of-type .image-profile img {
        width: 70px;
        height: 70px;
        margin-left: 5px;
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

    .profile .main-area .post-box .info-row {
        display: flex;
        flex-direction: row;
    }

    .profile .main-area .post-box .info-row i {
        font-size: 3rem;
    }

    .profile .main-area .post-box .info-row .info-post {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .profile .main-area .post-box .content-box {
        background-color: #FFF;
        padding: 15px;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .profile .main-area .post-box .content-box p {
        margin: auto;
    }

    .profile .main-area .post-box .post-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: #FFF;
        margin: 15px auto 15px auto;
        padding: 5px 15px 5px 15px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 10px;
    }

    .profile .main-area .post-box .post-actions .action-post:hover {
        color: #3A65DB;
        cursor: pointer;
    }

    .profile .main-area .post-box .post-actions i {
        margin-right: 5px;
        font-size: 1.4rem;
    }

    .profile .main-area .post-box .comment-box {
        display: flex;
        flex-direction: row;

        background-color: #FFF;
        padding: 15px;
        margin-bottom: 15px;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .profile .main-area .post-box .comment-box:last-of-type {
        margin-bottom: 0px;
    }

    .profile .main-area .post-box .comment-box i {
        margin-top: 5px;
        font-size: 2.5rem;
    }

    .profile .main-area .post-box .comment-box .comment-content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
</style>