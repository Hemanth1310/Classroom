import https from 'http'

const server = https.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type': 'text/plain'})
    res.end('helloe')
})

server.listen(3001,()=>{
    console.log(`Server running at http://localhost:3001/`);
})