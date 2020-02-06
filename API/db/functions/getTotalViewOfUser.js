'use strict'

module.exports = (sequelize) => {

  return sequelize.query("CREATE OR REPLACE FUNCTION get_total_view_of_user(param_user_id INTEGER)\n" +
                          "\tRETURNS TABLE(\n" +
                          "\t\ttotal_view BIGINT\n" +
                          "\t)\n" +
                          "AS $$\n" +
                          "BEGIN\n" +
                          "\tRETURN QUERY\n" +
                          "\t\tSELECT COUNT(*) AS total_view FROM _post\n" +
                          "\t\tINNER JOIN _view ON _view.post_id = _post.post_id\n" +
                          "\t\tWHERE _post.user_id = param_user_id\n" +
                          "\t\tGROUP BY _post.user_id;\n" +
                          "END $$\n" +
                          "LANGUAGE 'plpgsql';")
}
