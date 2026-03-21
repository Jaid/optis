import type {Merge, Simplify} from 'type-fest'

export type MergeThree<LowPriorityType, MediumPriorityType, HighPriorityType> = Simplify<Merge<LowPriorityType, Merge<MediumPriorityType, HighPriorityType>>>
