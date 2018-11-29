/**
 * Created by Echonessy on 2018/11/26.
 */
$(function () {
    //全局方法
    Init()
    function Init() {
        TabEvt();
        InitSwitch();
        AddHeaders('#HeaderList')
        AddHeaders('#KeyList');
        SendEvent();
    }

    //Tab切换
    function TabEvt() {
        $('.TabBtn').on('click',function () {
            var i = $(this).index();
            var iPos = i * 180 + 'px';
            $('#SendBtn').attr('data-iPos',i);
            $('#Line').stop(true).animate({'left':iPos});
            $('#Content .ConBoxItem').css('display','none');
            $('#Content .ConBoxItem').eq(i).stop(true).fadeIn(300);
        })
    }
    
    //加载开关
    function InitSwitch() {
        layui.use('form', function(){
            var form = layui.form;
            //监听指定开关
            form.on('switch(switchTest)', function(data){
                var checked = this.checked;
                if(checked) {
                    $('#SendBtn').attr('data-iSwitch','true');
                    $('#ShowHeaders').stop(true).slideDown(150);
                } else {
                    $('#SendBtn').attr('data-iSwitch','false');
                    $('#ShowHeaders').stop(true).slideUp(150);
                }
            });
            form.on('switch(switchUrl)', function(data){
                var checked = this.checked;
                if(checked) {
                    $('#TotalIp').css('display','none');
                    $('#SplitIp').stop(true).slideDown(150);
                    $('#SendBtn').attr('data-iUrlSwitch','true');
                } else {
                    $('#SplitIp').css('display','none');
                    $('#TotalIp').stop(true).slideDown(150);
                    $('#SendBtn').attr('data-iUrlSwitch','false');
                }
            });
        });
    }

    //动态添加Headers
    function AddHeaders(itemPra) {
        $(itemPra).find('.Item input').on('click',function (e) {
            if($(this).parents('.Item').index() == $(itemPra).find('.Item').length-1 ){
                $(itemPra).append(CreatHeaders());
                AddHeaders(itemPra)
            }
        })
        $('.DelBtn').on('click',function () {
            if($(itemPra).find('.Item').length != '1') {
                $(this).parents('.Item').remove()
            }
        })
    }

    //创建动态Headers
    function CreatHeaders() {
        var Html = '';
        Html += '<div class="col-md-10 Item">';
        Html += '<p class="keylab">Key：</p>';
        Html += '<input type="text" class="form-control KeyInput" >';
        Html += '<p class="keylab">Value：</p>';
        Html += '<input type="text" class="form-control KeyInput" >';
        Html += '<button class="layui-btn layui-btn-sm layui-btn-normal DelBtn"><i class="layui-icon"></i> 删除</button>';
        Html += '</div>';
        return Html;
    };


    //请求事件
    function SendEvent() {
        $('#SendBtn').on('click',function () {
            var this_ = $(this);
            var this_iPos = this_.attr('data-iPos');
            var this_iSwitch = this_.attr('data-iSwitch');
            var this_iUrlSwitch = this_.attr('data-iUrlSwitch');
            var SubData = CreatReqData(this_iSwitch,this_iPos,this_iUrlSwitch);
            $("#JsonResponse").html('');
            $("#KeyValueResponse").html('');
            NewAjax(SubData,this_iPos);
        })
    }

    // Ajax封装
    function NewAjax (reqData,flag) {
        $.ajax({
            type:'post',
            url: '/netWorkPort',
            data: reqData,
            timeout: 30000,//30秒
            cache: false,
            dataType:"json",
            success: function (data) {
                //body 方式
                if(flag == '0') {
                    try {
                        $("#JsonResponse").val(JSON.stringify(data))
                    }
                    catch (e) {
                        $("#JsonResponse").val(data)
                    }
                }
                //key-value 方式
                else {
                    try {
                        $("#KeyValueResponse").val(JSON.stringify(data))
                    }
                    catch (e) {
                        $("#KeyValueResponse").val(data)
                    }

                }
            },
            error:  function (xml, status) {
                console.log(xml)
                if(xml && xml.responseText){
                    var errResult;
                    try{
                        errResult=JSON.parse(xml.responseText);
                        layer.msg(errResult.msg);
                        err&&err(errResult);
                        return;
                    }catch(e){
                        layer.msg(xml.responseText);
                    }
                }else{
                    layer.msg("请求没有响应");
                }
            }
        });
    };

    //创建JSON
    function GetJson(jsonStr) {
        var Json = {};
        try{
            Json.Data = JSON.parse(jsonStr);
            Json.Result = 'Success';
            Json.Msg = '';
        }catch(e){
            Json.Data = null;
            Json.Result = 'Fail';
            Json.Msg = 'JSON格式错误';
        }
        return Json
    }

    //创建请求体
    function CreatReqData(this_iSwitch,this_iPos,this_iUrlSwitch) {
        var SubData = {};
        if (this_iUrlSwitch == 'true') {
            SubData.Url = CreatUrlData();
        } else {
            SubData.Url = $('#IpUrl').val();
        }

        if(this_iSwitch == 'true') {
            SubData.Headers = CreatHeaderArr();
        } else {
            SubData.Headers = [];
        }
        //body 方式
        if(this_iPos == '0') {
            SubData.ReqJson = CreatReqBody();
            SubData.Flag = '0000';
        }
        //key-value 方式
        else {
            SubData.Flag = '1111';
            SubData.ReqKeyValue = CreatReqKeyValue();
        }
        return SubData;
    }


    //创建Url
    function CreatUrlData() {
        var Ip = $('#Ip').val();
        var IpTarget = $('#IpTarget').val();
        return Ip + IpTarget;
    }

    //键值对封装
    function KeyValueData(Dom) {
        var Arr = [];
        var ThisList = $(Dom).find('.Item')
        $.each(ThisList,function (i,obj) {
            var key = $(this).find('input').eq(0).val();
            var value = $(this).find('input').eq(1).val();
            var Obj = {};
            if(key && value) {
                Obj.key = key;
                Obj.value = value;
                Arr.push(Obj);
            }
        })
        return Arr;
    }


    //创建请求头数据
    function CreatHeaderArr() {
        return KeyValueData('#HeaderList');
    }

    // 创建body请求体数据
    function CreatReqBody() {
        return GetJson($('#JsonBox').val());
    }
    // 创建键值对数据
    function CreatReqKeyValue() {
        return KeyValueData('#KeyList')
    }


})