const http = require("http");
const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql');

const dbCon = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'my_finances',
	password: 'Cicici123!'
});

dbCon.connect(function(err) {
	if (err) throw err;
});

const host = 'localhost';
const port = 8000;

const _rootDir = '../public';

function mimeFromExt(ext)
{
	
	switch(ext)
	{
		case 'html':
			return 'text/html';
		case 'css':
			return 'text/css';
		case 'js':
			return 'text/javascript';
		case 'json':
			return 'application/json';
		case 'png':
			return 'image/png';
		case 'jpg':
			return 'image/jpg';
		case 'jpeg':
			return 'image/jpeg';
		default:
			return 'text/plain';
	}
}

function getTransactions(req, res)
{
	/*
SELECT column_name(s)
FROM table1
LEFT JOIN table2
ON table1.column_name = table2.column_name;
	*/
	// id":3,"item_id":3,"price":9.49,"eid_from":2,"eid_to":3,"time_stamp":"2023-02-08T19:37:43.000Z"
	dbCon.query("SELECT `transactions`.`id`, `transactions`.`item_id`, `transactions`.`price`, `transactions`.`eid_from`, `transactions`.`eid_to`, `transactions`.`time_stamp`, `items`.`name` as `item_name`, `groups_items`.`group_id` as `group_id`, `groups`.`group_name`, `groups`.`group_hidden`  FROM `transactions` LEFT JOIN `items` ON `transactions`.`item_id` = `items`.`id` LEFT JOIN `groups_items` ON `transactions`.`item_id` = `groups_items`.`item_id` LEFT JOIN `groups` ON `groups_items`.`group_id` = `groups`.`id`;", function (err, result) {
		if (err) 
			throw err;

		res.setHeader('Content-Type', 'application/json');
		res.writeHead(200);
		res.end(JSON.stringify(result));
	});
}

const routers = [
	{
		name: '/transactions',
		handler: getTransactions
	}	
];

function getRouter(name)
{
	return routers.find(e => e.name === name);
}

const requestListener = function (req, res) {
	console.log('requesting: ', req.url);

	const router = getRouter(req.url);
	if (router)
	{
		router.handler(req, res);
		return;
	}

	let fileName = req.url.substring(1);



	if (fileName.length === 0)
		fileName = 'index.html';

	fs.readFile( path.join(__dirname, _rootDir, fileName) ).then(content => {
		const extension = fileName.split('.').pop();
	    res.setHeader('Content-Type', mimeFromExt(extension));
	    res.writeHead(200);
	    res.end(content);
	}).catch(err => {
		res.writeHead(500);
		res.end('Something went wrong while handling the request.');
		return;
	});
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {

    console.log(`Server is running on http://${host}:${port}`);
});