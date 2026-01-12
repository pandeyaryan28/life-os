import {
    collection,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    onSnapshot,
    query,
    serverTimestamp,
    writeBatch
} from "firebase/firestore";
import { db } from "./config";
import type { PlayerProfile, GameState } from "../types";

const USERS_COLLECTION = "users";

export const initializeUserProfile = async (userId: string, profile: PlayerProfile) => {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const profileRef = doc(db, USERS_COLLECTION, userId, "profile", "data");
    const statsRef = doc(db, USERS_COLLECTION, userId, "stats", "current");

    // Check if profile exists
    const docSnap = await getDoc(profileRef);
    if (!docSnap.exists()) {
        await setDoc(userRef, { createdAt: serverTimestamp() });
        const { stats, ...profileData } = profile;
        await setDoc(profileRef, { ...profileData, lastLogin: serverTimestamp() });
        await setDoc(statsRef, { ...stats, updatedAt: serverTimestamp() });
        return true;
    }
    return false;
};

export const syncCollection = <T extends { id: string }>(
    userId: string,
    collectionName: string,
    callback: (data: T[]) => void
) => {
    const q = query(collection(db, USERS_COLLECTION, userId, collectionName));
    return onSnapshot(q, (snapshot) => {
        const data: T[] = [];
        snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() } as T);
        });
        callback(data);
    });
};

export const syncDocument = <T>(
    userId: string,
    collectionName: string,
    docId: string,
    callback: (data: T) => void
) => {
    return onSnapshot(doc(db, USERS_COLLECTION, userId, collectionName, docId), (doc) => {
        if (doc.exists()) {
            callback(doc.data() as T);
        }
    });
};

export const upsertDocument = async (userId: string, collectionName: string, data: any) => {
    const docRef = doc(db, USERS_COLLECTION, userId, collectionName, data.id);
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

export const deleteDocument = async (userId: string, collectionName: string, docId: string) => {
    const docRef = doc(db, USERS_COLLECTION, userId, collectionName, docId);
    await deleteDoc(docRef);
};

export const migrateLocalStorageToFirestore = async (userId: string, gameState: GameState) => {
    const batch = writeBatch(db);

    // Profile
    const profileRef = doc(db, USERS_COLLECTION, userId, "profile", "data");
    const { stats, ...profileData } = gameState.player;
    batch.set(profileRef, { ...profileData, lastLogin: serverTimestamp() });

    // Stats
    const statsRef = doc(db, USERS_COLLECTION, userId, "stats", "current");
    batch.set(statsRef, { ...stats, updatedAt: serverTimestamp() });

    // Settings
    const settingsRef = doc(db, USERS_COLLECTION, userId, "system", "settings");
    batch.set(settingsRef, { ...gameState.settings, updatedAt: serverTimestamp() });

    // Quests
    gameState.quests.forEach(quest => {
        const questRef = doc(db, USERS_COLLECTION, userId, "quests", quest.id);
        batch.set(questRef, { ...quest, updatedAt: serverTimestamp() });
    });

    // Goals
    gameState.goals.forEach(goal => {
        const goalRef = doc(db, USERS_COLLECTION, userId, "goals", goal.id);
        batch.set(goalRef, { ...goal, updatedAt: serverTimestamp() });
    });

    // Economy/Expenses
    gameState.expenses.forEach(expense => {
        const expRef = doc(db, USERS_COLLECTION, userId, "economy", expense.id);
        batch.set(expRef, { ...expense, updatedAt: serverTimestamp() });
    });

    // Ledger (Expense History)
    gameState.expenseHistory.forEach(history => {
        const historyRef = doc(db, USERS_COLLECTION, userId, "ledger", history.id);
        batch.set(historyRef, { ...history, createdAt: serverTimestamp() });
    });

    // Manual Adjustments
    gameState.manualAdjustments.forEach(adj => {
        const adjRef = doc(db, USERS_COLLECTION, userId, "system", adj.id);
        batch.set(adjRef, { ...adj, createdAt: serverTimestamp() });
    });

    await batch.commit();
};
