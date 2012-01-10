module.exports = {
	site_name           : "lun's blog",
	site_description    : "Simple Node Todo",
	app_version         : "0.0.1",
	session_secret_key  : "asdasd22gAb",
	app_port            : 8080,
    app_ext             : '.shtml',
	
	db: {
		/* host : " ",
		name : "  ",
		port : 14460,
		user : " ",
		password : " " */
		
		host : "localhost",
		name : "dev"
		/* port : 14460,
		user : " ",
		password : " " */
	},
	params: {
		site_name           : "lun's blog",
		site_description    : "Simple Node Todo",
		item_limit          : 3
	}
}
