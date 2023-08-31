import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export function useFirestoreQuery() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getDocuments(
    collectionName,
    conditions = [],
    orderByField = "",
    orderByDirection = "asc",
    limitNumber = 0,
    callback = null
  ) {
    let q = collection(db, collectionName);
    conditions.forEach((condition) => {
      q = query(q, condition);
    });
    if (orderByField) q = query(q, orderBy(orderByField, orderByDirection));
    if (limitNumber) q = query(q, limit(limitNumber));

    try {
      setLoading(true);
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(documents);
      if (callback) callback(documents);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    loading,
    error,
    getDocuments,
  };
}

export function useFirestoreGetDocument() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getDocument(collectionName, id, callback = null) {
    try {
      setLoading(true);
      const docSnapshot = await getDoc(doc(db, collectionName, id));
      if (docSnapshot.exists()) {
        const documentData = { id: docSnapshot.id, ...docSnapshot.data() };
        setData(documentData);
        if (callback) callback(documentData);
      } else {
        setError("Document does not exist");
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    loading,
    error,
    getDocument,
  };
}

export function useFirestoreAddData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function addData(collectionName, newData, callback = null) {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, collectionName), newData);
      const addedData = { ...newData, id: docRef.id };
      setData(addedData);
      if (callback) callback(addedData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, addData };
}

export function useFirestoreUpdateData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function updateData(collectionName, id, newData, callback = null) {
    try {
      setLoading(true);
      await updateDoc(doc(db, collectionName, id), newData);
      const updatedData = { ...newData };
      setData(updatedData);
      if (callback) callback(updatedData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, updateData };
}

export function useFirestoreDeleteData() {
  const [data, setData] = useState(null);

  async function deleteData(collectionName, id, callback = null) {
    try {
      await deleteDoc(doc(db, collectionName, id));
      setData(id);
      if (callback) callback(id);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  return { data, deleteData };
}
