import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
  type WatchStopHandle,
} from "vue"

export interface UseScrollLockOptions {
  /**
   * 可以是一个选择器或一个返回目标元素的函数。
   * 默认会尝试匹配 VitePress 的 `.VPContent`，再降级到 `.main`，最后使用 `document.body`。
   */
  target?:
    | string
    | (() => HTMLElement | null | undefined)
    | null
    | undefined
  /**
   * 是否在挂载时立即根据当前状态应用锁定。
   * @default true
   */
  immediate?: boolean
}

function resolveDefaultTarget(): HTMLElement | null {
  const selectors = [".VPContent", ".main", "#app"]
  for (const selector of selectors) {
    const el = document.querySelector<HTMLElement>(selector)
    if (el) {
      return el
    }
  }
  return (document.scrollingElement as HTMLElement | null) ?? document.body
}

function resolveTarget(
  target:
    | UseScrollLockOptions["target"]
    | undefined
    | null
): HTMLElement | null {
  if (typeof target === "function") {
    return target() ?? null
  }
  if (typeof target === "string") {
    return document.querySelector<HTMLElement>(target)
  }
  return null
}

export function useScrollLock(
  locked: Ref<boolean>,
  options?: UseScrollLockOptions
) {
  const immediate = options?.immediate ?? true
  const container = ref<HTMLElement | null>(null)
  const previousOverflow = new Map<HTMLElement, string>()
  let stopWatch: WatchStopHandle | null = null

  const collectTargets = () => {
    if (!container.value) {
      container.value =
        resolveTarget(options?.target) ?? resolveDefaultTarget() ?? null
    }
    const targets: HTMLElement[] = []
    const el = container.value
    if (el) {
      targets.push(el)
    }
    if (typeof window !== "undefined") {
      const docEl = document.documentElement as HTMLElement
      const bodyEl = document.body
      if (docEl && !targets.includes(docEl)) {
        targets.push(docEl)
      }
      if (bodyEl && !targets.includes(bodyEl)) {
        targets.push(bodyEl)
      }
    }
    return targets
  }

  const applyLock = (lock: boolean) => {
    if (typeof window === "undefined") {
      return
    }
    const targets = collectTargets()
    if (!targets.length) {
      return
    }
    targets.forEach(target => {
      if (lock) {
        if (!previousOverflow.has(target)) {
          previousOverflow.set(target, target.style.overflow || "")
        }
        target.style.overflow = "hidden"
      } else if (previousOverflow.has(target)) {
        target.style.overflow = previousOverflow.get(target) ?? ""
        previousOverflow.delete(target)
      }
    })
  }

  const cleanup = () => {
    applyLock(false)
    if (stopWatch) {
      stopWatch()
      stopWatch = null
    }
  }

  onMounted(() => {
    if (typeof window === "undefined") {
      return
    }
    container.value =
      resolveTarget(options?.target) ?? resolveDefaultTarget() ?? null
    if (immediate) {
      applyLock(locked.value)
    }
    stopWatch = watch(
      locked,
      value => {
        applyLock(value)
      },
      { immediate: false }
    )
  })

  onBeforeUnmount(() => {
    cleanup()
  })

  return {
    container,
    lock: () => applyLock(true),
    unlock: () => applyLock(false),
    cleanup,
  }
}

