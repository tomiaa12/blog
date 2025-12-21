<template>
  <el-card
    class="firebase-login"
    shadow="never"
  >
    <div class="firebase-login__actions">
      <el-button
        type="primary"
        v-if="showLoginButton"
        :loading="loginLoading"
        :disabled="countdown > 0"
        @click="handleLogin"
      >
        <img
          :src="googleIcon"
          alt="Google"
          class="mr-2"
        />
        <span v-if="countdown > 0">{{ countdown }}秒后可重试</span>
        <span v-else>Google 登录</span>
      </el-button>
    </div>

    <el-space
      v-if="user"
      class="firebase-login__info"
      size="large"
    >
      <el-avatar
        :size="48"
        :src="user.photoURL || undefined"
        :alt="displayName"
      >
        {{ avatarFallback }}
      </el-avatar>
      <div class="firebase-login__text">
        <div class="firebase-login__name">
          <span class="mr-2">{{ displayName }}</span>
          <el-button
            type="primary"
            plain
            @click="handleLogout"
          >
            <img
              :src="googleIcon"
              alt="Google"
              class="mr-2"
            />
            退出登录
          </el-button>
        </div>
        <div
          v-if="user.email"
          class="firebase-login__meta"
        >
          {{ user.email }}
        </div>
      </div>
    </el-space>

    <div
      v-else
      class="firebase-login__status"
    >
      {{ statusText }}
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from "vue"
import { ElAvatar, ElButton, ElCard, ElSpace, ElMessage } from "element-plus"
import { UserFilled } from "@element-plus/icons-vue"
import { useFirebaseAuth } from "../hooks/useFirebaseAuth"
import { isVSCode } from "../utils"
import googleIcon from "../assets/svg/google.svg?url"

const { user, authReady, signInWithGoogle, signInWithGoogleInVSCode, signOutUser } = useFirebaseAuth()
const loginLoading = ref(false)
const countdown = ref(0)
let countdownTimer: number | null = null

const showLoginButton = computed(() => authReady.value && !user.value)

const displayName = computed(() => {
  const u = user.value
  if (!u) return ""
  return u.displayName || u.email || u.uid
})

const avatarFallback = computed(() => {
  const name = displayName.value.trim()
  return name ? name.slice(0, 2).toUpperCase() ?? "?" : "?"
})

const statusText = computed(() => {
  if (!authReady.value) {
    return "正在检测登录状态..."
  }
  return user.value ? "" : "未登录，登录以使用云端存储"
})

/**
 * 启动倒计时
 */
function startCountdown() {
  // 清除之前的定时器
  if (countdownTimer !== null) {
    clearInterval(countdownTimer)
  }
  
  // 设置120秒倒计时
  countdown.value = 120
  
  // 每秒减1
  countdownTimer = window.setInterval(() => {
    countdown.value--
    
    if (countdown.value <= 0) {
      if (countdownTimer !== null) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }
  }, 1000)
}

/**
 * 清除倒计时
 */
function clearCountdown() {
  if (countdownTimer !== null) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  countdown.value = 0
}

async function handleLogin() {
  if (loginLoading.value || countdown.value > 0) return
  
  loginLoading.value = true
  
  // 启动倒计时
  startCountdown()
  
  try {
    if (isVSCode.value) {
      // VSCode 环境下使用 OAuth 流程
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET
      
      if (!clientId || !clientSecret) {
        ElMessage.error('Google OAuth 配置缺失，请检查环境变量')
        clearCountdown() // 配置错误，清除倒计时
        return
      }
      
      await signInWithGoogleInVSCode({
        clientId,
        clientSecret,
        redirectPort: Number(import.meta.env.VITE_GOOGLE_OAUTH_PORT) || 5589
      })
      
      ElMessage.success('登录成功！')
      clearCountdown() // 登录成功，清除倒计时
    } else {
      // 浏览器环境下使用弹窗登录
      await signInWithGoogle()
      clearCountdown() // 登录成功，清除倒计时
    }
  } catch (error: any) {
    console.error('登录失败:', error)
    ElMessage.error(error?.message || '登录失败，请重试')
    // 登录失败，倒计时继续
  } finally {
    loginLoading.value = false
  }
}

async function handleLogout() {
  if (!user.value) return
  await signOutUser()
  ElMessage.success('已退出登录')
}

// 组件卸载时清除定时器
onUnmounted(() => {
  clearCountdown()
})
</script>

<style scoped>
.firebase-login {
  border: 1px solid var(--el-border-color-light, #ebeef5);
  width: 400px;
}

.firebase-login__actions {
  display: flex;
  justify-content: flex-start;
}

.firebase-login__info {
  margin-top: 4px;
}

.firebase-login__text {
  color: var(--el-text-color-regular);
}

.firebase-login__name {
  font-weight: 600;
  font-size: 16px;
  
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}
.firebase-login__status {
  padding-top: 10px;
  color: var(--el-text-color-regular);
}

.mr-2 {
  margin-right: 8px;
}
</style>
