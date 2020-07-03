<template>
    <div class="wrap_todo">
        <div class="wrap_date" v-if="pickedDay.length">
            <span>To-do list on {{ months[pickedDay[0]] || months[dataNow.getMonth()]}} {{ pickedDay[1] || dataNow.getDate()}} {{ daysName[pickedDay[2] - 1] || daysName[dataNow.getDay() - 1]}}</span> <span>{{ pickedDay[3] || dataNow.getFullYear()}}</span>
        </div>
        <div class="wrap_date" v-else>
            <span>To-do list on {{ months[dataNow.getMonth()] }} {{ dataNow.getDate()}} {{ daysName[dataNow.getDay() - 1] }}</span> <span>{{ dataNow.getFullYear()}}</span>
        </div>
        <form @submit.prevent="addDo" class="todo">
            <div class="todo_in">
                <div class="wrap_time">
                    <input type="time" v-model="todoTime" @input="inputTime" id="todoTime" ref="todoTime" class="todo_time" v-bind:class="rTimeChanged ? 'activeTime' : ''">
                </div>
                <input type="text" v-model="todoAction" ref="todoText" class="todo_text">
                <button type="submit">Add</button>
            </div>
            <ul class="todo_out" v-if="pickedDay[4]">
                <li v-for="(todo, i) in pickedDay[5]" :key="i">
                    <input type="time" class="activeTime" v-bind:value="todo.time">
                    <input type="text" v-bind:value="todo.action">
                    <input type="checkbox" v-on:change="completeAction(i)" v-bind:ckecked="todo.completed">
                </li>
            </ul>
            <ul class="todo_out" v-if="todoData.length">
                <li v-for="(todo, i) in todoData" :key="i">
                    <input type="time" v-model="todoData[i].time" v-on:input="changeTime(i, todo.time)" v-bind:class="rTimeChanged ? 'activeTime' : ''">
                    <input type="text" v-model="todoData[i].action" v-on:focusout="changeText(i, todo.action)">
                    <input type="checkbox" v-on:change="completeAction(i)">
                </li>
            </ul>
        </form>
    </div>
</template>

<script>
    // import {mapGetters} from 'vuex'
    export default {
        name: "ToDo",
        // props:['months','daysName','dataNow','pickedDay'],
        props:{
          months: {
              type: Array
          },
          daysName: {
              type: Array
          },
          dataNow: {
              type: Date,
          },
          pickedDay: {
              type: Array
          }
        },
        data(){
            return{
                todoTime: null,
                todoAction: null,
                rTimeChanged: false,
                todoData:  [],
                pickedDayData: this.pickedDay
            }
        },
        methods:{
            addDo(){
                const dataToDo = {
                    time: this.todoTime,
                    action: this.todoAction,
                    completed: false
                };

                this.todoData.push(dataToDo);

                // Очищаем данные из инпутов
                this.todoTime = null;
                this.todoAction = null;
                this.rTimeChanged = false;

                const dataForStorage = {};
                if (this.pickedDayData.length){
                    dataForStorage.month = this.pickedDayData[0] || this.dataNow.getMonth();
                    dataForStorage.day = this.pickedDayData[1] || this.dataNow.getDate();
                    dataForStorage.dayName = this.pickedDayData[2] || this.dataNow.getDay();
                    dataForStorage.year = this.pickedDayData[3] || this.dataNow.getFullYear();
                }else{
                    dataForStorage.month = this.dataNow.getMonth();
                    dataForStorage.day = this.dataNow.getDate();
                    dataForStorage.dayName = this.dataNow.getDay();
                    dataForStorage.year = this.dataNow.getFullYear();
                }

                const resultDataForStorage = [];
                resultDataForStorage.push(dataForStorage, dataToDo);
                this.$store.dispatch('createDo', resultDataForStorage);
            },
            inputTime(){
                this.rTimeChanged = true;
            },
            completeAction(i){
                this.todoData[i].completed = true;
            },
            changeTime(i, newValue){
                this.todoData[i].time = newValue;
                this.rTimeChanged = true;
            },
            // changeTimeTodoOut(i, todo){
            //     console.log('Before' + todo)
            //     this.pickedDay[5][i].time = todo;
            //     console.log('After' + todo)
            // },
            changeText(i, newText){
                this.todoData[i].action = newText;
            }

        },
        watch: {
            pickedDayData: function () {
                this.todoData = [];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .activeTime{
        color: $nonActive !important;
    }
    .wrap_date{
        @extend %flex-between;
        margin: 11px 0;
        font-size: 24px;
        font-weight: 700;
        span{
            color: $activeWhite;
        }
    }
    h1{
    }
    .todo{
        margin-top: 3%;
        input{
            background: none;
            font-size: 21px;
            cursor: pointer;
            width: 100%;
            padding: 0;
        }
        &_in{
            @extend %grid-todo;
            margin-bottom: 5%;
        }
        &_time{
            color: transparent;
            border: none;
            @include changedBorder(bottom);
        }
        &_text{
            border: none;
            @include changedBorder(bottom);
            color: $nonActive;
        }
        button{
            border: 3px solid $purpp;
            background: none;
            color: $nonActive;
            padding: 1%;
            cursor: pointer;
        }
        .wrap_time{
            display: flex;
        }
        .todo_out{
            @extend %list-drop;
            li{
                @extend %grid-todo;
                margin-bottom: 3%;
                input{
                    border: none;
                    width: 100%;
                    color: $nonActive;
                    @include changedBorder(bottom);
                    &:nth-child(3){
                        justify-self: end;
                        align-self: end;
                        appearance: none;
                        height: 100%;
                        width: 35%;
                        border: 3px solid $purpp;
                        &:checked{
                            background-color: $ice;
                            border: none;
                        }
                    }
                }
            }
        }
    }
</style>