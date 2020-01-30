'use strict'

module.exports = (sequelize) => {
  return sequelize.query("CREATE OR REPLACE FUNCTION get_comments_of_post(param_post_id INTEGER)\n" +
                          "\tRETURNS TABLE(\n" +
                          "\t\tuser_id INTEGER,\n" +
                          "\t\tusername VARCHAR,\n" +
                          "\t\tcontent VARCHAR,\n" +
                          "\t\tpublished_days_ago DOUBLE PRECISION,\n" +
                          "\t\tpublished_hours_ago DOUBLE PRECISION,\n" +
                          "\t\tpublished_minutes_ago DOUBLE PRECISION,\n" +
                          "\t\tpublished_seconds_ago DOUBLE PRECISION\n" +
                          "\t)\n" +
                          "AS $$\n" +
                          "BEGIN\n" +
                          "\tRETURN QUERY\n" +
                          "\t\tSELECT _user.user_id,\n" +
                          "\t\t\t_user.username, \n" +
                          "\t\t\t_comment.body AS content,\n" +
                          "\t\t\tEXTRACT(DAY FROM NOW() - _comment.date) AS published_days_ago,\n" +
                          "\t\t\tEXTRACT(HOUR FROM NOW() - _comment.date) AS published_hours_ago,\n" +
                          "\t\t\tEXTRACT(MINUTE FROM NOW() - _comment.date) AS published_minutes_ago,\n" +
                          "\t\t\tFLOOR(EXTRACT(SECOND FROM NOW() - _comment.date)) AS published_seconds_ago\n" +
                          "\t\tFROM _comment\n" +
                          "\t\tLEFT JOIN _user_comment ON _comment.comment_id = _user_comment.comment_id\n" +
                          "\t\tLEFT JOIN _user ON _user_comment.user_id = _user.user_id\n" +
                          "\t\tWHERE _comment.post_id = param_post_id\n" +
                          "\t\tORDER BY _comment.date ASC;" +
                          "END; $$\n" +
                          "LANGUAGE 'plpgsql';");
}
