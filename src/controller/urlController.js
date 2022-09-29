const shortUrl = require("node-url-shortener");
const validUrl = require('valid-url');
const urlModel = require("../model/urlModel");
const shortid = require('shortid')



const baseUrl = 'http://localhost:3000'


const urlShortner = async function (req, res) {

    try {
        let longUrl = req.body.longUrl;

    // checking if url is present.
    if (!longUrl) {
        return res.status(400).send({ status: false, message: "url is required..." })
    }

    // checking if url is valid or not.
    if (!validUrl.isUri(longUrl)) {
        // console.log('Looks like an URI');
        return res.status(400).send({ status: false, message: "url is inValid..." })
    }
    //-----checking in present in db-----------

    const findUrl = await urlModel.findOne({longUrl})
    if(findUrl) {
      return res.status(409).send({status: false, message: "url already exists"})
    }
    const urlCode = shortid.generate(longUrl)

    const shortUrl = baseUrl + '/' + urlCode

    
    let urlBody={
        longUrl:longUrl ,
        shortUrl:shortUrl,
        urlCode: urlCode
    }
   


    const saveUrl = await urlModel.create(urlBody)
     return res.status(201).send({ status: true, message:"shortUrl successfully created" ,data:urlBody })
    
    
        
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message})
    }

}
///--------------get Url api--------------------

const getUrl = async function(req,res){
    try {
        let urlCode= req.params.urlCode
        
        if (!urlCode) {
            return res.status(400).send({ status: false, message: "shorturl is required..." })
        }
        
        const findUrl = await urlModel.findOne({urlCode})
        
        if (!findUrl) {
            return res.status(400).send({ status: false, message: "shortUrl doesn't exist in db..." })
        }
        
        return res.status(302).redirect(findUrl.longUrl)
        
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message})
    }
}

module.exports.urlShortner=urlShortner;
module.exports.getUrl=getUrl



