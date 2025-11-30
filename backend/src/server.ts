import http from 'http'
import products from './ecommere-data'
import fs from 'fs/promises'
import path from 'path'
import { pathToFileURL } from 'url'

const server = http.createServer(async (req,res)=>{
    const method = req.method
    const url = req.url
    const curretPAth = path.join(__dirname,'text.txt')
    const readFilee= async()=>{
        try{
                const docContent =await fs.readFile(curretPAth,'utf-8')
                console.log(docContent)
                return docContent
            }catch(error){
                console.log(error)
                return
        }
    }

    if(url === '/api/Products'){
        if(method==='GET'){
            res.writeHead(200,{'Content-type':"application/json"})
            const docContent = await readFilee();
            const data = {
                products:products,
                docContent:docContent
            }
            res.end(JSON.stringify(data))
        }else if(method==='POST'){
            let data=''
            req.on('data',(chunk)=>{
                data += chunk.toString()
            })

            req.on('end',async ()=>{
                const newProduct = JSON.parse(data)
                await fs.writeFile(curretPAth,data, 'utf8')
               
                res.writeHead(201,{'Content-type':'application/json'})
                res.end(JSON.stringify([...products,newProduct]))
              
            })
        }else if(method==='PATCH'){
            let data = ''
            req.on('data',(chunk)=>{
                data += chunk.toString()
            })

            req.on('end',()=>{
                const modifier = JSON.parse(data)
                const keys = Object.keys(modifier)
                const values = Object.values(modifier)
                const updatedProducts = products.map(product=>product.product_id===modifier.product_id?{...product,[keys[1]]:values[1]}:product)
                res.writeHead(202,{'Content-Type':'application.json'})
                res.end(JSON.stringify(updatedProducts))
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