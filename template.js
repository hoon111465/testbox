 var sanitizeHtml = require('sanitize-html');

module.exports = {
  HTML:function(list, body){
    return `
    <!doctype html>
    <html>
    <head>
      <title>node and mariaDB</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1>welcome node and mariaDB</h1>
      ${list}
      <p><a href="/insertForm">작성하러가기</a></p>
      ${body}
    </body>
    </html>
    `;
  },
  //list 함수
  list:function(dbData){
    var list = '<table border="1" style="width:300px"><thead><tr><th>번호</th><th>제목</th><th></th><th></th></tr></thead>';
    var i = 0;
    //반복하여 dbData의 갯수만큼 출력한다
    while(i < dbData.length){
      list = list + `<tr><td>${dbData[i].no}</td><td>${dbData[i].title}</td><td><a href='/updateForm?no=${dbData[i].no}'>수정</a></td><td><a href='/deleteForm?no=${dbData[i].no}'>삭제</a></td><tr>`;
      i = i + 1;
    }
    list = list+'</table>';
    return list;
  }
};
