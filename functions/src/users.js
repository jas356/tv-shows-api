import { FieldValue } from "firebase-admin/firestore";
import jwt from "jsonwebtoken";
import { db } from "./dbConnect.js";
import { secretKey } from "../secrets.js";

const collection = db.collection('users')

export async function signup(req, res) {
    const {email, password } = req.body
    if(!email || !password ) {
        res.status(400).send({message: "Email and password are both required. Password must be 6 characters or more."})
        return
    }
    // TODO: Check if email is already in use
    const newUser = {
        email: email.toLowerCase(),
        password,
        createdAt: FieldValue.serverTimestamp(), //this is how we store time imported from firebase
    }
    await collection.add(newUser)
    //once the user is added... log them in...
    login(req, res)
}

export async function login(req, res) {
    const {email, password } = req.body
    if(!email || !password) {
        res.status(400).send({message: "Email and password are both required."})
        return
    }
    const users = await collection
    .where('email', "==", email.toLowerCase())
    .where("password", "==", password)
    .get()
    let user = users.docs.map(doc => ({...doc.data(), id: doc.id}))[0]//bracktet 0 is saying just give me the first one in the array
    if(!user) {
        res.status(400).send({message: "Invalid email and/or password."})
        return
    }
    delete user.password
    const token = jwt.sign(user, secretKey)
    res.send({user, token}) //Should send back an object with {email, createdAt, id} and deletes the password so you dont get your password on the frontend
}


