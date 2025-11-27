import http from 'http'
import products from './ecommere-data'

const server = http.createServer((req,res)=>{
    const method = req.method
    const url = req.url

    if(url === '/api/Products'){
        if(method==='GET'){
            res.writeHead(200,{'Content-type':"application/json"})
            res.end(JSON.stringify(products))
        }else if(method==='POST'){
            let data=''
            req.on('data',(chunk)=>{
                data += chunk.toString()
            })

            req.on('end',()=>{
                const newProduct = JSON.parse(data)
                res.writeHead(201,{'Content-type':'application/json'})
                res.end(JSON.stringify([...products,newProduct]))
            })
        }else{
            res.writeHead(405,{'Content-type':'plain/text'})
            res.end('Invalid METHOD')
        }
    }else if (url?.startsWith('/api/Products/')){
        const id = url.split('/')[3]
        if(products.some(product=>product.product_id===id)){
            if(method==='GET'){
                const filteredProduct = products.filter(product=>product.product_id===id)
                res.writeHead(200,{'Content-type':'application/json'})
                res.end(JSON.stringify(filteredProduct))
            }else if(method==='DELETE'){
                const filteredProduct = products.filter((product)=>product.product_id!==id)
                res.writeHead(201,{'Content-type':'application/json'})
                res.end(JSON.stringify(filteredProduct))
            }else{
                res.writeHead(405,{'Content-type':'text/plain'})
                res.end('INVALID METHOD')
            }
        }else{
            res.writeHead(404,{'Content-type':'plain/text'})
            res.end('PRODUCT NOT FOUND')
        }
    }
})

server.listen(3003,()=>{
    console.log('Server running on 3003')
})