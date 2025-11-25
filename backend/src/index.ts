import https from 'http'
import students from './data'
const server = https.createServer((req,res)=>{

    
    const htm = '<h1>Students</h1>'
    res.writeHead(200,{'Content-Type': 'application/json'})
    res.end(JSON.stringify(students))
})

server.listen(3001,()=>{
    console.log(`Server running at http://localhost:3001/`);
})