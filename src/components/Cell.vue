<template>
    <li v-if="day == nowDay" v-bind:class="[changedMonth ? activeClass : '']" v-on:click="$emit('pickDay',day,dayNumber)" class="day">
        {{ day }}
    </li>
    <li v-else v-on:click="$emit('pickDay',day,dayNumber)" class="day">
        {{ day }}
    </li>
</template>

<script>
    export default {
        name: "Cell",
        props:['day','nowDay','changedMonth','dayNumber'],
        data(){
            return{
                activeClass: 'active',
            }
        }
    }
</script>

<style lang="scss">
    .active{
        color: $ice;
    }
    .day{
        cursor: pointer;
    }
</style>