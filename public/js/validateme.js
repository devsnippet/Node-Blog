$(document).ready(function(){
    $("#signin").validate({
        rules: {
            password: {
                required: true,
                maxlength: 20,
                minlength: 4
            },
            uname: {
                required: true,
                maxlength: 24,
                minlength: 4
            }
        },
        messages: {
            password: {
                required: "请输入密码",
                maxlength: "密码长度请不要超过20个字符",
                minlength: "密码长度至少4个字符"
            },
            uname: {
                required: "用户名不能为空",
                maxlength: "用户名不超过24字母或数字组合",
                minlength: "用户长度不少于4个字"
            }
        }
    });
    $("#signup").validate({
        rules: {
            password: {
                required: true,
                maxlength: 20,
                minlength: 4
            },
            uname: {
                required: true,
                maxlength: 24,
                minlength: 6
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                maxlength: 20,
                minlength: 4
            },
            name: {
                required: true,
                maxlength: 12,
                minlength: 1
            },
            uname: {
                required: true,
                maxlength: 24,
                minlength: 6
            },
            location: {
                required: true,
                maxlength: 60,
                minlength: 2
            },
            cellphone: {
                required: true,
                digits: true,
                maxlength: 15,
                minlength: 6
            },
            birthday: {
                required: true,
                date: true
            }
        },
        messages: {
            password: {
                required: "请输入密码",
                maxlength: "密码长度请不要超过20个字符",
                minlength: "密码长度至少4个字符"
            },
            uname: {
                required: "用户名不能为空",
                maxlength: "用户名不超过24字母或数字组合",
                minlength: "用户长度不少于6个字"
            },
            email: {
                required: "请放心，我们对垃圾邮件同样深恶痛绝，绝不会将你的信息透露给第三方，也不会在非必要情况下发给你邮件",
                email: "电子邮件必须符合 name@domain.com 格式"
            },
            name: {
                required: "请告诉我们你的真实姓名以方便我们联系与合作",
                maxlength: "姓名长度不超过32个字",
                minlength: "姓名长度不少于1个字"
            },
            location: {
                required: "请告诉我们你的现居地，让我们对你有初步了解",
                maxlength: "地址长度不超过60个字，格式以 浙江 杭州 为标准",
                minlength: "地址长度不小于2个字"
            },
            cellphone: {
                required: "请告诉我们你的手机号码，以方便我们与你及时联系",
                digits: "手机号码应该都是数字吧",
                maxlength: "手机号码不超过15位数字",
                minlength: "如果你输入的是座机号，至少应该有6位数字吧"
            },
            birthday: {
                required: "请告诉我们你的出生日期，让我们对你有初步了解",
                date: "请输入格式以 1900-01-01 为标准的日期"
            }
        }
    });
    $("#post, #reply").validate({
        rule: {
            posttitle: {
                required: true,
                maxlength: 48,
                minlength: 1
            },
            postcontent: {
                required: true,
                maxlength: 10000,
                minlength: 1
            },
            posturl: {
                maxlength: 100,
                minlength: 8,
                url: true
            },
            document: {
                accept: "rar|zip|pdf|xls|xlsx|doc|docx|ppt|pptx|txt|jpg|png"
            },
            replycontent: {
                required: true,
                maxlength: 3000,
                minlength: 1
            }
        },
        messages: {
            posttitle: {
                required: "没标题我们不好发布啊",
                maxlength: "标题长度不超过48个字",
                minlength: "标题长度至少也得有一个字吧"
            },
            postcontent: {
                required: "内容不能为空",
                maxlength: "超过10000字了？另开一篇连载如何？",
                minlength: "内容一个字都没有？还是写点什么吧"
            },
            posturl: {
                maxlength: "URL请不要超过100字符",
                minlength: "",
                url: "请检查URL格式"
            },
            document: {
                accept: "请将文件以rar|zip|pdf|xls|xlsx|doc|docx|ppt|pptx|txt|jpg|png格式上传"
            },
            replycontent: {
                required: "你想评论点什么呢？",
                maxlength: "超过3000字了？天！建议你专门发布一篇文章如何？",
                minlength: "无字评论？我们不好发布啊"
            }
        }
    });
    $("#changepassword").validate({
        rules: {
            oldpassword: {
                required: true,
                maxlength: 20,
                minlength: 4
            },
            newpassword: {
                required: true,
                maxlength: 20,
                minlength: 4
            },
            repeatpassword: {
                required: true,
                maxlength: 20,
                minlength: 4,
                equalTo: "#newpassword"
            }
        },
        messages: {
            oldpassword: {
                required: "请输入密码",
                maxlength: "密码长度请不要超过20个字符",
                minlength: "密码长度至少4个字符"
            },
            newpassword: {
                required: "请输入密码",
                maxlength: "密码长度请不要超过20个字符",
                minlength: "密码长度至少4个字符"
            },
            repeatpassword: {
                required: "请输入密码",
                maxlength: "密码长度请不要超过20个字符",
                minlength: "密码长度至少4个字符",
                equalTo: "新密码确认有误，请重新输入"
            }
        }
    });
    $("#wtf").validate({
        rules: {
            wtftitle: {
                required: true,
                maxlength: 32,
                minlength: 1
            },
            wtfcontent: {
                required: true,
                maxlength: 5000,
                minlength: 1
            }
        },
        messages: {
            wtftitle: {
                required: "请输入标题",
                maxlength: "标题长度请不要超过32个字",
                minlength: "至少给我们一个标题吧"
            },
            wtfcontent: {
                required: "你想说点什么呢？",
                maxlength: "内容长度不超过5000个字",
                minlength: "至少说点什么吧"
            }
        }
    });
    $("#project").validate({
        rules: {
            projecttitle: {
                required: true,
                maxlength: 48,
                minlength: 1
            },
            projectprogress: {
                required: true,
                maxlength: 1000,
                minlength: 1
            },
            document: {
                accept: "zip|rar|xls|xlsx|doc|docx|ppt|pptx|pdf|txt|jpg|png"
            }
        },
        messages: {
            projecttitle: {
                required: "项目总得有个名吧",
                maxlength: "项目名称请不要超过48个字",
                minlength: ""
            },
            document: {
                accept: "仅接受xls|xlsx|doc|docx|ppt|pptx|pdf|txt|jpg|png，多文档请以zip或rar格式压缩上传，大小请不要超过2M"
            }
        }
    });
    $("#mail").validate({
        rules: {
            inboxtitle: {
                required: true,
                maxlength: 32
            },
            inboxcontent: {
                required: true,
                maxlength: 5000
            },
            replycontent: {
                required: true,
                maxlength: 5000
            }
        },
        messages: {
            inboxtitle: {
                required: "写个标题吧",
                maxlength: "标题"
            },
            inboxcontent: {
                required: "写点内容吧",
                maxlength: "内容请不要超过5000字"
            },
            replycontent: {
                required: "写点内容吧",
                maxlength: "内容请不要超过5000字"
            }
        }
    });
});