const { sequelize } = require("../config/db");

const Job = require("./job.model")(sequelize);
const Application = require("./application.model")(sequelize);

// Relationships (Job -> Applications)
Job.hasMany(Application, {
  foreignKey: "job_id",
  as: "applications",
  onDelete: "CASCADE",
});

Application.belongsTo(Job, {
  foreignKey: "job_id",
  as: "job",
});

module.exports = {
  sequelize,
  Job,
  Application,
};