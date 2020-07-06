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
        },
        changeDoTime(state, changedTime){
            for (let i in state.doList){
                if (state.doList[i][1].id === changedTime.id){
                    state.doList[i][1].time = changedTime.newValue;
                }
            }
            localStorage.setItem('doList', JSON.stringify(state.doList))
        },
        mutateComplete(state, newCompl){
            for (let i in state.doList){
                if (state.doList[i][1].id === newCompl.id){
                    state.doList[i][1].completed = newCompl.newValue;
                }
            }
            localStorage.setItem('doList', JSON.stringify(state.doList));
        },
        mutateText(state, newText){
            for (let i in state.doList){
                if (state.doList[i][1].id === newText.id){
                    state.doList[i][1].action = newText.newValue;
                }
            }
            localStorage.setItem('doList', JSON.stringify(state.doList));
        },
        mutateClear(state, deletedElms){
            console.log(deletedElms)
            for (let i in state.doList){
                for (let k in deletedElms){
                    if (state.doList[i][1].id === deletedElms[k]){
                        state.doList.splice(i, 1);
                    }
                }
            }
            localStorage.setItem('doList', JSON.stringify(state.doList));
        }
    },
    actions:{
        createDo({commit}, resultDataForStorage){
            commit('createDo', resultDataForStorage);
        },
        changeDoTime({commit}, newTime){
            commit('changeDoTime', newTime)
        },
        changeDoComplete({commit}, newCompl){
            commit('mutateComplete', newCompl);
        },
        changeDoText({commit}, newText){
            commit('mutateText', newText);
        },
        clearStorage({commit}, deletedElms){
            commit('mutateClear', deletedElms);
        }
    },
    getters:{
        doList: (state) => {
            return state.doList;
        }
    }
})