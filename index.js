var express = require('express')
var app = express()

var environment = require('./environments')
var PropertiesReader = require('properties-reader')
var properties = new PropertiesReader(environment)

var port = properties.get('main.app.port')
var bucketName = properties.get('gcp.gcs.bucketName')

app.listen(port)

console.log(`Listening on port ${port}`)

app.get('/', (req, res) => {
  try {
    listGCSFiles(bucketName, (files) => {
      res.status(200).send(JSON.stringify(files.map(f => f.name)))
    })
  } catch(err) {
    res.status(503).send(err)
  }
})

const listGCSFiles = async (bucketName, callback) => {
  const {Storage} = require('@google-cloud/storage')
  const storage = new Storage()
  const [files1] = await storage.bucket(bucketName).getFiles()
  callback(files1)
}
