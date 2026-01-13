import {
    collection,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    onSnapshot,
    query,
    serverTimestamp,
    writeBatch,
    runTransaction
} from "firebase/firestore";
import { db } from "./config";
import type { PlayerProfile, GameState } from "../types";

const USERS_COLLECTION = "users";

export const initializeUserProfile = async (userId: string, profile: PlayerProfile) => {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const profileRef = doc(db, USERS_COLLECTION, userId, "profile", "data");
    const statsRef = doc(db, USERS_COLLECTION, userId, "stats", "current");
    const walletRef = doc(db, USERS_COLLECTION, userId, "economy", "wallet");

    // Check if profile exists
    const docSnap = await getDoc(profileRef);
    if (!docSnap.exists()) {
        await setDoc(userRef, { createdAt: serverTimestamp() });
        const { stats, credits, ...profileData } = profile;
        await setDoc(profileRef, { ...profileData, lastLogin: serverTimestamp() });
        await setDoc(statsRef, { ...stats, updatedAt: serverTimestamp() });
        // Initialize wallet with credits
        await setDoc(walletRef, {
            credits: credits || 0,
            updatedAt: serverTimestamp()
        });
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
    }, (error) => {
        console.error(`Firestore Sync Error [${collectionName}]:`, error);
    });
};

export const syncDocument = <T>(
    userId: string,
    collectionName: string,
    docId: string,
    callback: (data: T | null) => void
) => {
    return onSnapshot(doc(db, USERS_COLLECTION, userId, collectionName, docId), (doc) => {
        if (doc.exists()) {
            callback(doc.data() as T);
        } else {
            callback(null);
        }
    }, (error) => {
        console.error(`Firestore Doc Sync Error [${collectionName}/${docId}]:`, error);
    });
};

const cleanData = (data: any) => {
    const cleaned = { ...data };
    Object.keys(cleaned).forEach(key => {
        if (cleaned[key] === undefined) {
            delete cleaned[key];
        } else if (cleaned[key] !== null && typeof cleaned[key] === 'object' && !Array.isArray(cleaned[key])) {
            cleaned[key] = cleanData(cleaned[key]);
        }
    });
    return cleaned;
};

