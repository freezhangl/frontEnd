import Vue from 'vue'
import VueResource from 'vue-resource'
import store from '../store/index'
import { stringify } from 'qs'
import config from '../config/index'
Vue.use(VueResource)
Vue.http.interceptors.push(function (request, next) {
    if (store.state.authInfo.accountId) {
        request.headers.set('account-id', store.state.authInfo.accountId)
    }
    if (store.state.authInfo.accessToken) {
        request.headers.set('access-token', store.state.authInfo.accessToken)
        config.headers['access-token'] = store.state.authInfo.accessToken;
    }
    if (store.state.authInfo.deviceType) {
        request.headers.set('device-type', store.state.authInfo.deviceType)
    }
    next(function (response) {
        return response
    });
})

export function request(url, options={}) {
    let type = options.type || 'get'
    if(type == 'get'){
        return new Promise((resolve, reject) => {
            Vue.http.get(url,{params:options.params})
                .then(data => data.body)
                .then((data) => {
                    if(data.code == 200){
                        resolve(data.data)
                    }else{
                        reject(data)
                    }
                }).catch(data => reject(data))
        })
    }
}



export default VueResource