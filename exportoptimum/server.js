require('dotenv').config();
 const express = require("express");
  const fs = require("fs");
  const cors = require("cors");
  const multer = require("multer");
  const path = require("path");
  const bodyParser = require('body-parser');
  const bcrypt = require("bcryptjs");
  const crypto = require("crypto");
  const app = express();
  const mysql = require('mysql2'); // Using promise version
  const jwt = require('jsonwebtoken');


  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use("/ProductsImages", express.static(path.join(__dirname, "public/ProductsImages")));
  app.use('/AssuranceImages', express.static(path.join(__dirname, 'public', 'AssuranceImages')));
  app.use("/AdminImages", express.static("public/AdminImages"));





  // File paths
  const CONTACTS_FILE = path.join(__dirname, "src/data/Contact.json");
  const EMAILS_FILE = path.join(__dirname, "src/Data/Emails.json");
  const aboutDataPath = path.join(__dirname,'src', 'Data', 'about.json');
  const ABOUT_FILE = path.join(__dirname, "src/Data/About.json");


  //----------------- Connect To Database (Mysql)-------------------------
// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  } else {
    console.log("Connected to MySQL database");
  }
});

  //----------------- End Connect To Database (Mysql)-------------------------



  // Helper Functions (Read/Write to JSON files)
  function readJsonFile(filePath) {
      try {
          const data = fs.readFileSync(filePath, "utf8");
          return JSON.parse(data || "[]");
      } catch (err) {
          console.error(`Error reading ${filePath}:`, err);
          return [];
      }
  }

  function writeJsonFile(filePath, data) {
      try {
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
      } catch (err) {
          console.error(`Error writing to ${filePath}:`, err);
      }
  }

  // *** ENSURE FILES EXIST ***
  const ensureFileExists = (filePath, initialData = "[]") => {
      try {
          fs.accessSync(filePath, fs.constants.F_OK);
      } catch (err) {
          try {
              fs.writeFileSync(filePath, initialData, "utf8");
              console.log(`${filePath} created successfully.`);
          } catch (createErr) {
              console.error(`Error creating ${filePath}:`, createErr);
          }
      }
  };

  ensureFileExists(CONTACTS_FILE, JSON.stringify({ messages: [] }));
  ensureFileExists(EMAILS_FILE);
  ensureFileExists(ABOUT_FILE);


// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "public/ProductsImages");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

  // Test route
  app.get("/", (req, res) => {
    res.send("Backend server is running.");
  });

// _____________________________ Products ________________________

// Get all products
app.get("/api/products", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error fetching products.");
    }
    res.json(results);
  });
});

// Get a product by ID
app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM products WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error fetching product.");
    }
    if (results.length === 0) {
      return res.status(404).send("Product not found.");
    }
    res.json(results[0]);
  });
});





// Add a new product
app.put(
  "/api/products/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  (req, res) => {
    try {
      console.log("Received PUT request for product ID:", req.params.id);
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);

      const { id } = req.params;
      const { title, description, MoreDescription } = req.body;
      const mainImage = req.files["mainImage"]
        ? `/ProductsImages/${req.files["mainImage"][0].filename}`
        : req.body.mainImage;
      const images = req.files["images"]
        ? req.files["images"].map(
            (file) => `/ProductsImages/${file.filename}`
          )
        : req.body.images ? JSON.parse(req.body.images) : [];

      const query =
        "UPDATE products SET title = ?, description = ?, MoreDescription = ?, mainImage = ?, images = ? WHERE id = ?";
      db.query(
        query,
        [
          title,
          description,
          MoreDescription,
          mainImage,
          JSON.stringify(images),
          id,
        ],
        (err, results) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Error updating product.");
          }
          if (results.affectedRows === 0) {
            return res.status(404).send("Product not found.");
          }
          res.json({ message: "Product updated successfully!" });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update product. Please try again." });
    }
  }
);


// Add a new product
app.post(
  "/api/products",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  (req, res) => {
    try {
      const { title, description, MoreDescription } = req.body;
      const mainImage = req.files["mainImage"]
        ? `/ProductsImages/${req.files["mainImage"][0].filename}`
        : null;
      const images = req.files["images"]
        ? req.files["images"].map(
            (file) => `/ProductsImages/${file.filename}`
          )
        : [];

      if (
        !title ||
        !description ||
        !MoreDescription ||
        !mainImage ||
        images.length !== 3
      ) {
        return res
          .status(400)
          .json({
            error:
              "All fields are required, and exactly 3 additional images must be uploaded.",
          });
      }

      const query =
        "INSERT INTO products (title, description, MoreDescription, mainImage, images) VALUES (?, ?, ?, ?, ?)";
      db.query(
        query,
        [
          title,
          description,
          MoreDescription,
          mainImage,
          JSON.stringify(images),
        ],
        (err, results) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Error adding product.");
          }
          res.status(201).json({ message: "Product added successfully!" });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add product. Please try again." });
    }
  }
);


