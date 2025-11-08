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
        @click="handleLogin"
      >
        <img
          :src="googleIcon"
          alt="Google"
          class="mr-2"
        />
        Google 登录
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
import { computed, ref } from "vue"
import { ElAvatar, ElButton, ElCard, ElSpace } from "element-plus"
import { UserFilled } from "@element-plus/icons-vue"
import { useFirebaseAuth } from "../hooks/useFirebaseAuth"
import googleIcon from "../assets/svg/google.svg?url"
const { user, authReady, signInWithGoogle, signOutUser } = useFirebaseAuth()
const loginLoading = ref(false)

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

async function handleLogin() {
  if (loginLoading.value) return
  loginLoading.value = true
  try {
    await signInWithGoogle()
  } finally {
    loginLoading.value = false
  }
}

async function handleLogout() {
  if (!user.value) return
  await signOutUser()
}
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
