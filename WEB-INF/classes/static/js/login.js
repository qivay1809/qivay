/**
 * Created by Administrator on 2017/12/4.
 */

var loginPage = new Vue({
    el: '#qivayadmin',
    data: {
        phonelist: true,
        loginname: '账号登录',

        cellphone: '',
        password: '',
        cellphone1: '',
        code:'',
        url: getUrl('user/login'),
        countdown: 0
    },
    methods: {
        tabaccount: function () {
            this.phonelist = false
        },
        tabcode: function () {
            this.phonelist = true
        },
        login: function () {
            if(this.phonelist){
                //验证码登录
                loginPage.loginByCode();
            } else {
                var params = {
                    cellphone: this.cellphone, password: this.password
                };
                if (this.cellphone == '' || this.password == '') {
                    alert('请输入手机号和密码');
                }
                else {
                    this.$http.post(this.url, params, {emulateJSON: true})
                        .then(function (response) {
                            console.log("返回" + response);
                            if (response.data.code === 200) {
                                location.href = "index.html";
                            } else {
                                alert(response.data.msg);
                            }
                        })
                }
            }
        },
        loginByCode: function () {
            var params = {
                cellphone: this.cellphone1,
                code: this.code
            };
            if (this.cellphone1 == '') {
                alert('请输入手机号');
            }
            else if(this.code=='' || this.code.length!=6){
                alert('验证码输入有误');
            }
            else {
                this.$http.post(this.url, params, {emulateJSON: true})
                    .then(function (response) {
                        console.log("返回"+response);
                        if (response.data.code === 200) {
                            location.href = "index.html";
                        } else {
                            alert(response.data.msg);
                        }
                    })
            }
        },
        setTime: function () {
            var obj = $(".btn-info");
            if (this.countdown <= 0) {
                obj.removeAttr("disabled");
                obj.val("获取手机验证码");
            } else {
                obj.attr("disabled", true);
                obj.val("" + this.countdown + "秒后重新发送");
                this.countdown--;
                setTimeout(function () {
                    loginPage.setTime();
                }, 1000);
            }
        },
        getCode: function () {
            if (this.cellphone1 == '' || this.cellphone1.length != 11) {
                alert('手机号输入有误');
                return;
            }
            var params = {
                cellphone: this.cellphone1
            };
            this.$http.post(getUrl('user/code'), params, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                    }
                    else {
                        alert(response.data.msg);
                    }
                });
            this.countdown = 80;
            loginPage.setTime();
        }
    }
});

$(function () {
    loginPage.cellphone = getCookie("CURRENT_USERNAME");
    $(document).keyup(function (event) {
        if (event.keyCode == 13) {
            loginPage.login();
        }
    });
});
