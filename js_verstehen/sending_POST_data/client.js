var FormData = require('form-data');
var fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

ajaxUpload1 = function(url) {
    console.log('ajaxUpload1#1url',url);
    var txt = new String("Hello xxxxxxxxxxxxxxxxxx");
    var data = new FormData();
    data.append('data',txt);
    var xhr = new XMLHttpRequest();
    xhr.open('POST',url,true);
    xhr.send(data);
};
const url = 'http://localhost:8080/post-test';

ajaxUpload1(url);