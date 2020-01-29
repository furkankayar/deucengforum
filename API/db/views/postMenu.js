'use strict'

const postMenu = {};

function postMenuView(sequelize, Sequelize){
  var postMenuView = sequelize.define('post_menu', {
    post_id:{
      type: Sequelize.INTEGER
    },
    username:{
      type: Sequelize.STRING(100)
    },
    topic:{
      type: Sequelize.STRING(100)
    },
    published_days_ago:{
      type: Sequelize.INTEGER
    },
    published_hours_ago:{
      type: Sequelize.INTEGER
    },
    published_minutes_ago:{
      type: Sequelize.INTEGER
    },
    published_seconds_ago:{
      type: Sequelize.INTEGER
    },
    answer:{
      type: Sequelize.INTEGER
    },
    view:{
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    sync: false,
    classMethods: {
     createView: () => {
       return sequelize.query("CREATE OR REPLACE VIEW post_menu AS\n" +
                                 "SELECT _post.post_id,\n" +
                                 "	     _user.username,\n" +
                                 "	     _post.topic,\n" +
                                 "  	   EXTRACT(DAYS FROM (NOW() - _post.date)) AS published_days_ago,\n" +
                                 "   	   EXTRACT(HOURS FROM (NOW() - _post.date)) AS published_hours_ago,\n" +
                                 "  	   EXTRACT(MINUTES FROM (NOW() - _post.date)) AS published_minutes_ago,\n" +
                                 "  	   FLOOR(EXTRACT(SECONDS FROM (NOW() - _post.date))) AS published_seconds_ago,\n" +
                                 "  	   comb.answer,\n" +
                                 "  	   comb.view\n" +
                                 "FROM ( SELECT posts.user_id,\n" +
                                 "  			      posts.post_id,\n" +
                                 "  	   		    posts.answer,\n" +
                                 "  	   		    SUM(CASE WHEN _view.user_id IS NULL THEN 0 ELSE 1 END) AS view\n" +
                                 "  	   FROM ( SELECT _post.user_id,\n" +
                                 "  			  		       _post.post_id, \n" +
                                 "           	 		     SUM(CASE WHEN _comment.comment_id IS NULL THEN 0 ELSE 1 END) AS answer\n" +
                                 "  	   		    FROM _post\n" +
                                 "  	   		    INNER JOIN _user ON _user.user_id = _post.user_id\n" +
                                 "    	   		  LEFT JOIN _comment ON _post.post_id = _comment.post_id\n" +
                                 "  	   		    GROUP BY _post.post_id\n" +
                                 "  	    	  ) AS posts\n" +
                                 "  		 LEFT JOIN _view ON _view.post_id = posts.post_id\n" +
                                 "  	   GROUP BY posts.user_id,\n" +
                                 "  		 		      posts.post_id,\n" +
                                 "  		 		      posts.answer\n" +
                                 "  	 ) AS comb\n" +
                                 "INNER JOIN _user ON comb.user_id = _user.user_id\n" +
                                 "INNER JOIN _post ON comb.post_id = _post.post_id\n" +
                                 "ORDER BY _post.date DESC;");
      }
    }
  });

  postMenuView.removeAttribute('id');
  return postMenuView;
}

postMenu.PostMenuView = postMenuView;

module.exports = postMenu;
