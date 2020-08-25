/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#personalIndex',
    data: {
        userId: '',
        name: '',
        cellphone: '',
        userTypeDisplay: '',
        genderDisplay: '',
        userStateDisplay: '',
        idCard: '',
        icon: '../image/ms.png',
        qq: '',
        email: '',
        address: '',
        introduction: '',
        balance: 0.00
    }
});


function getCurrentUserId() {
    app.$http.post(getUrl('user/currentUser'), {emulateJSON: true})
        .then(function (response) {
            if (response.data.code === 200) {
                var user = response.data.obj;
                if (user) {
                    app.userId = user.userId;
                    app.name = user.name;
                    app.cellphone = user.cellphone;
                    app.userTypeDisplay = user.userTypeDisplay;
                    app.genderDisplay = user.genderDisplay;
                    app.userStateDisplay = user.userStateDisplay;
                    app.idCard = user.idCard;
                    if (user.icon) {
                        app.icon = user.icon;
                    }
                    app.qq = user.qq;
                    app.email = user.email;
                    if (user.address) {
                        app.address = user.address;
                    }
                    app.introduction = user.introduction;
                    if (user.balance != 0) {
                        app.balance = user.balance;
                    }
                } else {
                    window.location.href = getUrl("login.html");
                }
            }
            else alert('服务器内部错误');
        })
}

$(function () {
        getCurrentUserId();
    }
);