"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Jobs", "roundStatus", {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {},
    });

    await queryInterface.sequelize.query(`
      UPDATE "Jobs" AS j
      SET "roundStatus" = COALESCE(
        (
          SELECT jsonb_object_agg(t.r, '0')
          FROM unnest(j."rounds") AS t(r)
        ),
        '{}'::jsonb
      )
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Jobs", "rounds", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE "Jobs"
      SET "rounds" = (
        SELECT array_agg(key)
        FROM jsonb_each_text("Jobs"."roundStatus")
      )
    `);

    await queryInterface.removeColumn("Jobs", "roundStatus");
  },
};