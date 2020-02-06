'use strict'

module.exports = (sequelize) => {
  return sequelize.query("CREATE OR REPLACE FUNCTION get_top_posts_of_user(param_user_id INTEGER)\n" +
                          "\tRETURNS TABLE(\n" +
                          "\t\tpost_id INTEGER,\n" +
                          "\t\ttopic VARCHAR,\n" +
                          "\t\ttotal_like BIGINT\n" +
                          "\t)\n" +
                          "AS $$\n" +
                          "BEGIN\n" +
                          "\tRETURN QUERY\n" +
                          "\t\tSELECT _post.post_id, _post.topic, (CASE WHEN SUM(_vote.value) IS NULL THEN 0 ELSE SUM(_vote.value) END) AS total_like  FROM _post\n" +
                          "\t\tLEFT JOIN _vote ON _vote.post_id = _post.post_id\n" +
                          "\t\tWHERE _post.user_id = param_user_id\n" +
                          "\t\tGROUP BY _post.post_id\n" +
                          "\t\tORDER BY SUM(_vote.value) DESC NULLS LAST\n" +
                          "\t\tLIMIT 5;\n" +
                          "END; $$\n" +
                          "LANGUAGE 'plpgsql';\n");
}
