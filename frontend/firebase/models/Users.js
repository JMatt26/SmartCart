import { firestore } from "../config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

class User {
  constructor(name, email, phoneNumber, uid) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.uid = uid;
  }

  static async getUsers() {
    const usersCollection = collection(firestore, `users`);
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(
      (doc) =>
        new User(
          doc.data().name,
          doc.data().email,
          doc.data.phoneNumber,
          doc.uid
        )
    );
  }

  static async getUser(userId) {
    try {
      const userDoc = doc(firestore, "users", userId);
      const snapshot = await getDoc(userDoc);
      if (snapshot.exists) {
        return new User(
          snapshot.data().name,
          snapshot.data().email,
          snapshot.data().phoneNumber,
          userId
        );
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }

  static async createUser(user) {
    const newUserDocRef = doc(firestore, `users`, user.uid);
    await setDoc(newUserDocRef, {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  }

  static async updateUser(userId, user) {
    const userDoc = doc(firestore, `users/${userId}`);
    await updateDoc(userDoc, {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      uid: user.uid,
    });
  }

  static async deleteUser(userId) {
    const userDoc = doc(firestore, `users/${userId}`);
    await deleteDoc(userDoc);
  }
}

export { User };
