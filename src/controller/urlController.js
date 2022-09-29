const shortUrl = require("node-url-shortener");
const validUrl = require('valid-url');
const urlModel = require("../model/urlModel");
const shortid = require('shortid')



const baseUrl = 'http:localhost:3000'


const urlShortner = async function (req, res) {

    try {
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
    //-----checking in present in db-----------

    const findUrl = await urlModel.findOne({longUrl})
    if(findUrl) {
      return res.status(409).send({status: false, message: "url already exists"})
    }
    const urlCode = shortid.generate()

    const shortUrl = baseUrl + '/' + urlCode

    // const url = new Url({
    //     longUrl,
    //     shortUrl,
    //     urlCode
    // });
    let urlBody={
        urlCode: urlCode,
         longUrl:longUrl ,
        shortUrl:shortUrl 
    }

    const saveurl = await urlModel.create({urlBody})
     return res.status(201).send({ status: true, message:"shortUrl successfully created" ,data:urlBody })
    
    
        
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message})
    }
    


//     shortUrl.short("longUrl", function (err, shortUrl) {
//         // console.log(url);
//         if(err){
//             return res.status(400).send({ status: false, message: err.message })
//         }
//         else{
//             return res.status(200).send({ status: true, data: shortUrl })
//         }
//     });
   
//   console.log(shortUrl)
    // let urlBody={ longUrl:longUrl ,
    // shortUrl:shortUrl ,
    // urlCode: }

    // await urlModel.create()


}
module.exports.urlShortner=urlShortner;