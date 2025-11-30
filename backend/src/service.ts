import http from 'http'
import fs from'fs/promises'
import products from './ecommere-data'
import path from 'path'
const server = http.createServer((req,res)=>{
    const method = req.method
    const url= req.url

    if(url==='/api/products'){
        if(method==='GET'){
            res.writeHead(200,{'content-type':'application/json'})
            res.end(JSON.stringify(products))
        }else if(method==='POST'){
            let data=''
            req.on('data',(chuck)=>{
                data = data+chuck
            })

            req.on('end',async()=>{
                const dataPArsed = JSON.parse(data)
                const newProducts = [...products,dataPArsed]
                const fielpath = path.join(__dirname,'text.txt')
                await fs.writeFile(fielpath,JSON.stringify(newProducts),'utf-8')
                res.writeHead(202,{'content-type':'application/json'})
                res.end(JSON.stringify(newProducts))
            })
        }else if(method==='PATCH'){
            let data=''
            req.on('data',(chunk)=>{
                data += chunk
            })
            req.on('end',()=>{
                const dataParsed = JSON.parse(data)
                const updatedProducts = products.map(product=>product.product_id===dataParsed.product_id?{...product,name:dataParsed.name}:product)
                res.writeHead(200,{'content-type':'application/json'})
                res.end(JSON.stringify(updatedProducts))
            })
        }else{
            res.writeHead(405,{'Content-Type':'plain/html'})
            res.end('<h1>INVALID METHOD Retry</h1>')
        }
    }else{
        console.log('Invalid path')
    }
   
})

server.listen(3006,()=>{
    console.log('service listening at 3006')
})