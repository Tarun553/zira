import {z} from "zod"


export const projectSchema=z.object({
    name:z.string().min(1,"project name is required"),
    key:z.string().min(1,"project key is required").max(10,"project key must be 10 character or less"),
    description:z.string().min(1,"project description is required").optional()
})

export type ProjectInput = z.infer<typeof projectSchema>
