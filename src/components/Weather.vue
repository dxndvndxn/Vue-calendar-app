<template>
    <div class="weather">
        <div class="weather_location">Saint-Petersburg, RU</div>
        <div class="weather_temp">20 &#8451;</div>
        <div class="weather_name">Cloudy</div>
    </div>
</template>

<script>
    export default {
        name: "Weather"
    }
</script>

<style lang="scss" scoped>
    .weather{
        font-weight: 400;
        font-size: 18px;
        text-align: right;
        color: $nonActive;
        div{
            &:not(:first-child){
                margin-top: 1%;
            }
        }
    }
</style>