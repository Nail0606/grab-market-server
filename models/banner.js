module.exports = function (sequelize, DataTypes) {
  const banner = sequelize.define("Banner", {
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    href: {
      //이미지를 클릭했을 때, 어떠한 경로로 이동시킬지 경로
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  });
  return banner;
};
