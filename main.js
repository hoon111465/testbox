var http = require('http');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');

const mariadb = require('mysql');
const connection = mariadb.createConnection({
  host: 'localhost',
  user: 'root',
  connectionLimit: 5,
  password: '1111',
  database: 'testbox'
});
connection.connect();
console.log('test1');

var app = http.createServer(function(request,response){
    var rurl = request.url;
    var queryData = url.parse(rurl, true).query;
    var pathname = url.parse(rurl, true).pathname;

    if(pathname === '/'){
      connection.query('SELECT * FROM data_text', function(error, dbData){

        if(error) {
        console.log('err: '+error);
        };//if end

      var list = template.list(dbData);
      var body = '<h2>welcome </h2>';
      var html = template.HTML(list, body);
      console.log('dbData: '+ list);

      response.writeHead(200);
      response.end(html);
      });//connection.query end

    }else if(pathname === '/insertForm'){
      connection.query('SELECT * FROM data_text', function(error, dbData){

        if(error) {
        console.log('err: '+error);
        };//if end

      var list = template.list(dbData);
      var body = '<form action="/insert" method="post"><p><input type="text" name="title" style="width:200px" placeholder="title을 입력해주세요"/></p><p><input type="submit"></p></form>';
      var html = template.HTML(list, body);
      console.log('dbData: '+ list);

      response.writeHead(200);
      response.end(html);
      });//connection.query end
    }else if (pathname === '/insert') {
      var querys ='';
      request.on('data',function(data){
        querys += data;
      });
      request.on('end',function(){
        var post = qs.parse(querys);
        console.log('insertData: '+post.title);
        connection.query('INSERT INTO data_text(title) VALUES('+connection.escape(post.title)+')', function(error, dbData){
          if(error) {
          console.log('err: '+error);
          };//if end
          console.log('insert now');
          response.writeHead(302, {Location:`/`});//302는 다른페이지로 리다이렉션시킴
          response.end('');
        });//connection.query end
      });

    }else if (pathname === '/updateForm') {
      var text = url.parse(request.url, true).query;
      //console.log('update_textquery:'+text.no);
      connection.query('SELECT * FROM data_text WHERE no='+connection.escape(text.no), function(error, dbData){
        if(error) {
        console.log('err: '+error);
        };//if end

        var list = template.list(dbData);
        console.log(dbData[0].title);
        var body = '<form action="/update" method="post"><p><input type="hidden" name="no" value='+dbData[0].no+' ><input type="text" name="title" placeholder="title" value='+dbData[0].title+' /></p><p><input type="submit"></p></form>';
        var html = template.HTML(list, body);

        response.writeHead(200);
        response.end(html);
      });//connection.query end

    }else if (pathname === '/update') {
      var querys ='';
      request.on('data',function(data){
        querys += data;
      });
      request.on('end',function(){
        var post = qs.parse(querys);
        console.log('updateNo'+post.no+'updateTitle: '+post.title);
        console.log('UPDATE data_text SET title='+connection.escape(post.title)+' WHERE no ='+connection.escape(post.no));
        connection.query('UPDATE data_text SET title='+connection.escape(post.title)+' WHERE no ='+connection.escape(post.no), function(error, dbData){
          if(error) {
          console.log('err: '+error);
          };//if end
          console.log('update now');
          response.writeHead(302, {Location:`/`});//302는 다른페이지로 리다이렉션시킴
          response.end('');
        });//connection.query end
      });

    }else if (pathname === '/deleteForm') {
      var text = url.parse(request.url, true).query;
      connection.query('DELETE FROM data_text WHERE no='+connection.escape(text.no), function(error, dbData){
        console.log('delete now');
        response.writeHead(302, {Location:`/`});//302는 다른페이지로 리다이렉션시킴
        response.end('');
      });//connection.query end
    }else{
      response.writeHead(404);
    }//if~else if end



});
console.log('test2');
app.listen(3000);
