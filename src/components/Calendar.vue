<template>
    <div class="wrap">
        <div class="wrap_calendar">
            <div class="calendar">
<!--                {{ objDate }}-->
                <div class="calendar_head">
                    <span class="calendar_head__date">{{ getNowMonth }} {{ getNowDay }}</span> <span class="calendar_head__year">{{ getNowYear }}</span>
                </div>
                <div class="calendar_btns">
                    <button v-on:click="moveBack">&lt;</button>
                    <ul class="weekdays">
                        <li v-for="(weekday, i) in daysName" :key="i">{{ weekday }}</li>
                    </ul>
                    <button v-on:click="moveNext">&gt;</button>
                </div>
                <ul class="calendar_cells">
                    <li v-for="(emptyDay, emptyDayIndex, ii) in daysNumber" :key="ii">

                    </li>
                    <Cell v-for="(dayNumber, day, i) in realDays"
                          :key="i"
                          v-bind:day="day"
                          v-bind:nowDay="getNowDay"
                          v-bind:changedMonth="returnMonth"
                          v-bind:dayNumber="dayNumber"
                          @pickDay="pickDay"
                    />
                </ul>
            </div>
            <div class="weatherNtodo">
                <Weather/>
                <ToDo v-bind:months="this.month"
                      v-bind:daysName="this.daysName"
                      v-bind:dataNow="this.dataNow"
                      v-bind:pickedDay="pickedDay"
                />
            </div>
        </div>
    </div>
