/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#showJoin',
    data:{
        name:'',
        telephone:'',
        email:'',
        joinNum:'',
        joinAgreement:''
    },
    methods: {
        bindfindJoinId: function (joinId) {
            this.$http.post(getUrl('join/findById'), {joinId: joinId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var join = response.data.obj;
                        this.name = join.name;
                        this.telephone = join.telephone;
                        this.email = join.email;
                        this.joinNum = join.joinNum;
                        this.joinAgreement = join.joinAgreement;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidJoinId").val();
        if (id != null && id.length > 0) {
            editVM.bindfindJoinId(id);
        }
        $(".editClose").click(clearJoinId);
    }
);