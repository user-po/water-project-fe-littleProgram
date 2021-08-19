<template>
  <div>
    <div class="goods">
      <van-swipe class="goods-swipe">
        <van-swipe-item>
          <img src="../../../src/assets/1.jpg" />
        </van-swipe-item>
      </van-swipe>
      <van-notice-bar
        left-icon="volume-o"
        :text="text"
        scrollable
      />
      <!-- <van-cell-group>
        <van-cell>
          <div class="box">
            <div class="goods-title">{{ intro.title }}</div>
            <div class="desc">{{ intro.content1 }}</div>
            <div class="desc">{{ intro.content2 }}</div>
            <div class="phone">{{ intro.content3 }}</div>
          </div>
        </van-cell>
      </van-cell-group> -->

      <div class="box">
        <div class="goods-title water">请选择桶装水型号</div>
        <van-radio-group
          class="card-goods"
          v-model="radio"
          direction="horizontal"
        >
          <van-radio
            v-for="(item,index) in goods"
            :key="item._id"
            :name="index"
            shape="square"
          >
            {{ item.name }}
          </van-radio>
        </van-radio-group>
      </div>
      <div class="box">
        <div class="goods-title water">请填写地址信息(只需填写一次)</div>
        <van-field
          readonly
          clickable
          name="picker"
          label="高校名称:"
          placeholder="请输入学校名称"
          v-model="value"
          @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="onConfirm"
            @cancel="showPicker = false"
          >
          </van-picker>
        </van-popup>
        <van-field v-model="building" label="楼号:">
          <template #button>
            栋
          </template>
        </van-field>
        <van-field v-model="dormitory" label="房间号:"> </van-field>
        <!-- 输入任意文本 -->
        <van-field v-model="name" label="联系人姓名:" />
        <!-- 输入手机号，调起手机号键盘 -->
        <van-field v-model="phone" type="tel" label="联系人电话:" />
        <van-field
          v-model="message"
          rows="2"
          autosize
          label="备注:"
          type="textarea"
          maxlength="50"
          placeholder="请输入备注"
          show-word-limit
        />
      </div>
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        @click="handleOrder"
        >下单</van-button
      >
    </div>
    <van-tabbar v-model="active" route>
      <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/mine" icon="friends-o"
        >我的</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
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
  NoticeBar,
  Toast
} from "vant";
import axios from 'axios';
export default {
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
    [NoticeBar.name]: NoticeBar,
    [Toast.name]:Toast
  },

  data() {
    return {
      radio: "1",
      value: "",
      dormitory: "",
      building: "",
      name: "",
      phone: "",
      message: "",
      active: 0,
      columns: ["桂林电子科技大学花江校区", "桂林电子科技大学金鸡岭校区"],
      price:[10,20],
      showPicker: false,
      form:{},
      baseUrl:'http://112.74.54.65',
      text:"",
      goods: [

      ],
      config:{
        APPID: 'wxe53f9dcbd1582367',
        REDIRECT_URL:'http://localhost:8081/'
      },
      intro: {
        title: "桶装水订购基本说明",
        content1: "1.每次订单固定2桶，以桶换桶",
        content2: "2.此平台为官方制作，如有疑问可联系平台",
        content3: "联系电话：18391053713",
        remain: 19,
        thumb: ["../../../src/assets/1.jpg"],
      },
    };
  },
  mounted(){
     this.getMsg();
      this.getGoods()
     
  },
  beforeMount() {
   
    const school = localStorage.getItem("school") || "";
    const building = localStorage.getItem("building") || "";
    const dormitory = localStorage.getItem("dormitory") || "";
    const name = localStorage.getItem("contactName") || "";
    const phone = localStorage.getItem("contactPhone") || "";
    this.value = school;
    this.building = building;
    this.dormitory = dormitory;
    this.name = name;
    this.phone = phone;
  },
  methods: {
     getMsg(){
     axios.get(this.baseUrl+'/message/list',{
       params:{
           show:true
       }
     }).then((data)=>{
        this.text = data.data.data.list[0].message
     })

   
   },
   getGoods(){
     axios.get(this.baseUrl+'/goods/list').then(data=>{
         
         this.goods = data.data.data.list
     })
   },
    onConfirm(value) {
      
      this.value = value;
      this.showPicker = false;
    },
    addOrder(){
      let isLogin = localStorage.getItem('isLogin')
      if(isLogin){
          axios.post(this.baseUrl+'/order/add',this.form).then(()=>{
                  Toast.success('下单成功')
                })
      }else{
          Toast.fail('请先登录')
      }
   
    },
    handleOrder() {
      console.log(this.goods[this.radio]['price'])
      localStorage.setItem(
        "address",
        `${this.value}${this.building}栋${this.dormitory}`
      );
      localStorage.setItem("school", this.value);
      localStorage.setItem("building", this.building);
      localStorage.setItem("dormitory", this.dormitory);
      localStorage.setItem("contactName", this.name);
      localStorage.setItem("contactPhone", this.phone);
     
      this.form = {
        orderGoods: this.goods[this.radio]['name'],
        goodImgUrl:this.goods[this.radio]['goodImgUrl'],
        receiver:this.name,
        phone:this.phone,
        address:localStorage.getItem('address'),
        orderStatus:1,
        remark:this.message,
        wxName:localStorage.getItem('name')||'',
        price:this.goods[this.radio]['price'],
        wxid:localStorage.getItem('token'),
        goodsCount:2
      }
        this.addOrder()
      

      
    },
  },
};
</script>

<style lang="less">
.van-radio-group--horizontal {
  justify-content: space-evenly;
}
.goods {
  padding-bottom: 50px;
  overflow: scroll;
  .water {
    margin-top: 10px;
    margin-left: 10px;
    margin-bottom: 10px;
  }
  &-swipe {
    img {
      width: 100%;
      display: block;
    }
  }

  &-title {
    font-size: 16px;
    margin-bottom: 5px;
  }
  .phone {
    text-align: right;
  }
  .desc {
    font-weight: bold;
  }

  &-cell-group {
    margin: 15px 0;

    .van-cell__value {
      color: #999;
    }
  }
}
</style>
