const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const morgan = require('morgan');
//const { ResumeToken } = require('mongodb');

const app = express();

const dbURI = 'mongodb+srv://vkk:Databas3@cluster0.vofsx.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => app.listen(3000))
.catch((err) => console.log("LISTENING ERROR:", err));

// app.listen(3000);

app.set('view engine', 'ejs')

app.use(express.static('public'));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use(express.urlencoded());

// app.use(express.static('public'));


app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    
  const blogs = [
      {title: 'First post', snippet: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti.'},
      {title: 'Second post', snippet: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti.'},
      {title: 'Another post', snippet: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti.'}
  ];
  res.render('about', {title: 'About', blogs});
});

app.get('/blogs/create', (req, res) => {
  // res.send('<p>Just a paragraph</p>');
  res.render('create', {title: 'Create'});
});


app.get('/add-blog', (res, req) => {
    const blog = new Blog({
        title: 'new blog',
        snippet: 'this is a snippet',
        body: 'This is the first blogpost'
    })

    blog.save()
    .then(result => {
        console.log('SAVED!')
    })
    .catch(err => console.log("ADD-BLOG ERROR", err));
});

app.get('/all-blogs', (req, res) => {
    Blog.find()
    .then(result => {
        res.send(result);
    })
    .catch((err) => {
        console.log("ERROR IN ALL_BLOGS", err);
    })
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt: -1})
    .then(result => {
        res.render('index', {blogs: result, title: 'All Blogs'});
    })
    .catch((err) => {
        console.log("ERROR IN BLOGS", err);
    })
});

app.post('/blogs', (req, res) => { 
  const blog = new Blog(req.body);
  
  blog.save()
  .then(result => {
    res.redirect('/blogs')
  })
  .catch(err => {
    console.log("POST redirect error:", err)
  })
});

// app.delete('/blogs/:id', (req, res) => {
//   const id = req.params.id;
  
//   console.log(id);
//   // Blog.findByIdAndDelete(id)
//   // .then(result => {
//   //   res.json({redirect: '/blogs'})
//   //   console.log(result);
//   // })
//   // .catch(err => {
//   //   console.log("DELETE ERROR:", err);
//   // })
// })

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      console.log(result.title);
      res.render('details', { blog: result, title: 'Details' })
    })
    .catch(err => {
      console.log("blogs/id: ERROR", err);
      res.redirect('/404')
    });
});

app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log("DELETE ERROR:", err);
    });
});


app.use((req, res) => {
    // res.send('<p>Just a paragraph</p>');
    res.status(404).render('404', {title: '404'});
});

