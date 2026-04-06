import type { ExerciseIssue } from "./types"
import { issue01 } from "./issue-01"
import { issue02 } from "./issue-02"
import { issue03 } from "./issue-03"
import { issue35 } from "./issue-3-5"
import { issue04 } from "./issue-04"
import { issue05 } from "./issue-05"
import { issue06 } from "./issue-06"
import { issue08 } from "./issue-08"
import { issue09 } from "./issue-09"
import { issue10 } from "./issue-10"
import { issue105 } from "./issue-10-5"
import { issue1112 } from "./issue-11-12"
import { issue13 } from "./issue-13"
import { issue14 } from "./issue-14"
import { issue15 } from "./issue-15"
import { issue17 } from "./issue-17"
import { issue18 } from "./issue-18"
import { issue19 } from "./issue-19"
import { issue20 } from "./issue-20"
import { issue2122 } from "./issue-21-22"
import { issue2324 } from "./issue-23-24"
import { issue2526 } from "./issue-25-26"
import { issue27 } from "./issue-27"
import { issue28 } from "./issue-28"
import { issue2931 } from "./issue-29-31"
import { issue3234 } from "./issue-32-34"
import { issue3536 } from "./issue-35-36"
import { issue3738 } from "./issue-37-38"
import { issue39 } from "./issue-39"
import { issue40 } from "./issue-40"
import { issue4142 } from "./issue-41-42"
import { issue4345 } from "./issue-43-45"
import { issue4647 } from "./issue-46-47"
import { issue4850 } from "./issue-48-50"

export type { ExerciseIssue, ExerciseItem } from "./types"

export const exerciseIssues: ExerciseIssue[] = [
  issue01,
  issue02,
  issue03,
  issue35,
  issue04,
  issue05,
  issue06,
  issue08,
  issue09,
  issue10,
  issue105,
  issue1112,
  issue13,
  issue14,
  issue15,
  issue17,
  issue18,
  issue19,
  issue20,
  issue2122,
  issue2324,
  issue2526,
  issue27,
  issue28,
  issue2931,
  issue3234,
  issue3536,
  issue3738,
  issue39,
  issue40,
  issue4142,
  issue4345,
  issue4647,
  issue4850,
]

export const exerciseIssueById: Record<string, ExerciseIssue> =
  Object.fromEntries(exerciseIssues.map(i => [i.id, i]))
