export const base64ToURL = (base64Data: string, type: string) => {
  const binaryData = atob(base64Data)

  const uint8Array = new Uint8Array(binaryData.length)
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i)
  }

  const blob = new Blob([uint8Array], { type })
  return URL.createObjectURL(blob)
}
