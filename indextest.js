let http = require("http");
let hostname = "127.0.0.1";
let port = "8081";

const server = http.createServer(function (req, res) {
  //서버에 어떠한 요청이 오던 이 콜백함수가 실행됨
  const path = req.url;
  const method = req.method;
  if (path === "/products") {
    if (method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" }); //서버에서 응답을 보낼 때 어떤 형식의 응답인가(여기서는 js형태의 json)
      const products = JSON.stringify([
        //end()의 첫 번째 인자에는 String 형태의 값이 들어가야 함 그래서 JSON.stringfy()를 통해 캐스팅
        {
          name: "농구공",
          price: 5000,
        },
      ]);
      res.end(products);
    } else if (method === "POST") {
      //보통 상품을 생성할 때 많이 씀
      res.end("생성되었습니다.");
    }
  }
});

server.listen(port, hostname);

console.log("grab market server on!");
