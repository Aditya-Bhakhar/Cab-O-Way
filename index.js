const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const mustacheExpress = require("mustache-express");
// Initialize Firebase Admin SDK

const serviceAccount = require("./key.json");
const app = express();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://cab-rental-6445a-default-rtdb.asia-southeast1.firebasedatabase.app/",
});
const authToken = '';

const client = twilio("",authToken);

// Configure Mustache as the templating engine
app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public/"));

const db = admin.firestore();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Define routes for each HTML page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/about.html");
});

app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/contact.html");
});

app.get("/book", (req, res) => {
  res.sendFile(__dirname + "/book.html");
});

app.get("/packages", async (req, res) => {
  const data = await db.collection("packages").get();
  const documents = [];
  data.docs.forEach((doc) => {
    const docData = doc.data();
    docData.id = doc.id;
    documents.push(docData);
  });
  res.render("packages", { documents });
});

app.get("/fleets", async (req, res) => {
  const data = await db.collection("cab").get();
  const documents = [];
  data.docs.forEach((doc) => {
    const docData = doc.data();
    docData.id = doc.id;
    documents.push(docData);
  });
  res.render("fleets", { documents });
  // res.sendFile(__dirname + '/fleets.html');
});
// form submiting
app.post("/submit", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const from = req.body.from;
    const to = req.body.to;
    const date = req.body.date;
    const car = req.body.car;
    const data = {
      name: name,
      email: email,
      phone: phone,
      from: from,
      to: to,
      date: date,
      car: car,
    };
    const response = await db.collection("booking").doc().set(data);
    // process the form data here
    client.messages
      .create({
        messagingServiceSid: '',
        to: "+919925347434",
        from: "+12183047487",
        body:
          name +
          " has Booked a cab from " +
          from +
          " to " +
          to +
          " on " +
          date +
          " of car " +
          car +
          " his phone Number is " +
          phone,
      })
      .then((message) => console.log(message.sid))
      .catch((err) => console.error(err));

    if (response) {
      res.sendFile(__dirname + "/index.html");
    }
  } catch (error) {
    res.sendFile(__dirname + "/index.html");
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server started on port 3000");
});
