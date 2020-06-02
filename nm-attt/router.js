const express = require('express')
const app = express()
app.listen(8080)

const fs = require('fs')

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const Crypt = require('hybrid-crypto-js').Crypt
const crypt = new Crypt()

app.post("/send_msg", jsonParser, function(req, res){
    const issuerKey = JSON.parse(fs.readFileSync('./issuerkey.json','utf-8'))
    
    //Read input data
    const message = JSON.stringify(req.body.message)
    const receiverPublicKey = JSON.stringify(req.body.public_key)

    //Sign message with issuer private key
    var signature = crypt.signature(issuerKey.privateKey, message)
    
    //Encrypt message with receiver public key
    var encrypted = crypt.encrypt(receiverPublicKey, message, signature)

    //Send data
    const data ={
        "encrypted" : JSON.parse(encrypted),
        "public_key" : issuerKey.publicKey
    }
    res.send(data)

})

app.get("/receive_msg", jsonParser, function(req,res){
    const receiverKey = JSON.parse(fs.readFileSync('./receiverkey.json','utf-8'))
    
    //Read sended data
    const encrypted = JSON.stringify(req.body.encrypted)
    const issuerPublicKey = JSON.stringify(req.body.public_key)

    var data = {}

    //Decrypt message with receiver private key
    try {
        var decrypted = crypt.decrypt(receiverKey.privateKey, encrypted)
    } catch(err) {
        data.valid = "false"
        res.send(data)
    }

    //Verify issuer's signature with issuer public key
    var verified = crypt.verify(issuerPublicKey, decrypted.signature, decrypted.message)

    if(verified){
        data.valid = "true"
        data.message = JSON.parse(decrypted.message)
    } else{
        data.valid = "false"
    }

    res.send(data)

})
