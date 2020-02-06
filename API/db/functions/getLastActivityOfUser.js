'use strict'

module.exports = (sequelize) => {

  return sequelize.query("CREATE OR REPLACE FUNCTION get_last_activity_of_user(param_user_id INTEGER)\n" +
                          "\tRETURNS TABLE(\n" +
                          "\t\tdays_ago DOUBLE PRECISION,\n" +
                          "\t\thours_ago DOUBLE PRECISION,\n" +
                          "\t\tminutes_ago DOUBLE PRECISION,\n" +
                          "\t\tseconds_ago DOUBLE PRECISION\n" +
                          "\t)\n" +
                          "AS $$\n" +
                          "BEGIN\n" +
                          "\tRETURN QUERY\n" +
                          "\t\tSELECT EXTRACT(DAY FROM NOW() - sub.date) AS days_ago,\n" +
                          "\t\t\t\tEXTRACT(HOUR FROM NOW() - sub.date) AS hours_ago,\n" +
                          "\t\t\t\tEXTRACT(MINUTE FROM NOW() - sub.date) AS minutes_ago,\n" +
                          "\t\t\t\tFLOOR(EXTRACT(SECOND FROM NOW() - sub.date)) AS seconds_ago\n" +
                          "\t\tFROM (\n" +
                          "\t\t\t\tSELECT _post.date FROM _post\n" +
                          "\t\t\t\tWHERE _post.user_id = param_user_id\n" +
                          "\t\t\t\tUNION\n" +
                          "\t\t\t\tSELECT _comment.date FROM _comment\n" +
                          "\t\t\t\tINNER JOIN _user_comment ON _comment.comment_id = _user_comment.comment_id\n" +
                          "\t\t\t\tWHERE _user_comment.user_id = param_user_id\n" +
                          "\t\t\t) AS sub\n" +
                          "\t\tORDER BY sub.date DESC\n" +
                          "\t\tLIMIT 1;\n" +
                          "END; $$\n" +
                          "LANGUAGE 'plpgsql';");
}
