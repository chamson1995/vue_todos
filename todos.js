let todos = {
    mounted:function() {
        //获取session中的todolist
        var list =  JSON.parse(localStorage.getItem("todolist"))
        this.lists = list?list:[];
    },
    watch: {
        //lists变化时写入session
        lists:{
            handler:function(list){
                localStorage.setItem("todolist",JSON.stringify(list))
            },
            deep:true
        }
    },
    data:function() {
        return {
            //列表数据
            /**
             * 长这样子
             * [
             *      {
             *          content: 内容,
             *          completed: Boolean
             *      },
             * ]
             */
            lists:this.value,
            //用type在模版中条件渲染
            type:0,//0待办 1已完成 2全部
        }
    },
    methods: {
        change:function(e){
            var index = e.target.getAttribute("index")
            var value = e.target.value
            this.lists[index].content = value
        },
        changeState:function(index){
            this.lists[index].completed = !this.lists[index].completed
        },
        add:function(){
            //在没有数据时,即使是空数组,这时候打印出来也是个Object
            if(this.lists=={}){
                //插入第一条数据后才会变成数组,以至于unshift()不可用
                this.lists = [{
                    content:"",
                    completed:false
                }]
            }else{
                this.lists.unshift({
                    content:"",
                    completed:false
                })
            }
            //新增一条空时 聚焦
            if(this.lists.length>0){
                document.querySelector(".todos input").focus()
            }
        },
        del:function(index){
            this.lists.splice(index,1)
        }
    },
    //模版<template>里的li里用v-if条件渲染
    template:`
            <div class="todos">
                <header>
                    <h3>chamson todos</h3>
                    <a v-if="type!=1" @click="add" >+</a>
                </header>
                <div class="body">
                    <ul class="actived">
                        <template v-for="item,index in lists" >
                            <li v-if="type==0 ? item.completed == false : (type == 1 ? item.completed ==true : true)">
                                <a @click="changeState(index)" class="icon" :class="{'done': item.completed}" >
                                    <span></span>
                                </a>
                                <span class="text" :class="{'done': item.completed}">
                                    <input v-if="item.completed" type="text" @input="change" :value="item.content" readonly="readonly" :index="index">
                                    <input v-else type="text" @input="change" :value="item.content" :index="index">
                                </span>
                                <a class="del" @click="del(index)"></a>
                            </li>
                        </template>
                    </ul>
                </div>
                <div class="bottom">
                    <div class="center">
                        <a @click="type=0" :class="{'active':type==0}">待办</a>
                        <a @click="type=1" :class="{'active':type==1}">已完成</a>
                        <a @click="type=2" :class="{'active':type==2}">全部</a>
                    </div>
                </div>
            </div>
    `
}
var vm = new Vue({
    el:"#app",
    components:{
        'todos':todos
    }
})