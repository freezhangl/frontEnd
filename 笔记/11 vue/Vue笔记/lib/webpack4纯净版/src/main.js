import $ from 'jquery'
import './css/index.css'
import './css/index.less'
import './css/index.scss'
import 'bootstrap/dist/css/bootstrap.css'

$(function(){
    $('li:odd').css('background','lightgreen')
    $('li:even').css('background','yellow')
})

class Person{
   static info={
       name:'zhangsan'
   }
   showInfo(){
       console.log('hha')
    //    console.log(Person.info.name)
   }
}
let p1=new Person()
p1.showInfo()