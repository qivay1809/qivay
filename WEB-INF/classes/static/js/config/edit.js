/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editConfig',
    data: {
        configId: '',
        configKey: '',
        configContent: '',
        remark:'',
        url: getUrl('config/addConfig')
    },
    methods: {
        editConfig: function () {
            if (!this.configKey) {
                alert("请填写配置查找键!");
                return;
            }
            if (!this.configContent) {
                alert("请填写配置内容!");
                return;
            }
            if (!this.remark) {
                alert("请填写配置内容!");
                return;
            }
            var config = {
                configId: this.configId
                , configKey: this.configKey
                , configContent: this.configContent
                , remark: this.remark
            };
            if (this.configId) {
                this.url = getUrl('config/updateConfig');
            }
            this.$http.post(this.url, config, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    }else if(response.data.code === 403){
                        alert(response.data.msg);
                    }
                    else alert('保存失败');
                })
        },
        bindConfig: function (id) {
            this.$http.post(getUrl('config/getConfig'), {configId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var config = response.data.obj;
                        this.configId = config.configId;
                        this.configKey = config.configKey;
                        this.configContent = config.configContent;
                        this.remark = config.remark;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidConfigId").val();
        if (id != null && id.length > 0) {
            editVM.bindConfig(id);
        }
        $(".editClose").click(clearConfigId);
    }
);