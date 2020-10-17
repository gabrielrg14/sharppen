<template>
    <div class="content" id="content">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'Content'
}
</script>

<style>
    .content {
        background-color: #FFF;
        padding-top: 40px;
        padding-bottom: 40px;
    }
</style>
