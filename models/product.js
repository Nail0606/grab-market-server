//여기에다가 만든 파일을 sequlize가 읽어서 db에게 명령을 내릴 것
module.exports = function (sequelize, DataTypes) {
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
  }); //테이블 만드는 중(이름 product),두번째 인자는 컬럼들
  return product;
};
