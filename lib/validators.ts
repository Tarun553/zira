import {z} from "zod"


export const projectSchema=z.object({
    name:z.string().min(1,"project name is required"),
    key:z.string().min(1,"project key is required").max(10,"project key must be 10 character or less").optional(),
    description:z.string().min(1,"project description is required").optional()
})

export type ProjectInput = z.infer<typeof projectSchema>


// sprint schema
export const sprintSchema=z.object({
    name:z.string().min(1,"sprint name is required"),
    description:z.string().min(1,"sprint description is required").optional(),
    startDate:z.date(),
    endDate:z.date()
})

export type SprintInput = z.infer<typeof sprintSchema>