import Vue from 'vue'
import Vuex from  'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        doList: JSON.parse(localStorage.getItem('doList') || '[]')
    },
    mutations: {
        createDo(state, doIt){
            state.doList.push(doIt);
            localStorage.setItem('doList',JSON.stringify(state.doList));
        }
    },
    actions:{
        createDo({commit}, resultDataForStorage){
            commit('createDo', resultDataForStorage);
        }
    },
    getters:{
        doList: (state) => {
            return state.doList;
        }
    }
})