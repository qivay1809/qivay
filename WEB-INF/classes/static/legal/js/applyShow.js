/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#showLegalApply',
    data:{
        name:'',
        phone:'',
        lawfirm:'',
        address:'',
        price:'',
        priceInfo:'',
        experience:'',
        statusDisplay:'',
        createTime:''//验证不通过原因
    },
    methods: {
        bindfindLegalApplyId: function (legalApplyId) {
            this.$http.post(getUrl('legalApply/findById'), {legalApplyId: legalApplyId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var legal = response.data.obj;
                        this.name = legal.name;
                        this.phone = legal.phone;
                        this.lawfirm = legal.lawfirm;
                        this.address = legal.address;

                        this.price = legal.price;
                        this.priceInfo = legal.priceInfo;
                        this.experience = legal.experience;
                        this.statusDisplay = legal.statusDisplay;
                        this.createTime = legal.createTime;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidLegalApplyId").val();
        if (id != null && id.length > 0) {
            editVM.bindfindLegalApplyId(id);
        }
        $(".editClose").click(clearLegalApplyId);
    }
);