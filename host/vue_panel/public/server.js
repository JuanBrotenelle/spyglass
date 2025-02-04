const https = require('https')
const http = require('http')
const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(express.static(path.join(__dirname)))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

const certPath = path.join(__dirname, 'certs')
const options = {
  key: fs.readFileSync(path.join(certPath, 'privkey.pem')),
  cert: fs.readFileSync(path.join(certPath, 'fullchain.pem')),
}

const PORT = 443
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server is running on https://localhost:${PORT}`)
})
http
  .createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` })
    res.end()
  })
  .listen(80, () => {
    console.log(
      'HTTP Server running on http://localhost:80 (redirects to HTTPS)',
    )
  })
