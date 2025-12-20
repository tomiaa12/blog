import { readonly, ref } from "vue"
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app"
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithCredential,
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
 * VSCode 环境下的 Google OAuth 配置
 */
interface VSCodeOAuthConfig {
  clientId: string
  clientSecret: string
  redirectPort?: number
}

/**
 * 通过 VSCode 扩展处理 OAuth 登录
 * 发送消息给扩展，让扩展启动服务器并处理 OAuth 流程
 */
async function requestVSCodeOAuth(
  config: VSCodeOAuthConfig
): Promise<{ access_token: string; id_token?: string }> {
  return new Promise((resolve, reject) => {
    // 定义消息处理器
    const messageHandler = (event: MessageEvent) => {
      const message = event.data
      
      if (message.type === "vscode-oauth-success") {
        window.removeEventListener("message", messageHandler)
        resolve(message.data)
      } else if (message.type === "vscode-oauth-error") {
        window.removeEventListener("message", messageHandler)
        reject(new Error(message.error))
      }
    }

    // 监听来自扩展的响应
    window.addEventListener("message", messageHandler)

    // 发送登录请求给 VSCode 扩展
    window.parent.postMessage(
      {
        type: "vscode-oauth-login",
        config: {
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          redirectPort: config.redirectPort || 5589,
        },
      },
      "*"
    )

    // 5分钟超时
    setTimeout(() => {
      window.removeEventListener("message", messageHandler)
      reject(new Error("OAuth request timeout"))
    }, 5 * 60 * 1000)
  })
}

/**
 * 在 VSCode 环境下使用 Google OAuth 登录
 * 需要提供 Google OAuth Client ID 和 Client Secret
 * 
 * 注意：服务器在 VSCode 扩展中运行（Node.js 环境），
 * 而不是在浏览器中运行
 */
async function signInWithGoogleInVSCode(config: VSCodeOAuthConfig) {
  try {
    // 通过消息通信请求 VSCode 扩展处理 OAuth
    // 扩展会启动服务器、打开浏览器、接收回调、交换 token
    const { access_token, id_token } = await requestVSCodeOAuth(config)

    // 用 token 登录 Firebase
    const credential = GoogleAuthProvider.credential(id_token ?? null, access_token)
    const result = await signInWithCredential(auth, credential)

    if (result.user) {
      await upsertUserProfile(result.user)
      emitLogin(result.user)
    }

    return result
  } catch (error: any) {
    // 处理 Firebase 认证错误
    const errorCode = error?.code || error?.error?.code
    const errorMessage = error?.message || error?.error?.message || String(error)
    
    // 如果是 invalid_client 或 invalid-credential 错误，提供详细的解决建议
    if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/invalid-credential' || 
        errorMessage?.includes('invalid_client') || errorMessage?.includes('Unauthorized')) {
      const detailedError = new Error(
        `OAuth 客户端配置错误 (${errorCode || 'invalid_client'})\n\n` +
        `可能的原因：\n` +
        `1. Google OAuth 客户端 ID 或密钥配置不正确\n` +
        `2. OAuth 客户端 ID 与 Firebase 项目不匹配\n` +
        `3. 需要在 Firebase Console 中配置授权域名\n\n` +
        `解决步骤：\n` +
        `1. 确认 Google Cloud Console 中的 OAuth 客户端 ID 与 Firebase 项目是同一个项目\n` +
        `2. 检查环境变量 VITE_GOOGLE_CLIENT_ID 和 VITE_GOOGLE_CLIENT_SECRET 是否正确\n` +
        `3. 在 Firebase Console → Authentication → 设置 → 授权域名中添加 localhost\n` +
        `4. 确认 Google Cloud Console 中已添加重定向 URI: http://localhost:${config.redirectPort || 5589}/callback\n\n` +
        `原始错误: ${errorMessage}`
      )
      detailedError.name = error?.name || 'FirebaseAuthError'
      throw detailedError
    }
    
    // 其他错误直接抛出
    throw error
  }
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
    signInWithGoogleInVSCode,
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
