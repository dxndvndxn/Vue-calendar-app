<template>
    <div class="wrap_todo">
        <div class="wrap_date" v-if="pickedDay.length">
            <span>To-do list on {{ months[pickedDay[0]] || months[dataNow.getMonth()]}} {{ pickedDay[1] || dataNow.getDate()}} {{ daysName[pickedDay[2] - 1] || dataNow.getDay() === 0 ? daysName[6] : daysName[dataNow.getDay() - 1]}}</span> <span>{{ pickedDay[3] || dataNow.getFullYear()}}</span>
        </div>
        <div class="wrap_date" v-else>
            <span>To-do list on {{ months[dataNow.getMonth()] }} {{ dataNow.getDate()}} {{ dataNow.getDay() === 0 ? daysName[6] : daysName[dataNow.getDay() - 1] }}</span> <span>{{ dataNow.getFullYear()}}</span>
        </div>
        <form @submit.prevent="addDo" class="todo">
            <div class="todo_in">
                <div class="wrap_time">
                    <input type="time" v-model="todoTime" @input="inputTime" id="todoTime" ref="todoTime" class="todo_time" v-bind:class="rTimeChanged ? 'activeTime' : ''">
                </div>
                <input type="text" v-model="todoAction" ref="todoText" class="todo_text">
                <button type="submit">Add</button>
            </div>
            <ul class="todo_out" data-from="from-vuex" v-if="pickedDay[4]">
                <li v-for="(todo, i) in pickedDayData[5]" :key="i">
                    <input type="time" class="activeTime" v-model="pickedDayData[5][i].time" v-on:focusout="changeTimeTodoOut(i, todo.time)">
                    <input type="text" v-model="pickedDayData[5][i].action" @focusout="changeTextOut(i, todo.action)">
                    <input type="checkbox" @change="completeActionOut(i)" v-bind:ckecked="todo.completed" v-model="pickedDayData[5][i].completed">
                </li>
            </ul>
            <ul class="todo_out" v-if="todoData.length">
                <li v-for="(todo, i) in todoData" :key="i">
                    <input type="time" v-model="todoData[i].time" v-on:focusout="changeTime(i, todo.time)" v-bind:class="rTimeChanged ? 'activeTime' : ''">
                    <input type="text" v-model="todoData[i].action" v-on:focusout="changeText(i, todo.action)">
                    <input type="checkbox" @change="completeAction(i)" v-model="todoData[i].completed" v-bind:checked="todo.completed">
                </li>
            </ul>
            <div class="todo_clear" v-if="todoData.length || pickedDay[4]">
                <button type="button" @click="clearDeal">Clear</button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "ToDo",
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
                pickedDayData: this.pickedDay || [],
                pickedDay5: this.pickedDay[5] || null,
                tempForDisp: (id, newValue) => {
                    return {
                        id,
                        newValue
                    }
                }
            }
        },
        methods:{
            addDo(){
                let localStore = this.$store.getters.doList;
                let idd = localStore.length ? localStore[localStore.length - 1][1].id : null;
                let dataToDo = {
                    time: this.todoTime,
                    action: this.todoAction,
                    completed: false,
                    // id: localStore.length !== 0 ? ++id : 0
                    id: localStore.length !== 0 ? ++idd : 0
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

            // Меня состояние даты на тру, чтобы отображались цифры при вводе нового задания (время)
            inputTime(){
                this.rTimeChanged = true;
            },

            completeAction(i){
                this.$store.dispatch('changeDoComplete', this.tempForDisp(this.todoData[i].id, this.todoData[i].completed));
            },

            // Меняем комплит, которое отображается через vuex
            completeActionOut(i){
                this.$store.dispatch('changeDoComplete', this.tempForDisp(this.pickedDay[5][i].id, this.pickedDay[5][i].completed));
            },

            //Меняем время только что добавленное дело
            changeTime(i, newValue){
                this.todoData[i].time = newValue;
                this.$store.dispatch('changeDoTime', this.tempForDisp(this.todoData[i].id, newValue));
            },

            // Меняем время, которое отображается из vuex
            changeTimeTodoOut(i, todo){
                this.pickedDay[5][i].time = todo;
                this.$store.dispatch('changeDoTime', this.tempForDisp(this.pickedDayData[5][i].id, todo));
            },

            // Меняем текст только что добалвенный
            changeText(i, newText){
                this.todoData[i].action = newText;
                this.$store.dispatch('changeDoText', this.tempForDisp(this.todoData[i].id, newText))
            },

            // Меняем текст, которое отображается из vuex
            changeTextOut(i, newText){
                this.pickedDay[5][i].action = newText;
                this.$store.dispatch('changeDoText', this.tempForDisp(this.pickedDayData[5][i].id, newText));
            },

            // Очистить выбранное только что добавленное
            clearDeal(){
                let clearData = [];
                if (this.todoData.length){
                    for (let i in this.todoData){
                        if (this.todoData[i].completed){
                            clearData.push(this.todoData[i].id)
                        }
                    }
                    for (let i in this.todoData){
                        for (let cl in clearData){
                            if (clearData[cl] === this.todoData[i].id){
                                this.todoData.splice(i, 1)
                            }
                        }
                    }
                }
                if (this.pickedDayData[4]){
                    for (let i in this.pickedDayData[5]){
                        if (this.pickedDayData[5][i].completed){
                            clearData.push(this.pickedDayData[5][i].id)
                        }
                    }
                    let new5 = () => {
                        for (let cl in clearData){
                            for (let i in this.pickedDayData[5]){
                                if (clearData[cl] === this.pickedDayData[5][i].id){
                                    this.pickedDayData[5].splice(i, 1)
                                }
                            }
                        }
                        return this.pickedDayData[5];
                    }
                    console.log(this.pickedDayData[5]);
                    this.pickedDayData = [this.pickedDayData[0], this.pickedDayData[1], this.pickedDayData[2], this.pickedDayData[3], this.pickedDayData[4], new5()];
                    console.log(this.pickedDayData[5]);
                    // console.log(this.pickedDayData + ' From ToDo')
                    // console.log(this.pickedDayData[5])
                    // this.pickedDayData[5] = this.pickedDayData[5].filter(el => el.completed !== true);
                    // this.pickedDayData = this.pickedDayData.map((item, i) => {
                    //     console.log(i)
                    // })

                }
                this.$store.dispatch('clearStorage', clearData);
            }

        },
        watch: {
            pickedDayData: function () {
                this.todoData = [];
                this.pickedDayData = this.pickedDay;
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
        .todo_clear{
            @extend %flex-between;
            button{
                width: 100px;
            }
        }
    }
</style>