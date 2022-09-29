const shortUrl = require("node-url-shortener");
const validUrl = require('valid-url');
const urlModel = require("../model/urlModel");

const urlShortner = async function (req, res) {
    let longUrl = req.body.originalUrl;

    // checking if url is present.
    if (!longUrl) {
        return res.status(400).send({ status: false, message: "url is required..." })
    }

    // checking if url is valid or not.
    if (!validUrl.isUri(longUrl)) {
        // console.log('Looks like an URI');
        return res.status(400).send({ status: false, message: "url is inValid..." })
    }


    shortUrl.short("longUrl", function (err, shortUrl) {
        // console.log(url);
        if(err){
            return res.status(400).send({ status: false, message: err.message })
        }
        else{
            return res.status(200).send({ status: true, data: shortUrl })
        }
    });
   
  console.log(shortUrl)
    // let urlBody={ longUrl:longUrl ,
    // shortUrl:shortUrl ,
    // urlCode: }

    // await urlModel.create()


}