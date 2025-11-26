import https from 'http'
import StudentData from './data'
import { studentData } from './types'


const server = https.createServer((req,res)=>{
    const method = req.method
    const url = req.url

    if(url ==='/api/students'){
        if(method==='GET'){
            res.writeHead(200,"Request success",{'Content-type':'application\json','theme':'dark'})
            res.end(JSON.stringify(StudentData))
        }else if(method==='POST'){
            let tempData = ''
            req.on('data',(chunk)=>{
                tempData += chunk.toString()
            })
            
            req.on('end',()=>{
                let newStudentdata :studentData = JSON.parse(tempData)
                res.writeHead(201,{'Content-type':'text\plain'})
                res.end(JSON.stringify({...StudentData,[StudentData.length]:newStudentdata}))
            })
        }else if(method==='PATCH'){
            let tempData = ''
            req.on('data',(chunk)=>{
                tempData += chunk.toString()
            })

            req.on('end',()=>{
                const tempJson = JSON.parse(tempData)
                const tempKeys = Object.keys(tempJson)
                let newStudentArray
                if(tempKeys.includes('class')){
                     newStudentArray = StudentData.map(student=>student.id===tempJson.id?{...student,class:tempJson.class}:student)
                }else if(tempKeys.includes('name')){
                     newStudentArray = StudentData.map(student=>student.id===tempJson.id?{...student,name:tempJson.name}:student)

                }
               
                res.writeHead(201,{'Content-type':'application/json'})
                res.end(JSON.stringify(newStudentArray))
            })
            
        }
    }else if(url?.startsWith('/api/students/')){
        const id = Number(url.split('/')[3])
        const studentData :studentData[] = StudentData.filter((student)=>student.id===id)
        if(studentData.length>0){
            res.writeHead(200,{'Content-type':'application/json'})
            res.end(JSON.stringify(studentData))
        }else{
            res.writeHead(404,{'Content-type':"text/plain"})
            res.end('User Not found')
        }      
    }else{
        res.writeHead(405,{'Content-type':'text/plain'})
        res.end('METHOD not allowed')
    }
    const htm = '<h1>Students</h1>'
    req.on('data',()=>{

    })
})

server.listen(3001,()=>{
    console.log(`Server running at http://localhost:3001/`);
})