export const upsertDocument = async (userId: string, collectionName: string, data: any) => {
    try {
        const docId = data.id || (collectionName === "profile" ? "data" : (collectionName === "stats" ? "current" : (collectionName === "system" ? "settings" : null)));

        if (!docId) {
            console.error(`Missing ID for collection: ${collectionName}`, data);
            throw new Error(`Critical Error: Document ID missing for ${collectionName}`);
        }

        const cleanedData = cleanData(data);
        const docRef = doc(db, USERS_COLLECTION, userId, collectionName, docId);
        await setDoc(docRef, { ...cleanedData, updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) {
        console.error(`Firestore Upsert Error [${collectionName}]:`, error);
        throw error;
    }
};

export const deleteDocument = async (userId: string, collectionName: string, docId: string) => {
    const docRef = doc(db, USERS_COLLECTION, userId, collectionName, docId);
    await deleteDoc(docRef);
};

// ==================== NEW CREDITS SYSTEM ====================

export interface CreditTransaction {
    id: string;
    amount: number; // Positive for income, negative for expense
    type: 'QUEST_REWARD' | 'QUEST_PENALTY' | 'EXPENSE' | 'ADJUSTMENT' | 'BILL_PAYMENT';
    description: string;
    relatedId?: string; // Quest ID, Expense ID, etc.
    timestamp: string;
    balanceAfter: number;
}

/**
 * ATOMIC CREDIT TRANSACTION
 * This is the ONLY way to modify credits. All credit changes must go through this.
 */
export const executeCreditsTransaction = async (
    userId: string,
    amount: number,
    type: CreditTransaction['type'],
    description: string,
    relatedId?: string
): Promise<number> => {
    try {
        const walletRef = doc(db, USERS_COLLECTION, userId, "economy", "wallet");

        // Use Firestore transaction for atomic read-modify-write
        const newBalance = await runTransaction(db, async (transaction) => {
            const walletDoc = await transaction.get(walletRef);

            let currentCredits = 0;
            if (walletDoc.exists()) {
                currentCredits = walletDoc.data().credits || 0;
            }

            const newCredits = Math.max(0, currentCredits + amount);

            // Update wallet
            transaction.set(walletRef, {
                credits: newCredits,
                updatedAt: serverTimestamp()
            }, { merge: true });

            // Log transaction
            const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const transactionRef = doc(db, USERS_COLLECTION, userId, "transactions", transactionId);

            const transactionData: Omit<CreditTransaction, 'id'> = {
                amount,
                type,
                description,
                relatedId,
                timestamp: new Date().toISOString(),
                balanceAfter: newCredits
            };

            transaction.set(transactionRef, transactionData);

            console.log(`💰 Credit Transaction [${type}]:`, {
                amount,
                description,
                oldBalance: currentCredits,
                newBalance: newCredits
            });

            return newCredits;
        });

        return newBalance;
    } catch (error) {
        console.error('❌ Credit Transaction Failed:', error);
        throw error;
    }
};

/**
 * Get current credit balance (for initial load)
 */
export const getCredits = async (userId: string): Promise<number> => {
    const walletRef = doc(db, USERS_COLLECTION, userId, "economy", "wallet");
    const walletDoc = await getDoc(walletRef);
    return walletDoc.exists() ? (walletDoc.data().credits || 0) : 0;
};

// ==================== END NEW CREDITS SYSTEM ====================

export const migrateLocalStorageToFirestore = async (userId: string, gameState: GameState) => {
    const batch = writeBatch(db);

    // Profile (WITHOUT credits)
    const profileRef = doc(db, USERS_COLLECTION, userId, "profile", "data");
    const { stats, credits, ...profileData } = gameState.player;
    batch.set(profileRef, cleanData({ ...profileData, lastLogin: serverTimestamp() }));

    // Stats
    const statsRef = doc(db, USERS_COLLECTION, userId, "stats", "current");
    batch.set(statsRef, cleanData({ ...stats, updatedAt: serverTimestamp() }));

    // Wallet (credits only)
    const walletRef = doc(db, USERS_COLLECTION, userId, "economy", "wallet");
    batch.set(walletRef, { credits: credits || 0, updatedAt: serverTimestamp() });

    // Settings
    const settingsRef = doc(db, USERS_COLLECTION, userId, "system", "settings");
    batch.set(settingsRef, cleanData({ ...gameState.settings, updatedAt: serverTimestamp() }));

    // Quests
    gameState.quests.forEach(quest => {
        const questRef = doc(db, USERS_COLLECTION, userId, "quests", quest.id);
        batch.set(questRef, cleanData({ ...quest, updatedAt: serverTimestamp() }));
    });

    // Goals
    gameState.goals.forEach(goal => {
        const goalRef = doc(db, USERS_COLLECTION, userId, "goals", goal.id);
        batch.set(goalRef, cleanData({ ...goal, updatedAt: serverTimestamp() }));
    });

    // Economy/Expenses
    gameState.expenses.forEach(expense => {
        const expRef = doc(db, USERS_COLLECTION, userId, "economy", expense.id);
        batch.set(expRef, cleanData({ ...expense, updatedAt: serverTimestamp() }));
    });

    // Ledger (Expense History) - but exclude automatic logs type entries
    gameState.expenseHistory
        .filter(h => h.type === 'ONE_TIME' || h.type === 'RECURRING') // Only real expenses
        .forEach(history => {
            const historyRef = doc(db, USERS_COLLECTION, userId, "ledger", history.id);
            batch.set(historyRef, cleanData({ ...history, createdAt: serverTimestamp() }));
        });

    // Manual Adjustments
    gameState.manualAdjustments.forEach(adj => {
        const adjRef = doc(db, USERS_COLLECTION, userId, "adjustments", adj.id);
        batch.set(adjRef, cleanData({ ...adj, createdAt: serverTimestamp() }));
    });

    await batch.commit();
};
