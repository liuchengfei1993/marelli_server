const Core = require('@alicloud/pop-core');



exports.sendSms = async function(phone, code) {

  var client = new Core({
    accessKeyId: 'LTAIlLu2iuG9BwXV',
    accessKeySecret: 'XNCsSBLmQfNB0fTKqdWj5HGdlsDHz5',
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
  });

  var params = {
    "RegionId": "cn-hangzhou",
    "PhoneNumbers": phone,
    "SignName": "芜湖马瑞利工会",
    "TemplateCode": "SMS_171114693",
    "TemplateParam": "{\'code\':" + code + "}"
  }
  var requestOption = {
    method: 'POST'
  };
  await client.request('SendSms', params, requestOption).then((result) => {
    console.log(JSON.stringify(result));
    return result
  }, (ex) => {
    return ex
  })
}