</template>
<script>
    import Cell from "@/components/Cell";
    import Weather from "@/components/Weather";
    import ToDo from "@/components/ToDo";
    export default {
        name: "Calendar",
        components:{
          Cell, Weather, ToDo
        },
        data(){
            return{
                dataNow: new Date(),
                daysName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                objDate: new Date(),
                dayNow: function () {
                    return this.objDate.getDate();
                },
                numberOfWeekDay: function () {
                    return this.objDate.getDay();
                },
                days: 31,
                leapYear:[],
                realDays:{},
                changeMonth: new Date().getMonth(),
                changeYear: new Date().getFullYear(),
                changeDay: new Date().getDate(),
                isThatMonth: true,
                daysNumber: [],
                // Данные для ToDo component
                pickedDay: []
            }
        },
        methods: {
          // returnLocalDate: function () {
          //     setInterval(() =>{
          //        this.dataNow = new Date()
          //     }, 1000)
          // }
            //
            hi(){
                console.log('Hi Mark');
            },
            // Меняем состояние isThatMonth
            checkRealMonth(){
                if (this.dataNow.getMonth() !== this.objDate.getMonth() || this.dataNow.getFullYear() !== this.objDate.getFullYear()){
                    this.isThatMonth = false;
                }else{
                    this.isThatMonth = true;
                }
            },
            // Функция для кнопки "вперед" для смены месяца +
            moveNext(){
                //Получаем месяц
                let getNumberMonth = this.objDate.getMonth();

                // Меняем год
                if (getNumberMonth === 11){
                    getNumberMonth = -1;

                    // Получаем год
                    let getYear = this.objDate.getFullYear();

                    // Увеличиваем год
                    let newYear = ++getYear;

                    // Устанавливаем новый год
                    this.objDate.setFullYear(newYear);

                    // Меняем состояние data
                    this.changeYear = newYear;
                }

                //Увеличиваем месяц
                let newMonth = ++getNumberMonth;

                // Устанавливаем новый месяц
                this.objDate.setMonth(newMonth);

                // Меняем состояние data
                this.changeMonth = newMonth;

                // Меняем месяц, соответсвенно меняем дату на 1
                this.objDate.setDate(1);
                this.changeDay = this.objDate.getDate();

                // Получем сколько дней в месяце
                this.getDaysInMonth();

                // Меняем состояние isThatMonth
                this.checkRealMonth();

                // Опредляем день недели для кажого числа
                this.whatNumberHasDay(this.dayNow(), this.numberOfWeekDay(), this.days);

                // Меняем дату обратно, если это сегодняшний месяц, год
                if (this.isThatMonth){
                    this.objDate.setDate(this.dataNow.getDate());
                    this.changeDay = this.objDate.getDate();
                }
            },

            // Функция для кнопки "назад" для смены месяца -
            moveBack(){
                //Получаем месяц
                let getNumberMonth = this.objDate.getMonth();
                // console.log('Месяц который был ' + getNumberMonth);
                // Меняем год
                if (getNumberMonth === 0){
                    getNumberMonth = 12;
                    // Получаем год
                    let getYear = this.objDate.getFullYear();

                    // Увеличиваем год
                    let newYear = --getYear;

                    // Устанавливаем новый год
                    this.objDate.setFullYear(newYear);

                    // Меняем состояние data
                    this.changeYear = newYear;
                }

                //Уменьшаем месяц
                let newMonth = --getNumberMonth;
                // console.log('Месяц который стал ' + newMonth);

                // Меняем месяц, соответсвенно меняем дату на 1
                this.objDate.setDate(1);
                this.changeDay = this.objDate.getDate();

                // Устанавливаем новый месяц
                this.objDate.setMonth(newMonth);
                // console.log(this.objDate.getMonth() + ' Это новый месяц!!!!!')

                // Меняем состояние data
                this.changeMonth = newMonth;

                // Получем сколько дней в месяце
                this.getDaysInMonth();

                // Меняем состояние isThatMonth
                this.checkRealMonth();

                // Опредляем день недели для кажого числа
                this.whatNumberHasDay(this.dayNow(), this.numberOfWeekDay(), this.days);

                if (this.isThatMonth){
                    this.objDate.setDate(this.dataNow.getDate());
                    this.changeDay = this.objDate.getDate();
                }

            },

            // Получаем какое кол-во дней в месяце
            getDaysInMonth(){
                for (let i = 0; i < this.month.length; i++) {

                    // Если номер месяца такой-то и он итая мешьше 6..
                    if (this.objDate.getMonth() ===  i && i <= 6) {

                        // Если февраль
                        if (i === 1) {

                            // Определяем висосный ли год
                            for (let ye of this.leapYear) {
                                if (ye === this.objDate.getFullYear()){
                                    this.days = 29;
                                    break;
                                }else{
                                    this.days = 28;
                                }
                            }
                            break
                        }

                        i % 2 === 0 ? this.days = 31 : this.days = 30;

                    }
                    // Если номер месяца такой-то и он итая больше 7..
                    if (this.objDate.getMonth() === i && i >= 7){
                        // console.log(this.objDate.getMonth() + ' Номер месяца')
                        i % 2 === 0 ? this.days = 30 : this.days = 31;
                    }
                }
                // console.log('Поменявшиеся дни в месяце ' + this.days)
                // console.log(this.dayNow() + ' Какой день сегодня')
                // console.log(this.numberOfWeekDay() + ' Какой день недели сегодня')
            },

            // Опредляем день недели для кажого числа
            whatNumberHasDay(realDay, realNumber, days){
                let temporaryArr = [];
                if (realDay === 1){
                    console.log(days + " Это дни которые показывает")
                    //Очищаем дни
                    this.realDays = {};
                    for (let day = 1, dayNumber = realNumber; day <= days; day++, dayNumber++){

                        if (dayNumber === 7){
                            dayNumber = 0;
                        }
                        this.realDays[day] = dayNumber;
                    }
                }else {
                    for (let day = realDay, dayNumber = realNumber; day > 0; day--, dayNumber--){

                        if (dayNumber === -1){
                            dayNumber = 6;
                        }
                        let newDayNewNumber = [];
                        newDayNewNumber.push(day);
                        newDayNewNumber.push(dayNumber);
                        temporaryArr.push(newDayNewNumber);

                    }
                    this.realDays = Object.fromEntries(temporaryArr.reverse());
                    for (let day = realDay, dayNumber = realNumber; day <= days; day++, dayNumber++){

                        if (dayNumber === 7){
                            dayNumber = 0;
                        }
                        this.realDays[day] = dayNumber;

                    }
                }
            },

            // Методы для Cell
            pickDay(day, dayNumber){
                if (this.pickedDay.length > 0){
                    this.pickedDay.splice(0, 6);
                }
                dayNumber === 0 ? dayNumber = 7 : dayNumber;
                const storageData = this.$store.getters.doList;
                let someDo = false;
                let listOfDo = [];
                if (storageData.length){
                    for (let i in storageData){
                        if (storageData[i][0].month === this.changeMonth && storageData[i][0].day === +day && storageData[i][0].year === this.getNowYear){
                            someDo = true;
                            listOfDo.push(storageData[i][1]);
                        }
                    }
                }
                this.pickedDay.push(this.changeMonth, +day, dayNumber, this.getNowYear, someDo, listOfDo);
            },

        },
        created(){
            // Определяем сколько дней в данном месяце, пока шаблон еще не скомпилирован
            let year = 2000;
            while (year < 2096) {
                this.leapYear.push(year);
                year += 4;
            }
            // Определяем сколько дней в месяце
            this.getDaysInMonth();

            // Опредляем день недели для кажого числа
            this.whatNumberHasDay(this.dayNow(), this.numberOfWeekDay(), this.days);

            // Смотрим есть ли в Vuex aka storage.js что-нибудь из данных
            if (this.$store.getters.doList.length){
                const storageData = this.$store.getters.doList;
                let someDo = false;
                let listOfDo = [];
                if (storageData.length){
                    for (let i in storageData){
                        if (storageData[i][0].month === this.changeMonth && storageData[i][0].day === this.dayNow() && storageData[i][0].year === this.getNowYear){
                            someDo = true;
                            listOfDo.push(storageData[i][1]);
                        }
                    }
                }
                this.pickedDay[4] = someDo;
                this.pickedDay[5] = listOfDo;
            }

        },
        computed:{
            getNowMonth:{
                get(){
                    // return this.month[this.changeMonth(this.objDate.getMonth())];
                    return this.month[this.changeMonth];
                },
                //Если свойство changeMonth поменялось, то set устанавливает новое, а get, тот что выше, вовзращает его
                set(val){
                    this.changeMonth = val
                }
            },
            returnMonth:{
              get(){
                  return this.isThatMonth;
              },
               set(val){
                  this.isThatMonth = val
               }
            },
            getNowDay:{
                get(){
                    return this.changeDay;
                },
                set(val){
                    this.changeDay = val;
                }
            },
            getNowYear:{
                get() {
                    return this.changeYear;
                },
                set(val) {
                    this.changeYear = val;
                }
            }
        },
        watch: {
            realDays: function (val) {
                // Заполняем пустые значения, чтобы поставить постые пробелы в начале месяца
                this.daysNumber = [];
                if (val[1] !== 1 && val[1] !== 0){
                    for (let i = 1; i < val[1]; i++){
                        this.daysNumber.push('');
                    }
                }
                if (val[1] === 0){
                    for (let i = 1; i < 7; i++){
                        this.daysNumber.push('');
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;700&display=swap');
    #app{
        height: 100vh;
    }
    body{
        background: linear-gradient(90deg, rgba(36,31,50,1) 0%, rgba(78,37,80,1) 100%);
        height: 100vh;
        /*overflow: hidden;*/
        color: $nonActive;
        font-family: 'Ubuntu', sans-serif;
    }
    .wrap{
        height: 100%;
        .wrap_calendar{
            padding: 3%;
            height: 100%;
            box-sizing: border-box;
            @extend %flex-between;
            .calendar{
                width: 59%;
                height: 100%;
                .calendar_head{
                    @extend %flex-between;
                    @include changedBorder(bottom);
                    padding-bottom: 3%;
                    &__date{
                        @include highlighting(700, 24px);
                        cursor: pointer;
                    }
                    &__year{
                        @include highlighting(700, 24px);
                    }
                }
                &_btns{
                    display: grid;
                    grid-template-columns: min-content 1fr min-content;
                    grid-column-gap: 3%;
                    margin: 26px 0;
                    button{
                        border: none;
                        background:none;
                        cursor: pointer;
                        color: $activeWhite;
                        font-size: 26px;
                    }
                    .weekdays{
                        @extend %list-drop;
                        @extend %flex-between;
                        margin: auto 0;
                    }
                }
                &_cells{
                    display: grid;
                    height: 100%;
                    grid-template-columns: repeat(7, 1fr);
                    @extend %list-drop;
                    li{
                        justify-self: center;
                    }
                }
            }
            .weatherNtodo{
                width: 39%;
            }
        }
    }
</style>
