'use strict'

module.exports = (sequelize) => {

  return sequelize.query("CREATE OR REPLACE FUNCTION get_likes_of_user(param_user_id INTEGER)\n" +
                          "\tRETURNS TABLE(\n" +
                          "\t\tlikes BIGINT,\n" +
                          "\t\tdislikes BIGINT\n" +
                          "\t)\n" +
                          "AS $$\n" +
                          "BEGIN\n" +
                          "\tRETURN QUERY\n" +
                          "\t\tSELECT SUM(CASE WHEN _vote.value > 0 THEN 1 ELSE 0 END) AS likes,\n" +
                          "\t\tSUM(CASE WHEN _vote.value < 0 THEN 1 ELSE 0 END) AS dislikes\n" +
                          "\t\tFROM _post\n" +
                          "\t\tINNER JOIN _vote ON _vote.post_id = _post.post_id\n" +
                          "\t\tWHERE _post.user_id = param_user_id\n" +
                          "\t\tGROUP BY _post.user_id;\n" +
                          "END $$\n" +
                          "LANGUAGE 'plpgsql';");
}
