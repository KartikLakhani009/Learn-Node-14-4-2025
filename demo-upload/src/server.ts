import express from 'express';

import multer from 'multer';
import path from 'path';


const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '.', 'views'));

const storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, path.join(__dirname, '.', 'uploads'));
  },
  filename:(req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }

})

const upload = multer({ storage: storage });

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, '.', 'uploads')));
// Middleware to parse JSON requests
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('home');
});


app.post('/upload-single', upload.single('singleFile'), (req, res) => {
  console.log(req.file);
  req.file ? res.send(`Image uploaded successfully. <a href="/uploads/${req.file.filename}">View Image</a>`) : res.status(400).send('No file uploaded');
});

app.post('/upload-multiple-files', upload.fields([{name:'firstFile'},{name:'secondFile'}]), (req, res) => {
  console.log(req.files);
  if (req.files) {
    res.send(`multiple-files Files uploaded successfully:`);
  } else {
    res.status(400).send('No files uploaded');
  }
});

app.post('/upload-multiple', upload.array('multipleFiles', 10), (req, res) => {
  console.log(req.files);
  if (req.files) {
    const files = req.files as Express.Multer.File[];
    res.send(`Multiple Files uploaded successfully: ${files.map(file => file.filename).join(', ')}`);
  } else {
    res.status(400).send('No files uploaded');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});