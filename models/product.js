//여기에다가 만든 파일을 sequlize가 읽어서 db에게 명령을 내릴 것
module.exports = function (sequelize, DataTypes) {
  //첫번째 인자는 테이블 이름, 두번째 인자는 데이터 타입
  const product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING(20), //컬럼의 자료형
      allowNull: false, //Null 허용 여부
    },
    price: {
      type: DataTypes.INTEGER(10), //컬럼의 자료형
      allowNull: false, //Null 허용 여부
    },
    seller: {
      type: DataTypes.STRING(30), //컬럼의 자료형
      allowNull: false, //Null 허용 여부
    },
    description: {
      type: DataTypes.STRING(300), //컬럼의 자료형
      allowNull: false, //Null 허용 여부
    },
    imageUrl: {
      type: DataTypes.STRING(300), //컬럼의 자료형
      allowNull: true, //Null 허용 여부
    },
    soldout: {
      //결제 여부 확인용(sqlite는 boolean 지원안해서 integer로 대체)
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0, //값을 넣지 않았을때 기본값 설정
    },
  }); //테이블 만드는 중(이름 product),두번째 인자는 컬럼들
  return product;
};