// Delete a product
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM products WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error deleting product.");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Product not found.");
    }
    res.json({ message: "Product deleted successfully!" });
  });
});

// _____________________________ End Products ________________________


  // ---------------------------------------------------------------------------------------
  app.get("/api/blogs", (req, res) => {
    const query = "SELECT * FROM blogs";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Error fetching blogs.");
        }
        res.json(results);
    });
});

app.delete("/api/blogs/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM blogs WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Error deleting blog.");
        }
        if (results.affectedRows === 0) {
            return res.status(404).send("Blog not found.");
        }
        res.json({ message: "Blog deleted successfully!" });
    });
});
  // ---------------------------------------------------------------------------------------


  // Add a new message to Contact.json
  app.post("/api/messages", (req, res) => {
    const newMessage = req.body;

    if (!newMessage.fullName || !newMessage.email || !newMessage.message) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    fs.readFile(CONTACTS_FILE, "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Failed to read data" });
      }

      let messages = [];
      try {
        messages = JSON.parse(data).messages || [];
      } catch (e) {
        console.error("Error parsing JSON:", e);
        return res.status(500).json({ error: "Failed to parse data" });
      }

      messages.push(newMessage);

      fs.writeFile(CONTACTS_FILE, JSON.stringify({ messages }, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to save message" });
        }

        res.status(200).json({ message: "Message sent successfully" });
      });
    });
  });
  app.put("/api/messages/:index/read", (req, res) => {
    const messageIndex = parseInt(req.params.index, 10);

    if (isNaN(messageIndex) || messageIndex < 0) {
      return res.status(400).json({ error: "Invalid message index." });
    }

    const messages = getMessages();

    if (messageIndex >= messages.length) {
        return res.status(404).json({error: "Message not found"})
    }
    
    messages[messageIndex].readed = true;
    saveMessages(messages);
    res.json({ message: "Message marked as read." });
  });

  app.get("/api/messages", (req, res) => {
      try {
          const messages = getMessages();
          res.json(messages);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to retrieve messages." });
        }
  })

  //__________________________________________________________________

  //__________________________________________________________________
  // API Routes (Email Subscriptions)
  app.post("/api/subscribe", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const emails = readJsonFile(EMAILS_FILE);

    if (emails.includes(email)) {
        return res.status(400).json({ message: "Email already subscribed" });
    }

    emails.push(email);
    writeJsonFile(EMAILS_FILE, emails);

    res.status(200).json({ message: "Subscription successful" });
  });



// ---------------------------- Blogs Manage Start ----------------------------

// Get all blogs
app.get("/api/blogs", (req, res) => {
  const query = "SELECT * FROM blogs";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error fetching blogs.");
    }
    res.json(results);
  });
});

// Get a blog by ID
app.get("/api/blogs/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM blogs WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error fetching blog.");
    }
    if (results.length === 0) {
      return res.status(404).send("Blog not found.");
    }
    res.json(results[0]);
  });
});

const blogstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/BlogsImages"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const blogsupload = multer({ storage: blogstorage });

// Upload a blog image
app.post("/api/upload", blogsupload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const imageUrl = `/BlogsImages/${req.file.filename}`;
  res.json({ imageUrl });
});

// Update a blog
app.put("/api/blogs/:id", (req, res) => {
  const { id } = req.params;
  const { title, author, date, summary, image, category, text } = req.body;
  const query =
    "UPDATE blogs SET title = ?, author = ?, date = ?, summary = ?, image = ?, category = ?, text = ? WHERE id = ?";
  db.query(
    query,
    [title, author, date, summary, image, category, text, id],
    (err, results) => {
      if (err) {
        console.error("Database error during update:", err);
        return res.status(500).send("Error updating blog.");
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("Blog not found.");
      }
      res.json({ message: "Blog updated successfully!" });
    }
  );
});

// Add a blog
app.post("/api/blogs", (req, res) => {
  const { title, author, date, summary, image, category, text } = req.body;
  const query =
    "INSERT INTO blogs (title, author, date, summary, image, category, text) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [title, author, date, summary, image, category, text],
    (err, results) => {
      if (err) {
        console.error("Database error during blog creation:", err);
        return res.status(500).send("Error adding blog.");
      }
      res.json({ message: "Blog added successfully!" });
    }
  );
});


// Delete a blog
app.delete("/api/blogs/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM blogs WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error deleting blog.");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Blog not found.");
    }
    res.json({ message: "Blog deleted successfully!" });
  });
});



