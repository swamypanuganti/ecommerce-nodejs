module.exports = (sequelize, Sequelize) => {
    const Categories = sequelize.define("categories", {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
      categoryName: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
             isenabled: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        isdeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    return Categories;
  };