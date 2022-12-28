const express = require('express');
const cors = require('cors');
const multer = require("multer");
const mongodb = require('mongodb');

require('dotenv').config();


const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const storage = multer.memoryStorage();
const upload = multer({ storage });


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4txcfpw.mongodb.net/?retryWrites=true&w=majority`


// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// function verifyJWT(req, res, next) {

//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send('unauthorized access');
//     }

//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
//         if (err) {
//             return res.status(403).send({ message: 'forbidden access' })
//         }
//         req.decoded = decoded;
//         next();
//     })

// }


async function run() {
    try {
        // const appointmentOptionCollection = client.db('doctorsPortal').collection('appointmentOptions');


        app.post("/api/tasks", upload.single("image"), (req, res) => {
            mongodb.MongoClient.connect(uri, (error, client) => {
                if (error) throw error;
                const db = client.db("task-management");
                const collection = db.collection("tasks");

                // Insert the task and image into the database
                collection.insertOne({ task: req.body.task, image: req.file?.buffer }, (error, result) => {
                    if (error) throw error;
                    client.close();
                    res.send(result);
                });
            });
        });


        app.get("/api/tasks", (req, res) => {
            mongodb.MongoClient.connect(uri, (error, client) => {
                if (error) throw error;
                const db = client.db("task-management");
                const collection = db.collection("tasks");

                // Find all tasks in the database
                collection.find({}).toArray((error, tasks) => {
                    if (error) throw error;
                    client.close();
                    res.send(tasks);
                });
            });
        });

        app.put("/api/tasks/:id", (req, res) => {
            mongodb.MongoClient.connect(uri, (error, client) => {
                if (error) throw error;
                const db = client.db("task-management");
                const collection = db.collection("tasks");

                // Update the task with the given ID
                collection.updateOne(
                    { _id: mongodb.ObjectId(req.params.id) },
                    { $set: { task: req.body.task } },
                    (error, result) => {
                        if (error) throw error;
                        client.close();
                        res.send(result);
                    }
                );
            });
        });

        app.delete("/api/tasks/:id", (req, res) => {
            mongodb.MongoClient.connect(uri, (error, client) => {
                if (error) throw error;
                const db = client.db("task-management");
                const collection = db.collection("tasks");

                // Delete the task with the given ID
                collection.deleteOne({ _id: mongodb.ObjectId(req.params.id) }, (error, result) => {
                    if (error) throw error;
                    client.close();
                    res.send(result);
                });
            });
        });



        app.get("/api/completed-tasks", (req, res) => {
            mongodb.MongoClient.connect(uri, (error, client) => {
                if (error) throw error;
                const db = client.db("task-management");
                const collection = db.collection("tasks");

                // Find all tasks that are marked as completed
                collection.find({ completed: true }).toArray((error, tasks) => {
                    if (error) throw error;
                    client.close();
                    res.send(tasks);
                });
            });
        });

        app.delete("/api/completed-tasks/:id", (req, res) => {
            mongodb.MongoClient.connect(uri, (error, client) => {
                if (error) throw error;
                const db = client.db("task-management");
                const collection = db.collection("tasks");

                // Delete the task with the given ID
                collection.deleteOne({ _id: mongodb.ObjectId(req.params.id) }, (error, result) => {
                    if (error) throw error;
                    client.close();
                    res.send(result);
                });
            });
        });



    }
    finally {

    }
}
run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('Task management server is running');
})

app.listen(port, () => console.log(`Task management server running on ${port}`))