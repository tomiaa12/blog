import { http } from "@/utils"

export const getGuessit = (type: string) => http.post(`/getGuessit`, { type })

export const cloudmusicComment = () => http.get(`/cloudmusicComment`)

export const sentence = () => http.get(`/sentence`)

export const morningPaper = () => http.get(`/morningPaper`)

export const rainbow = () => http.get(`/rainbow`)

export const poison = () => http.get(`/poison`)

export const tiangou = () => http.get(`/tiangou`)

export const hitokoto = () => http.get(`/hitokoto`)

export const draw = (query: string) => http.post(`/draw`, { query })

export const translate = (query: string) => http.post(`/translate`, { query })

export const rsdjs = (query: string) => http.post(`/rsdjs`, { query })
