const ytdl = require('ytdl-core');
const express = require('express');
app = express();

app.get('/getRawURL', async (req, res, next) => {
	try {
		let url = req.query.url;
		if(!ytdl.validateID(url)) {
			return res.send("Invalid ID");
		}
		res.send(await (await ytdl.getInfo(url)).player_response.streamingData.formats[0].url)
	} catch (err) {
		console.error(err);
	}
});

app.listen(3000, ()=>{
    console.log('Running on port 3000');
})