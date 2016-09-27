
/*
 * GET home page.
 */

exports.index = function(req, res){
	req.session.destroy();
  res.render('index', { title: 'Twitter' });
};