// ---------------------------- Blogs Manage End ----------------------------

  // ___________________________ Edit About start________________________________
// GET route to fetch about data
app.get('/api/about', (req, res) => {
  fs.readFile(aboutDataPath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading About data:', err);
      return res.status(500).send('Server Error');
    }

    res.json(JSON.parse(data));
  });
});

// PUT route to update about data
app.put('/api/about', (req, res) => {
  const updatedAboutData = req.body;

  // Validation checks (you can customize this based on your needs)
  if (
    !updatedAboutData ||
    !updatedAboutData["Who Are We?"] ||
    !updatedAboutData.vision ||
    !updatedAboutData.mission ||
    !Array.isArray(updatedAboutData.whyChooseUs)
  ) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  // Ensure that the "Why Choose Us" section is an array with objects having title and content
  if (
    !updatedAboutData.whyChooseUs.every(
      (item) => item.title && item.content
    )
  ) {
    return res.status(400).json({ message: 'Invalid Why Choose Us format' });
  }

  // Write the updated data to the about.json file
  fs.writeFile(aboutDataPath, JSON.stringify(updatedAboutData, null, 2), (err) => {
    if (err) {
      console.error('Error writing updated About data:', err);
      return res.status(500).send('Server Error');
    }

    console.log('✅ About data updated successfully');
    res.json({ message: 'About data updated successfully', data: updatedAboutData });
  });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));


  // ___________________________ Edit About End__________________________________

//------------------------Manage Quality Assurance -------------------------
// Multer setup for file uploads
const Assurancestorage = multer.diskStorage({
  destination: './public/AssuranceImages/',
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const AssuranceUpload = multer({
  storage: Assurancestorage,
  limits: { fileSize: 10000000 }, // 10MB limit (Adjust as needed)
  fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
  },
}).single('AssuranceImage');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
      return cb(null, true);
  } else {
      cb('Error: Images Only!');
  }
}

// GET Quality Assurance Paragraph
app.get('/api/quality-assurance-paragraph', (req, res) => {
  db.query('SELECT * FROM QualityAssuranceParagraphs', (err, results) => {
      if (err) {
          console.error('MySQL query error:', err);
          res.status(500).json({ error: 'Database error' });
          return;
      }
      res.json(results);
  });
});

// PUT Update Quality Assurance Paragraph
app.put('/api/quality-assurance-paragraph/:id', (req, res) => {
  const { description } = req.body;
  const IdParagraph = req.params.id;
  db.query(
      'UPDATE QualityAssuranceParagraphs SET description = ? WHERE IdParagraph = ?',
      [description, IdParagraph],
      (err, results) => {
          if (err) {
              console.error('MySQL query error:', err);
              res.status(500).json({ error: 'Database error' });
              return;
          }
          res.json({ message: 'Quality Assurance Paragraph updated successfully' });
      }
  );
});

// GET All Assurances
app.get('/api/assurances', (req, res) => {
  db.query('SELECT * FROM Assurances', (err, results) => {
      if (err) {
          console.error('MySQL query error:', err);
          res.status(500).json({ error: 'Database error' });
          return;
      }
      res.json(results);
  });
});

// POST Create Assurance
app.post('/api/assurances', (req, res) => {
  AssuranceUpload(req, res, (err) => {
      if (err) {
          return res.status(400).json({ error: err });
      }
      if (!req.file) {
        return res.status(400).json({error: 'No file uploaded'})
      }
      const { IdParagraph, AssuranceName } = req.body;
      const AssuranceImage = req.file.filename;

      db.query(
          'INSERT INTO Assurances (IdParagraph, AssuranceName, AssuranceImage) VALUES (?, ?, ?)',
          [IdParagraph, AssuranceName, AssuranceImage],
          (err, results) => {
              if (err) {
                  console.error('MySQL query error:', err);
                  return res.status(500).json({ error: 'Database error' });
              }
              res.json({ message: 'Assurance created successfully' });
          }
      );
  });
});

