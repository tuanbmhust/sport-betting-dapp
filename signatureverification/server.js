const express = require('express')
const app = express()
app.listen(8080)

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const Crypt = require('hybrid-crypto-js').Crypt
const crypt = new Crypt()

const jwt = require('jsonwebtoken')

//Assume this is receiver public & private key

function KeyPair(privateKey, publicKey){
    this.priKey = privateKey;
    this.pubKey = publicKey;
}

var receiverKey = new KeyPair('-----BEGIN RSA PRIVATE KEY-----\r\n' +
'MIICXgIBAAKBgQC3M6ZWIU3a0vBrNskAv6pSnbnyemYCvOMJ2xl2vZtIL05YlfzH\r\n' +
'CmqsR30r/ISXu/u8YCIAHlZ/9r1U98wZeC2NFBaGVydklw4HccGrKKGer2Hg6RCQ\r\n' +
'RmLZYxiFYM3gmjnm9BhTQjKodtJmkn7hkvMJtfQ5v3mYOQJqUgzzcE6CoQIDAQAB\r\n' +
'AoGBAKnFzoaQ1HJN+oiQu5LbC38GNbSUYwZ0fr26cg2MxmMNm8ASNq9JYvOGSGRD\r\n' +
'3agzh6TZPYj4lFZ/lJMyE80ihqpcddSaGm0l4qNOm5tHBjGZeowuZBBYed1b55hw\r\n' +
'XZzEbieM4HVco0sjdP5+2a54mTmn8T9wfffeubMf8Yexe2XBAkEA7XWsjnTAvrIo\r\n' +
'lbtTI069xn4p4iouJGECv0XIdPNEAY11K0N7KR8VCbFd+alu9bO5J0KG+sLcFs9u\r\n' +
'L97Hm2Y5eQJBAMWBeQQ9v3/kSh804Ca8RJIFy8l0UD/zbFnkvD0VlNYIwKmxpGk/\r\n' +
'Cy4rsaa9J4HUM67J8lNrwhQJujjuW/kccGkCQD3/hlEfbJ+ddnk5kohaa7Qihp71\r\n' +
'MlzvMz9rYd4fEbdyDpCAKuzen6iLNaUUttLR3NrCROm97KbL+9Hl0aniM8kCQQCh\r\n' +
'hEdOM50W3r/LE3e31cER1ZGZVviFw/E49nkGT07fVlsQq0i0FS10faETpZ7Yaow1\r\n' +
'hcsZc4dM0cOr6Snn59z5AkEAlYrzCzelKKiE4oRE+fSeswhmZI+CAbfxx5w+7MzY\r\n' +
'bkZ4Y0JmA/B3ml5L+hcu3+FTTHteg3xuEOHGKRKSn6XAHw==\r\n' +
'-----END RSA PRIVATE KEY-----\r\n', '-----BEGIN PUBLIC KEY-----\r\n' +
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3M6ZWIU3a0vBrNskAv6pSnbny\r\n' +
'emYCvOMJ2xl2vZtIL05YlfzHCmqsR30r/ISXu/u8YCIAHlZ/9r1U98wZeC2NFBaG\r\n' +
'Vydklw4HccGrKKGer2Hg6RCQRmLZYxiFYM3gmjnm9BhTQjKodtJmkn7hkvMJtfQ5\r\n' +
'v3mYOQJqUgzzcE6CoQIDAQAB\r\n' +
'-----END PUBLIC KEY-----\r\n')


app.post("/verify_signature", jsonParser, function(req, res) {
    //Get data and decode
    const message = {
        "hEmail" : req.body.hashed_email,
        "hUsername" : req.body.hashed_username
    }
    const issuerPublicKey = jwt.decode(req.body.public_key)
    const signature = JSON.stringify(jwt.decode(req.body.signature))
    //Verify
    var verified = crypt.verify(issuerPublicKey, signature, message)
    //Response
    res.send(verified ? {"message": "Valid signature"} : {"message": "Invalid signature"})
})

app.post("/verify_token", jsonParser, function(req,res) {
    var hToken = req.body.hashed_token
    var hPublicKey = req.body.public_key
    var hSignature = req.body.signature
    //Decode
    var token = jwt.decode(hToken)
    var issuerPublicKey = jwt.decode(hPublicKey)
    var signature = JSON.stringify(jwt.decode(hSignature))
    //Verify
    var verified = crypt.verify(issuerPublicKey, signature, token)
    //Response
    res.send(verified ? {"message" : "Token valid"} : {"message" : "Token invalid"})
})
