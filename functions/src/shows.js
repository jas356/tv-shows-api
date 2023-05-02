import { FieldValue } from "firebase-admin/firestore";
import jwt from "jsonwebtoken"
import { db } from "./dbConnect.js";
import { secretKey } from "../secrets.js";

const collection = db.collection("shows")

export async function getShows(req, res) {
    const showsCollection = await collection.get()
    const shows = showsCollection.docs.map(doc => ({...doc.data(), id: doc.id})) // (...) Spread operator is taking the data out the array using map()
    res.send(shows)
}


export async function addShow(req, res) {
    const token = req.headers.authentication //this verfies the token
    if(!token) {
        res.status(401).send({message: "Unauthorized. A valid token is required."})
        return
    }
    const decoded = jwt.verify(token, secretKey) //verifies the token and will add the show
    if(!decoded) {
        res.status(401).send({message: "Unauthorized. A valid token is required."})
        return
    }
    const { title, poster, seasons } = req.body
    if(!title || !poster || !seasons) {
        res.status(400).send({message: "Show Title, Poster, and Seasons are required."})
        return
      // (can also say same as line 16 and 17)  return res.satus(400).send({message: "Show Title is required."})
    }

    const newShow = {
        title,
        poster,
        seasons,
        createdAt: FieldValue.serverTimestamp(),
    }
    await collection.add(newShow) //add the new show
    getShows(req, res) // this line returns the updated list
}

export async function deleteShow(req, res) {
    const { showId } = req.params
    await collection.doc(showId).delete()
    getShows(req, res)
    
}