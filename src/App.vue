<template>
    <div id="app">
        <Header :hideHeader="!user" />
        <Content />
    </div>
</template>

<script>
import axios from "axios"
import { baseApiUrl, userKey } from "@/global"
import { mapState } from "vuex"

import Header from './components/template/Header'
import Content from './components/template/Content'

export default {
    name: 'App',
    components: {
        Header,
        Content
    },
    computed: mapState(['user']),
    methods: {
        async validateToken() {
            this.validateToken = true

			const json = localStorage.getItem(userKey)
			const userData = JSON.parse(json)
			this.$store.commit('setUser', null)

			if(!userData) {
                this.validatingToken = false
				this.$router.push({ name: 'auth' })
				return
			}

            const res = await axios.post(`${baseApiUrl}/validateToken`, userData)
            
            if(!res.data) {
                localStorage.removeItem(userKey)
                this.$router.push({ name: 'auth' })
            }
            
			if(res.data) {
                this.$store.commit('setUser', userData)
			} else {
                localStorage.removeItem(userKey)
				this.$router.push({ name: 'auth' })
			}
        },
    },
    async created() {
        await this.validateToken()
    }
}
</script>

<style>
    @font-face {
        font-family: Roboto;
        src: url('./assets/font/Roboto-Regular.ttf');
    }

    @font-face {
        font-family: Script-MT;
        src: url('./assets/font/Script-MT-bold.ttf');
    }

	body {
		margin: 0px;
	}

    #app {
        font-family: Roboto, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #332A2A;
        height: 100vh;
    }

    ul li {
        margin-bottom: 10px;
    }

    .logo-text {
        font-family: Script-MT, Roboto, Arial, sans-serif;
        font-size: 3rem;
        font-weight: 600;
        color: #3A65DB;
    }

    .primary {
        color: #3A65DB;
    }

    .handwriting {
        font-family: Script-MT, Roboto, Arial, sans-serif;
    }

    .block-letter {
        font-family: Roboto, Arial, sans-serif;
    }

    ul {
        padding-left: 25px;
    }

    .btn-blue-rounded {
        background-color: #3A65DB;
        border-color: transparent;
        width: 100%;
        color: #FFF;
        border-radius: 30px;
    }

    .btn-transparent-rounded {
        background-color: transparent;
        border-color: -internal-light-dark(black, white);;
        width: 100%;
        color: #332A2A;
        border-radius: 30px;
    }

    .data-input {
        background-color: #FAFAFA;
        color: #332A2A;
        border-radius: 10px;
        border: 1px solid #BBB;
        width: 100%;
        padding: 5px 10px;
        margin-bottom: 15px;
        outline: none;
    }

    .profile {
        display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		grid-template-areas:
			"left-area main-area right-area";
    }

    .profile i {
        margin-right: 15px;
        font-size: 1.5rem;
    }

    .left-area {
        grid-area: left-area;
        padding: 0px 30px;

    }

    .main-area {
        grid-area: main-area;
    }

    .right-area {
        grid-area: right-area;
        padding: 0px 30px;
    }

    .side-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-self: center;
        background-color: #FAFAFA;
        border: 1px solid rgba(0, 0, 0, 0.2);
        padding: 15px;
        margin-bottom: 30px;
    }

    .side-box-header {
        display: flex;
        align-items: center;
        align-self: center;
        margin-bottom: 30px;
    }

    .side-box-content {
        display: flex;
        align-items: center;
        align-self: center;
    }

    @media (max-width: 992px) {
        .profile {
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

        .side-box {
            align-items: center;
            align-self: center;
        }

        .side-box-content {
            align-self: center;
        }
    }

    @media (max-width: 767px) {
        .profile {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-areas:
                "main-area"
                "left-area"
                "right-area";
        }
    }

    .left-area .side-box-content.user-info, 
    .right-area .side-box-content.user-info {
        margin-bottom: 15px;
        word-break: break-all;
    }

    .left-area .side-box-content a, 
    .right-area .side-box-content a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #332A2A;
        margin-bottom: 5px;
        padding: 5px 5px;
    }

    .left-area .side-box-content a .image-profile img, 
    .right-area .side-box-content a .image-profile img {
        height: 40px;
        width: 40px;
    }

    .left-area .side-box-content a:hover, 
    .right-area .side-box-content a:hover {
        text-decoration: none;
        color: #000;
        background-color: #EDEDED;
    }

    .row-perfis a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #332A2A;
        margin-bottom: 5px;
        padding: 5px 5px;
    }

    .row-perfis i{
        font-size: 2rem;
        margin-right: 10px;
    }

    .row-perfis a:hover {
        text-decoration: none;
        color: #000;
        background-color: #EDEDED;
    }

    .modal-comments {
        background-color: #F0F0F0;
        padding: 15px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        margin-bottom: 15px;
    }

    .modal-comments a,
    .modal-comments a:hover {
        text-decoration: none;
        color: #332A2A;
    }

    .modal-comments span p {
        margin-bottom: auto;
    }

    .modal-comments .info-row.answer {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .modal-comments .info-row i {
        font-size: 3rem;
    }

    .modal-comments .info-row .info-post {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .modal-comments .comment-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 10px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        background-color: #FFF;
        word-wrap: break-word;
    }

    .modal-comments .comment-container textarea {
        margin-bottom: 0px;
        height: 45px;
        background-color: #FFF;
    }

    .modal-comments .comment-container textarea::placeholder {
        font-family: Script-MT, Roboto, Arial, sans-serif;
    }

    .modal-comments .comment-container button {
        width: auto;
        margin-left: 15px;
    }

    .modal-comments .comment-actions{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        background-color: #FFF;
        padding: 5px 15px;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .modal-comments .comment-actions .action-comment i {
        margin-right: 5px;
    }

    .modal-comments .comment-actions .action-comment:hover {
        color: #3A65DB;
        cursor: pointer;
    }

    .modal-comments .answer-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        padding: 15px;
        background-color: #FFF;
        border: 1px solid rgba(0, 0, 0, 0.2);
        font-size: 0.9rem;
    }

    .modal-comments .answer-container .info-row.answer .info-user {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .modal-comments .answer-container .info-row.answer i {
        margin-right: 5px;
        font-size: 2rem;
    }

    .modal-comments .answer-container .asnwer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        word-break: break-word;
        width: 100%;
        max-width: 50%;
        padding: 5px 10px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        background-color: #FFF;
    }

    i.icon-action {
        margin: 5px 5px 5px 5px;
        color:#332A2A;
        text-decoration: none;
    }

    i.icon-action:hover {
        color: #3A65DB;
        cursor: pointer;
    }

    i.icon-action.edit-icon {
        font-size: 1.3rem;
        color: #d9cd26;
    }

    i.icon-action.delete-icon {
        font-size: 1.3rem;
        color: #ed4020;
    }

    i.icon-action.edit-icon:hover {
        color: #332A2A;
    }

    i.icon-action.delete-icon:hover {
        color: #332A2A;
    }

    .ql-editor {
        max-width: 500px;
        font-family: Roboto, Arial, sans-serif;
    }

    .ql-editor.ql-blank {
        font-family: Script-MT, Roboto, Arial, sans-serif;
        font-size: 1.5rem;
    }

    .account-disabled {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    input.upload-image {
        display: none;
    }

    label.input-file-label {
        background-color: #3A65DB;
        color: #FFF;
        border-radius: 30px;
        font-size: 1rem;
        padding: 5px 15px;
        cursor: pointer;
    }

    .image-profile img {
        height: 50px;
        width: 50px;
        border-radius: 100%;
        margin-right: 10px;
    }
</style>
