const express=require('express');
const app=express();
const path=require('path');
const fs=require('fs');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));

app.get('/',function(req,res){
    fs.readdir(`./files`,function(err,files){
    //  console.log(files);
    res.render("index",{files});
    })
    // res.send("hello shushant");
});

app.get('/edit/:filename',function(req,res){
   fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,data){
    if(err) return res.send(err);
    res.render("edit",{data,filename:req.params.filename})
   })
});
app.get('/delete/:filename',function(req,res){
    fs.unlink(`./files/${req.params.filename}`,function(err){
     if(err) return res.send(err);
     res.redirect("/");
    })
 });

app.post('/update/:filename',function(req,res){
    fs.writeFile(`./files/${req.params.filename}`,req.body.filedata,function(err,data){
     if(err) return res.send(err);
     res.redirect('/');
    })
 });

 app.get('/createhissab', function (req, res) {
    res.render('createhissab'); // Ensure this matches your form's file name if using EJS.
});

app.post('/createhissab', function (req, res) {
    const { filename, filedata } = req.body;

    // Sanitize the filename to avoid directory traversal attacks
    const safeFilename = path.basename(filename);

    fs.writeFile(`./files/${safeFilename}.txt`, filedata, function (err) {
        if (err) {
            return res.status(500).send("Error creating file: " + err.message);
        }
        res.redirect('/'); // Redirect back to the home page after creating the file
    });
});

/*app.get('/create',function(req,res){
    const currentDate = new Date();
    
    const day = String(currentDate.getDate()).padStart(2, '0'); 
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const year = currentDate.getFullYear(); 

    const fn=`${day}-${month}-${year}.txt`;

    fs.writeFile(`./files/${fn}`,"helo shushant ji",function(err){
        if(err){
            res.send("something went wrong");
        }
        else{
            res.send("done");
        }
    })
});*/
app.listen(3000);