const express = require("express");
const cors = require("cors");
const port = process.env.PORT || "8081"; //대충 정해진 포트를 쓰거나 아니라면 8081쓴다는 뜻
const models = require("./models");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      //이미지 파일과 같은 다른 파일이 온다면 저장할 경로 설정(destination)
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      //어떤 이름으로 저장할것인지
      cb(null, file.originalname);
    },
  }),
});
const app = express();

app.use(express.json()); //json형식을 처리할 수 있도록 설정
app.use(cors()); //모든 브라우저에서 서버에 요청할 수 있음
app.use("/uploads", express.static("uploads")); //실제로 서버에서는 해당 파일들을(사진) 보여줄 때 우리가 입력했던 경로와는 다르게 보여줘야 하는데, 같게 보여주게 설정함

app.get("/banners", (req, res) => {
  //배너 관련 api
  models.Banner.findAll({
    limit: 3,
  })
    .then((result) => {
      res.send({
        //banners 에 result 결과를 담는다.
        banners: result,
      });
    })
    .catch((error) => {
      res.status(500).send("에러가 발생했습니다.");
      console.error(error);
    }); //일단 데이터를 받아옴
});

app.get("/products", (req, res) => {
  //app.get()이란 get요청이 왔을 때 즉 method가 get으로 /products에 요청이 왔을 때 두번째 인자인 익명함수 안 코드가 실행
  models.Product.findAll({
    //여러개의 레코드를 조회할 때 사용하는 함수
    //limit: 2, 한번에 조회할 수 있는 갯수 제한
    order: [["createdAt", "DESC"]], //생성일자를 기준으로 내림차순(최신이 제일 높음)
    attributes: [
      "id",
      "name",
      "price",
      "createdAt",
      "seller",
      "imageUrl",
      "soldout",
    ], //조회할 데이터의 컬럼 조건 설정(전부 다 불러오는 것은 비효율적)
  })
    .then((result) => {
      console.log("PRODUCTS : ", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.send("에러 발생");
    });
  // res.send({
  //   //단순한 문자열뿐만 아니라,객체도 넣을수 있음
  //   products: [
  //     {
  //       id: 1,
  //       name: "농구공",
  //       price: 100000,
  //       seller: "조던",
  //       imageUrl: "images/products/basketball1.jpeg",
  //     },
  //     {
  //       id: 2,
  //       name: "축구공",
  //       price: 50000,
  //       seller: "메시",
  //       imageUrl: "images/products/soccerball1.jpg",
  //     },
  //     {
  //       id: 3,
  //       name: "키보드",
  //       price: 10000,
  //       seller: "그랩",
  //       imageUrl: "images/products/keyboard1.jpg",
  //     },
  //   ],
  // });
});

app.post("/products", (req, res) => {
  //일반적으로 브라우저의 주소창에서는 get요청만 가능 post처리하려면 postman프로그램 사용
  const body = req.body; //대충 요청할 때 들어가는 정보들?
  const { name, description, price, seller, imageUrl, soldout } = body;
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send("모든 필드를 입력해 주세요");
  }
  models.Product.create({
    //db에 데이터 추가(비동기 처리)
    name,
    description,
    price,
    seller,
    imageUrl,
    soldout,
  })
    .then((result) => {
      //result에는 create 함수로 생성된 결과 반환
      console.log("상품 생성 결과", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("상품 업로드에 문제가 발생했습니다.");
    });
});

app.get("/products/:id", (req, res) => {
  //이거는 동적 할당인데, :id나, :event 같이 :뒤에 나오는 것들을 params로 저장한 뒤 distructuring(구조분해할당)해서 값에 저장한 뒤 꺼내쓰는 중
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    //하나의 레코드를 조회할 때 사용 *조건문 사용 가능
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("PRODUCT : ", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("에러가 발생했습니다.");
    });
});

app.post("/image", upload.single("image"), (req, res) => {
  //upload.single() -- 이미지 파일과 같은 파일을 하나만 보냈을 때 사용하는 함수(key값은 해당 이름의 파일이 들어왔을 때 처리를 해주는 로직)
  //image 파일을 해당 경로로 해당 경로에서 post 요청으로 데이터 요청이 왔을 때, single() 을 거쳐 업로드 폴더에 해당 이미지 저장
  const file = req.file; //저장된 이미지 정보
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
});

app.post("/purchase/:id", (req, res) => {
  //데이터에 변화를 줄 때는 주로 post요청 사용
  const { id } = req.params; //위의 경로의 :id 를 파라미터로 받아와서 id에 저장
  models.Product.update(
    {
      soldout: 1, //요청이 들어왔을 때 soldout 컬럼의 값을 1로 바꾸겠다.(true도 가능)
    },
    {
      where: {
        id, //해당 id와 일치하는 조건 부여
      },
    }
  )
    .then((result) => {
      res.send({
        result: true,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다.(결제)");
    });
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
