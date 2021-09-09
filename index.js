var express = require('Express');
const cookieParser=require('cookie-parser');


var app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use((req, res,next)=>{
console.log(`${req.method}-${req.url}`);
next();
});

const users=[{name:'Anson', age:'22'},{name:'Bernard', age:'32'},{name:'Macky', age:'28'}];
const posts=[{title:"my fav"},{title:"my love"}];

app.get('/', (req, res)=>{
   res.send({
      me:'hello world',
      user:'{}'
   });
});
app.get('/users', (req, res)=>{
   res.status(200).send(users);
});

app.get('/users/:name', (req, res)=>{
   const { name }= req.params;
   const user=users.find((user)=>user.name===name);
   if(user)
      res.status(200).send(user);
   else
      res.status(404).send('User not found');  
});
app.post('/', (req, res)=>{
   const user = req.body;
   users.push(user);
   res.status(201).send("Create Users")  
});


function validation_auth_token(req, res, next){
   console.log('Inside Validate Auth Token')
   const { authorization }=req.headers;
   if(authorization && authorization ==='123'){
      next();
   }else{
      res.status(403).send('msg:Forbidden. Incorrect Credentials');

   }

}
app.post('/posts', validation_auth_token,(req, res)=>{
   const post=req.body;
   console.log(post);
   posts.push(post);
   res.status(201).send(post);
});

function validate_cookie(req,res, next){
   const { cookies }=req;
   console.log(cookies);

   if('session_id' in cookies){
      console.log('Session ID Exist');
      if(cookies.session_id==='123456') next();
      else res.status(403).json({msg:'Not Authenticated'}); 
   }  else res.status(403).json({msg:'Not Authenticated'});
}
app.get('/protected',validate_cookie,(req, res)=>{
  
   res.status(200).json({msg:'You are authorize'})
});



app.get('/signin',validate_cookie,(req, res)=>{
   res.cookie('session_id','123456');
   res.status(200).json({msg:'Log in'})
});

app.get('/posts', (req, res)=>{
   console.log(req.query);
   const { title } = req.query;      
   if (title){
      const post=posts.find((post)=>post.title===title); 
      if(post) res.status(200).send(post);
      else res.status(404).send('Not found');
   }
   res.status(200).send(posts);
})


//var things = require('./things.js');
//app.use('/things', things);
app.listen(3000);