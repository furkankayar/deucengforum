'use strict'


module.exports = (sequelize) => {
  return sequelize.query("CREATE OR REPLACE FUNCTION get_post(param_post_id INTEGER)\n"+
                          "\tRETURNS TABLE(\n"+
                          "\t\tuser_id INTEGER,\n"+
                          "\t\tprofile_image VARCHAR,\n" +
                          "\t\tusername VARCHAR,\n"+
                          "\t\tcontent VARCHAR,\n"+
                          "\t\tpublished_days_ago DOUBLE PRECISION,\n"+
                          "\t\tpublished_hours_ago DOUBLE PRECISION,\n"+
                          "\t\tpublished_minutes_ago DOUBLE PRECISION,\n"+
                          "\t\tpublished_seconds_ago DOUBLE PRECISION,\n"+
                          "\t\tpositive_vote BIGINT,\n"+
                          "\t\tnegative_vote BIGINT\n"+
                          "\t)\n"+
                          "AS $$\n"+
                          "BEGIN\n"+
                          "\tRETURN QUERY\n"+
                          "\t\tSELECT _user.user_id,\n"+
                          "\t\t \t\t   _user.profile_image,\n" +
                          "\t   \t\t   _user.username,\n"+
                          "\t   \t\t   _post.content,\n"+
                          "\t   \t\t   EXTRACT(DAY FROM NOW() - _post.date) AS published_days_ago,\n"+
                          "\t           EXTRACT(HOUR FROM NOW() - _post.date) AS published_hours_ago,\n"+
                          "\t           EXTRACT(MINUTE FROM NOW() - _post.date) AS published_minutes_ago,\n"+
                          "\t           FLOOR(EXTRACT(SECOND FROM NOW() - _post.date)) AS published_seconds_ago,\n"+
                          "\t           SUM(CASE \n"+
                          "\t\t   \t\t\tWHEN _vote.value >= 0 AND _vote.value IS NOT NULL THEN _vote.value\n"+
                          "\t\t   \t\t\tELSE 0\n"+
                          "\t\t   \t   END) AS positive_vote,\n"+
                          "\t   \t\t   SUM(CASE\n"+
                          "\t\t   \t\t\tWHEN _vote.value < 0 AND _vote.value IS NOT NULL THEN _vote.value * -1\n"+
                          "\t\t   \t\t\tELSE 0 \n"+
                          "\t\t   \t   END) AS negative_vote\n"+
                          "\t\tFROM _post\n"+
                          "\t\tLEFT JOIN _vote ON _post.post_id = _vote.post_id\n"+
                          "\t\tINNER JOIN _user ON _post.user_id = _user.user_id\n"+
                          "\t\tWHERE _post.post_id = param_post_id\n"+
                          "\t\tGROUP BY _post.post_id, _user.user_id;\n"+
                          "END; $$\n"+
                          "LANGUAGE 'plpgsql';");
}
