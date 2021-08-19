<template>
  <div>
    <div class="container">
      <div class="top" v-if="isLogin">
        <div class="msg">
          <img :src="avator" alt />
          <span>{{ name }}</span>
        </div>
      </div>
      <div class="top" v-else>
        <van-button type="primary" class="btn" @click="wxLogin"
          >微信登录</van-button
        >
      </div>
      <div class="title">默认地址</div>
      <div class="addressList">
        <div class="listLeft">
          <div class="name">
            <div class="phone">{{ address }}</div>
            <div class="namePhone">
              <span>联系人:{{ contactName }}</span>
              <span>联系电话:{{ phone }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="title">订单信息</div>
      <van-tabs v-model="active" animated @click="onClick">
        <van-tab v-for="(item, index) in tabs" :key="index" :title="item">
          <div class="scroll">
            <van-card
              v-for="(item, index) in goods"
              :key="index"
              :num="item.num"
              :price="item.price"
              :desc="item.desc"
              :title="item.title"
              :thumb="item.thumb"
              class="scroll"
            >
              <template #footer>
                {{ item.time }}
              </template>
            </van-card>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div style="height: 5rem;"></div>
    <van-tabbar v-model="active" route>
      <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/mine" icon="friends-o"
        >我的</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
import axios from "axios";
//import { setCookie, getCookie } from "../../utils/index";
import {
  Tag,
  Col,
  Icon,
  Cell,
  CellGroup,
  Swipe,
  SwipeItem,
  Radio,
  RadioGroup,
  Form,
  Field,
  Popup,
  Picker,
  Button,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  Card,
  NoticeBar,
} from "vant";
import {formMateDate} from '../../utils/index'
export default {
  data() {
    return {
      active: 0,
      isLogin: false,
      school: "桂林电子科技大学花江校区",
      building: "13栋",
      dormitory: "203",
      name: "何智鑫",
      phone: "18391053713",
      tabs: ["全部", "已发货", "未发货", "已收货"],
      baseUrl:'http://localhost:3000',
      thumb:['https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/bainuo/crop=0,24,800,484;w=720;q=79/sign=149fedb506338744888a753c6c3ff5cb/b3b7d0a20cf431ad2954f0dc4136acaf2fdd9855.jpg'],
      goods: [
     
      ],
    };
  },
  beforeMount() {
    const address = localStorage.getItem("address") || "";
    const contactName = localStorage.getItem("contactName") || "";
    const phone = localStorage.getItem("contactPhone") || "";
    this.address = address;
    this.contactName = contactName;
    this.phone = phone;
  },
  components: {
    [Tag.name]: Tag,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Field.name]: Field,
    [Form.name]: Form,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Button.name]: Button,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Card.name]: Card,
    [NoticeBar.name]: NoticeBar,
  },
  mounted() {
     let isURL = window.location.href.indexOf('code=') === -1;
     this.name = localStorage.getItem('name')|| '';
     this.avator = localStorage.getItem('avator')|| '';
     this.isLogin = localStorage.getItem('isLogin')||false;
    //是重定向回来
     if(!isURL && !localStorage.getItem('code')){
        this.code = this.getUrlCode().code; // 截取code
       this.getUserInfo().then(()=>{
          this.getList();
       });
        
     }  

     if(this.isLogin){
        this.getList();
     }
  },
  methods: {
    onClick(name, title) {
      console.log(name, title);
      name+=1;
      this.getList(name)
    },
    getList(orderStatus=1){
      
      axios.get(this.baseUrl+'/order/list',{
         params:{
            wxid:localStorage.getItem('token'),
            orderStatus,
            type:'CLIENT_CHECK'
         }
      }).then(res=>{
         this.goods = [];
         res.data.data.list.map((item,index)=>{
            this.goods.push({
               id: index,
               title: item.orderGoods,
               desc:  item.orderNumber,
               price:item.price*(item.goodsCount||2),
               num:item.goodsCount||2,
               time:formMateDate(item.meta.createTime),
               thumb:item.goodImgUrl||this.thumb[0]
            })
         })
      })
    },
    wxLogin() {
      // 非静默授权，第一次有弹框
      this.code = "";
      var local = window.location.href; // 获取页面url
      var appid = "wxe53f9dcbd1582367";
     

      if (this.code == null || this.code === "") {
        // 如果没有code，则去请求
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
          local
        )}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
      }
    },

    async getUserInfo() {
      
      const res = await axios.post(this.baseUrl+"/wechat/login", {
        code: localStorage.getItem('code')||this.code,
      });

      this.name = res.data.data.name;
      this.avator = res.data.data.avator;
      this.isLogin = true;
      
      localStorage.setItem('name',this.name);
      localStorage.setItem('avator',this.avator);
      localStorage.setItem('isLogin',true);
      localStorage.setItem('code',this.code)
      localStorage.setItem('token',res.data.data.wechat.openid)
    },

    getUrlCode() {
      // 截取url中的code方法
      var url = location.search;
      this.winUrl = url;
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
      }
      return theRequest;
    },
  },
};
</script>

<style lang="less">
.scroll {
  overflow: scroll;
}
.container {
  overflow: scroll;
}
.title {
  font-weight: bold;
  margin-left: 5px;
  margin-top: 5px;
}
.addressList {
  padding: 5px 11px;
  margin-top: 9px;
  background: white;
}
.listLeft {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.name {
  width: 100%;
  line-height: 60px;
  border-bottom: 2px #f2f2f2 solid;
  border-top: 2px #f2f2f2 solid;
}
.namePhone {
  display: flex;
  color: #999;
  justify-content: space-between;
  padding-bottom: 20px;
}
.top {
  width: 100%;
  height: 150px;
  background-color: #449ffa;
}
.btn {
  position: relative;
  left: 40%;
  top: 40%;
}
.van-button--primary {
  background-color: #07c160 !important;
  border: 1px solid #07c160;
}
.msg {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.msg img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.msg span {
  margin-top: 5px;
  font-weight: bold;
}
</style>
