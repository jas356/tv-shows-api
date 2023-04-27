import functions from "firebase-functions"
import  express  from "express"
import cors from "cors"
import { login, signup } from "./src/users.js"
import { getShows, addShow } from "./src/shows.js"

const app = express() //creates express app
app.use(cors())    //the () after cors is invoking the code running cors and same for express.json()
app.use(express.json())

// Routes (api functions) go HERE.... User routes
app.post("/signup", signup) //signup invokes funtion goes here
app.post("/login", login)   //login invokes function goes here

//Show Routes
app.get("/shows", getShows)
app.post("/shows", addShow)

//lets us run locally without emulators:
app.listen(3001, () => console.log(`Listening on http://localhost:3000...`)) //This line lets us test it locally

export const api = functions.https.onRequest(app) // exports our cloud function





