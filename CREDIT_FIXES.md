# Credit System Fixes - v1.5.2

## Issues Fixed

### 1. **Recurring Expenses Auto-Deducting Credits** ❌ → ✅
**Problem:**
- When adding a recurring expense, credits were immediately deducted
- This caused unexpected credit losses showing up in the economy tab

**Root Cause:**
- The `addExpense()` function always deducted credits regardless of expense type
- Line 491: `const newCredits = gameState.player.credits - newExpense.amount;`

**Fix:**
- Split logic based on expense type:
  - **ONE_TIME**: Deduct credits immediately + add to ledger
  - **RECURRING**: Only add to economy list (no deduction until manually paid)

**Code Changes:**
```typescript
// Before: Always deducted
const newCredits = gameState.player.credits - newExpense.amount;

// After: Conditional deduction
if (newExpense.type === 'ONE_TIME') {
    // Deduct immediately
} else if (newExpense.type === 'RECURRING') {
    // Just add to economy list, no deduction
}
```

---

### 2. **Quest Completion Credits Not Visible** ❌ → ✅
**Problem:**
- Credits were being saved to Firestore correctly
- But users had no visual feedback showing credits earned/lost

**Fix:**
- Added credit amounts to completion notifications
- Added detailed logs for credit transactions
- Shows: `QUEST COMPLETED: [name] | +50 Credits`

---

### 3. **Credit Synchronization Issues** 🔍
**Potential Issue:**
- Race conditions between Firestore sync and local state updates
- Added debug logging to track credit flow

**Debug Logs Added:**
- `🎯 Quest Completion Credit Debug:` - Shows old/new credit values
- `✅ Credits saved to Firestore:` - Confirms save operation

---

## How to Test

### Test 1: Quest Completion Credits
1. Create a new quest with a credit reward (e.g., 100 credits)
2. Complete the quest
3. **Expected Results:**
   - Notification shows: `QUEST COMPLETED: [name] | +100 Credits`
   - Check browser console for debug logs
   - Credits balance should increase by 100
   - Log entry in economy tab shows the transaction

### Test 2: Recurring Expenses
1. Add a recurring expense (e.g., "Rent" - 500 credits, MONTHLY)
2. **Expected Results:**
   - Notification: `RECURRING EXPENSE ADDED: Rent`
   - Credits balance should NOT change
   - Expense appears in economy panel as pending
3. Manually pay the expense
4. **Expected Results:**
   - Notification: `Bill Paid: Rent (-500 C)`
   - Credits deducted by 500
   - Ledger shows payment

### Test 3: One-Time Expenses
1. Add a one-time expense (e.g., "Coffee" - 5 credits, ONE_TIME)
2. **Expected Results:**
   - Notification: `EXPENSE LOGGED: -5 Credits`
   - Credits immediately deducted by 5
   - Appears in ledger

---

## Debug Checklist

If credits still aren't updating:

1. **Open browser console** (F12)
2. **Complete a quest** and look for:
   ```
   🎯 Quest Completion Credit Debug: {
     questTitle: "...",
     oldCredits: X,
     creditReward: Y,
     newCredits: X+Y,
     playerData: {...}
   }
   ✅ Credits saved to Firestore: [value]
   ```

3. **Check Firestore directly:**
   - Open Firebase Console
   - Navigate to: `users/{uid}/profile/data`
   - Verify `credits` field is updating

4. **Check for sync conflicts:**
   - Multiple tabs open? Close extras
   - Network issues? Check connection
   - Browser cache? Try hard refresh (Ctrl+Shift+R)

---

## Files Modified

1. `src/hooks/useGameEngine.ts`
   - `completeQuest()` - Lines 398-458
   - `failQuest()` - Lines 461-484  
   - `addExpense()` - Lines 489-519

---

## Next Steps

1. Test all scenarios above
2. If credits still not updating, share console logs
3. May need to check Firestore security rules
4. Consider adding optimistic UI updates for instant feedback
