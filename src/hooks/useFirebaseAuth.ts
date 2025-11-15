import { readonly, ref } from "vue"
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app"
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth"
import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type FirestoreError,
  type Unsubscribe,
} from "firebase/firestore"

// Firebase 配置：建议在生产环境通过环境变量注入
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  throw new Error("Firebase 配置缺失，请检查环境变量")
}

let firebaseApp: FirebaseApp | null = null
/**
 * 确保 Firebase 只初始化一次
 */
function ensureFirebaseApp() {
  if (firebaseApp) {
    return firebaseApp
  }
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
  return firebaseApp
}

const app = ensureFirebaseApp()
const auth = getAuth(app)
const db = getFirestore(app)

const loginCallbacks = new Set<(user: User) => void>()
const logoutCallbacks = new Set<(user: User | null) => void>()
const authStateCallbacks = new Set<(user: User | null) => void>()

/**
 * 用户文档引用：blog/{uid}
 */
function getUserDocRef(uid: string) {
  return doc(db, "blog", uid)
}

/**
 * 页面文档引用：blog/{uid}/pages/{pageKey}
 */
function getPageDocRef(uid: string, pageKey: string) {
  return doc(db, "blog", uid, "pages", pageKey)
}

/**
 * 页面记录文档引用：blog/{uid}/pages/{pageKey}/records/{recordId}
 */
function getRecordDocRef(uid: string, pageKey: string, recordId: string) {
  return doc(db, "blog", uid, "pages", pageKey, "records", recordId)
}

const currentUser = ref<User | null>(auth.currentUser)
const authReady = ref(false) // 标记 Firebase Auth 初始化是否完成

let authStopHandle: Unsubscribe | null = null

/**
 * 登录后把用户资料写入 Firestore，方便存储用户元信息
 */
async function upsertUserProfile(user: User) {
  const profileRef = getUserDocRef(user.uid)
  await setDoc(
    profileRef,
    {
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      providerIds: user.providerData.map(p => p?.providerId).filter(Boolean),
      lastLoginAt: serverTimestamp(),
    },
    { merge: true }
  )
}

function emitLogin(user: User) {
  loginCallbacks.forEach(cb => {
    try {
      cb(user)
    } catch (error) {
      console.error("login callback error", error)
    }
  })
}

function emitLogout(user: User | null) {
  logoutCallbacks.forEach(cb => {
    try {
      cb(user)
    } catch (error) {
      console.error("logout callback error", error)
    }
  })
}

function emitAuthState(user: User | null) {
  authStateCallbacks.forEach(cb => {
    try {
      cb(user)
    } catch (error) {
      console.error("auth state callback error", error)
    }
  })
}

/**
 * 注册一次 auth 状态监听，把 Firebase 用户同步到响应式变量
 */
function ensureAuthListener() {
  if (authStopHandle) {
    return
  }
  let lastAuthUser: User | null = auth.currentUser
  authStopHandle = onAuthStateChanged(auth, async user => {
    const previousUser = lastAuthUser
    lastAuthUser = user
    currentUser.value = user
    authReady.value = true
    emitAuthState(user)
    if (user) {
      await upsertUserProfile(user)
      emitLogin(user)
    } else if (previousUser) {
      emitLogout(previousUser)
    }
  })
}

/**
 * 触发 Google 登录，登录成功后自动更新用户资料
 */
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  const credential = await signInWithPopup(auth, provider)
  if (credential.user) {
    await upsertUserProfile(credential.user)
    emitLogin(credential.user)
  }
  return credential
}

/**
 * 登出当前用户
 */
function signOutUser() {
  return signOut(auth)
}

/**
 * 为当前用户的指定页面保存数据
 */
async function savePageData(pageKey: string, payload: unknown) {
  const user = auth.currentUser
  if (!user) {
    throw new Error("用户未登录")
  }
  const pageRef = getPageDocRef(user.uid, pageKey)
  await setDoc(
    pageRef,
    {
      ...(payload as DocumentData),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

/**
 * 读取当前用户指定页面的数据
 */
async function loadPageData(pageKey: string) {
  const user = auth.currentUser
  if (!user) {
    throw new Error("用户未登录")
  }
  const pageRef = getPageDocRef(user.uid, pageKey)
  const snap = await getDoc(pageRef)
  if (!snap.exists()) {
    return null
  }
  return snap.data() ?? null
}

/**
 * 订阅当前用户指定页面的实时数据变更
 */
function subscribePageData(
  pageKey: string,
  handler: (data: unknown) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  const user = auth.currentUser
  if (!user) {
    throw new Error("用户未登录")
  }
  const pageRef = getPageDocRef(user.uid, pageKey)
  return onSnapshot(
    pageRef,
    snap => {
      if (!snap.exists()) {
        handler(null)
        return
      }
      handler(snap.data() ?? null)
    },
    onError
  )
}

/**
 * 保存当前用户指定页面下记录的数据
 */
async function saveDocumentData(
  pageKey: string,
  recordId: string,
  payload: Record<string, unknown>
) {
  const user = auth.currentUser
  if (!user) {
    throw new Error("用户未登录")
  }
  const recordRef = getRecordDocRef(user.uid, pageKey, recordId)
  await setDoc(recordRef, payload as DocumentData, { merge: true })
}

/**
 * 读取当前用户指定页面下记录的数据
 */
async function loadDocumentData<T = DocumentData | null>(
  pageKey: string,
  recordId: string
) {
  const user = auth.currentUser
  if (!user) {
    throw new Error("用户未登录")
  }
  const recordRef = getRecordDocRef(user.uid, pageKey, recordId)
  const snap = await getDoc(recordRef)
  if (!snap.exists()) {
    return null
  }
  const data = snap.data()
  return data ?? null
}

/**
 * 订阅当前用户指定页面下记录的实时数据
 */
function subscribeDocumentData<T = DocumentData | null>(
  pageKey: string,
  recordId: string,
  handler: (data: unknown) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  const user = auth.currentUser
  if (!user) {
    throw new Error("用户未登录")
  }
  const recordRef = getRecordDocRef(user.uid, pageKey, recordId)
  return onSnapshot(
    recordRef,
    snap => {
      if (!snap.exists()) {
        handler(null as T)
        return
      }
      handler((snap.data() ?? null) as T)
    },
    onError
  )
}

/**
 * 注册登录成功回调，返回取消订阅函数
 */
function onLogin(callback: (user: User) => void) {
  loginCallbacks.add(callback)
  if (authReady.value && currentUser.value) {
    Promise.resolve().then(() => callback(currentUser.value!))
  }
  return () => loginCallbacks.delete(callback)
}

function onAuthReady(callback: (user: User | null) => void) {
  authStateCallbacks.add(callback)
  if (authReady.value) {
    Promise.resolve().then(() => callback(currentUser.value))
  }
  return () => authStateCallbacks.delete(callback)
}

function onLogout(callback: (user: User | null) => void) {
  logoutCallbacks.add(callback)
  return () => logoutCallbacks.delete(callback)
}

/**
 * 对外暴露的组合式函数：返回只读用户状态与若干操作方法
 */
export function useFirebaseAuth() {
  ensureAuthListener()

  return {
    user: readonly(currentUser),
    authReady: readonly(authReady),
    signInWithGoogle,
    signOutUser,
    savePageData,
    loadPageData,
    subscribePageData,
    saveDocumentData,
    loadDocumentData,
    subscribeDocumentData,
    onLogin,
    onAuthReady,
    onLogout,
  }
}
