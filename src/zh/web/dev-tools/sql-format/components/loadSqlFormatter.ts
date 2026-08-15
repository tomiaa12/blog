import { loadFirstAvailable, loadScript } from "@/utils"

const CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/sql-formatter@15.6.10/dist/sql-formatter.min.js",
  "https://unpkg.com/sql-formatter@15.6.10/dist/sql-formatter.min.js",
]

export type SqlLanguage =
  | "sql"
  | "mysql"
  | "mariadb"
  | "postgresql"
  | "sqlite"
  | "transactsql"
  | "plsql"
  | "bigquery"
  | "snowflake"
  | "spark"
  | "hive"
  | "redshift"
  | "clickhouse"
  | "trino"
  | "tidb"

export type KeywordCase = "preserve" | "upper" | "lower"

export type FormatOptions = {
  language?: SqlLanguage
  tabWidth?: number
  useTabs?: boolean
  keywordCase?: KeywordCase
}

type SqlFormatterLib = {
  format: (sql: string, options?: FormatOptions) => string
}

let lib: SqlFormatterLib | null = null

export async function ensureSqlFormatter() {
  if (lib) return lib
  try {
    lib = await loadFirstAvailable(CDN_LIST, async url => {
      const win = await loadScript(url)
      const mod = (win as any).sqlFormatter as SqlFormatterLib | undefined
      if (!mod || typeof mod.format !== "function") throw new Error("sqlFormatter")
      return mod
    })
    return lib
  } catch (err) {
    lib = null
    throw err
  }
}