// PUT Update Assurance
app.put('/api/assurances/:id', (req, res) => {
  AssuranceUpload(req, res, (err) => {
      if (err) {
          return res.status(400).json({ error: err });
      }
      const { AssuranceName } = req.body;
      const AssuranceImage = req.file ? req.file.filename : null;
      const idAssurance = req.params.id;
      let query = 'UPDATE Assurances SET AssuranceName = ?';
      let params = [AssuranceName];

      if (AssuranceImage) {
          query += ', AssuranceImage = ?';
          params.push(AssuranceImage);
      }

      query += ' WHERE idAssurance = ?';
      params.push(idAssurance);

      db.query(query, params, (err, results) => {
          if (err) {
              console.error('MySQL query error:', err);
              return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Assurance updated successfully' });
      });
  });
});

// DELETE Assurance
app.delete('/api/assurances/:id', (req, res) => {
  const idAssurance = req.params.id;
  db.query('DELETE FROM Assurances WHERE idAssurance = ?', [idAssurance], (err, results) => {
      if (err) {
          console.error('MySQL query error:', err);
          res.status(500).json({ error: 'Database error' });
          return;
      }
      res.json({ message: 'Assurance deleted successfully' });
  });
});
//------------------------End Manage Quality Assurance -------------------------


  // ___________________________Key Figures _______________________________
// ✅ Fetch key figures from SQL database
app.get("/api/keyfigures", (req, res) => {
  const query = "SELECT * FROM key_figures";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error fetching key figures.");
    }
    res.json(results);
  });
});

// ✅ Update key figure in SQL database
app.put("/api/keyfigures/:id", (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const query = "UPDATE key_figures SET value = ? WHERE id = ?";
  db.query(query, [value, id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error updating key figure.");
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Key figure not found.");
    }

    // Fetch the updated row to return it
    const selectQuery = "SELECT * FROM key_figures WHERE id = ?";
    db.query(selectQuery, [id], (selectErr, selectResults) => {
        if(selectErr){
            console.error("database error: ", selectErr);
            return res.status(500).send("Error fetching updated Key figure");
        }
        res.json(selectResults[0]);
    });
  });
});



// ___________________________ End Key Figures ___________________________________
app.get("/api/current-user", async (req, res) => {
  try {
      const userId = req.userId; // Assuming authentication middleware sets this
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({
          name: user.name,
          profile_pic: `/AdminImages/${user.profileImage}`, // Ensure correct path
      });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});

// ___________________________  Login
// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    const user = results[0];
    const hashedPassword = user.password;

    try {
      const match = await bcrypt.compare(password, hashedPassword);
      if (match) {
        // Generate JWT Token
        const token = jwt.sign(
          { id: user.id, username: user.username, email: user.email },
          process.env.JWT_SECRET, // The secret key from .env
          { expiresIn: "1h" }
        );

        res.json({
          success: true,
          message: "Login successful",
          token,
          user: { id: user.id, username: user.username, email: user.email, name: user.name },
        });
      } else {
        return res.status(401).json({ success: false, message: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Error during password comparison:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ success: false, message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Token has expired or is invalid. Please log in again." });
    }
    req.user = decoded;
    next();
  });
};

// Example protected route
app.get("/admin", authenticateJWT, (req, res) => {
  res.json({ success: true, message: "Welcome to the admin page", user: req.user });
});

// _______________ Login end

//__________________Manage Admin Profile ____________________________4

// Multer configuration for Profile Images
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "public/AdminImages");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${Date.now()}-${file.originalname}`); // Add 'profile-' prefix
  },
});

const profileUpload = multer({ storage: profileStorage });

// Image upload route for profile images
app.post('/upload-image', profileUpload.single('profile_pic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  res.json({ success: true, filename: `AdminImages/${req.file.filename}` });
});

// Update user profile route (your existing update-profile route)
app.put('/update-profile/:id', (req, res) => {
  const userId = req.params.id;
  const { name, username, email, profile_pic } = req.body;

  const query = `UPDATE users SET name = ?, username = ?, email = ?, profile_pic = ? WHERE id = ?`;
  db.query(query, [name, username, email, profile_pic, userId], (err, results) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  });
});




//__________________End Manage Admin Profile ____________________________

// ___________________________ Change Password Start ___________________________________

// Check current password route (corrected)
app.post('/check-password/:id', async (req, res) => {
  const userId = req.params.id;
  const { currentPassword } = req.body;
  const trimmedPassword = currentPassword.trim(); // Trim input
  app.get('/test-password/:id', (req, res) => {
    const userId = req.params.id;
    const query = `SELECT password FROM users WHERE id = ?`;
    db.query(query, [userId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(500).send('Error');
      }
      res.send(results[0].password);
    });
  });
  

  const query = `SELECT password FROM users WHERE id = ?`;
  db.query(query, [userId], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const hashedPassword = results[0].password;
    try {
      const match = await bcrypt.compare(trimmedPassword, hashedPassword);
      res.json({ match });
    } catch (bcryptErr) {
      console.error('Bcrypt compare error:', bcryptErr);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
});

// Change password route
app.put('/change-password/:id', (req, res) => {
  const userId = req.params.id;
  const { newPassword } = req.body;

  const query = `UPDATE users SET password = ? WHERE id = ?`;
  db.query(query, [newPassword, userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Password changed successfully' });
  });
});
// ___________________________ Change Password End _____________________________________
const PORT = process.env.PORT || 5000;
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
