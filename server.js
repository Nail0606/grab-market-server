const express = require("express");
const cors = require("cors");
const port = 8081;
const models = require("./models");
const app = express();

app.use(express.json()); //json형식을 처리할 수 있도록 설정
app.use(cors()); //모든 브라우저에서 서버에 요청할 수 있음

app.get("/products", (req, res) => {
  //app.get()이란 get요청이 왔을 때 즉 method가 get으로 /products에 요청이 왔을 때 두번째 인자인 익명함수 안 코드가 실행
  const query = req.query;
  console.log("QUERY : ", query);
  res.send({
    //단순한 문자열뿐만 아니라,객체도 넣을수 있음
    products: [
      {
        id: 1,
        name: "농구공",
        price: 100000,
        seller: "조던",
        imageUrl: "images/products/basketball1.jpeg",
      },
      {
        id: 2,
        name: "축구공",
        price: 50000,
        seller: "메시",
        imageUrl: "images/products/soccerball1.jpg",
      },
      {
        id: 3,
        name: "키보드",
        price: 10000,
        seller: "그랩",
        imageUrl: "images/products/keyboard1.jpg",
      },
    ],
  });
});

app.post("/products", (req, res) => {
  //일반적으로 브라우저의 주소창에서는 get요청만 가능 post처리하려면 postman프로그램 사용
  const body = req.body;
  res.send({
    body, //es6 문법은 원래 key : value 형태를 띄어야 하지만, key와 value가 똑같은 이름이라면 생략이 가능하다.
  });
});

app.get("/products/:id/events/:eventId", (req, res) => {
  //이거는 동적 할당인데, :id나, :event 같이 :뒤에 나오는 것들을 params로 저장한 뒤 distructuring(구조분해할당)해서 값에 저장한 뒤 꺼내쓰는 중
  const params = req.params;
  const { id, eventId } = params;
  res.send(`id는 ${id}, eventId는 ${eventId} 입니다.`);
});

app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다.");
  models.sequelize
    .sync() //--sequlize.sync--우리가 앞으로 여기 모델스에 우리가 어떤 테이블 관련된 모델링에 필요한 정보를 넣을거에요. 그때 싱크를 시키겠다. 그래서 /models의 index.js에 입력한 정보를 데이터베이스와 동기화 시켜서 예를 들어 /models의 index.js에서 상품과 관련된 테이블을 만들었다. 하면은 데이터베이스에서 상품과 관련된 테이블을 하나 만들어 줄 거에요 그런식으로 동기화를 시켜주고요
    .then(() => {
      console.log("DB 연결 성공!");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB 연결 에러");
      process.exit(); //서버 실행할 때 listen상태가 지속되는데 어차피 에러났으면 db랑 연결이 안되는 상태니까 종료시킴
    });
});
