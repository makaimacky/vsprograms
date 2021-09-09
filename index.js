var express = require('Express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

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
app.post('/posts', (req, res)=>{
  const { authorization }=req.headers;
  if(authorization && authorization ==='123'){
   const post=req.body;
   console.log(post);
   posts.push(post);
   res.status(201).send(post);
  }else{
   res.status(403).send('Forbidden');
  }
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