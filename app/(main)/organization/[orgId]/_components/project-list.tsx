"use server"

import { getProject } from "@/actions/project";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import DeleteProject from "./delete-project";


export async function ProjectList({ orgId }: { orgId: string }) {
    const projects = await getProject(orgId);
    if (!projects || projects.length === 0) {
        return (
            <div className="text-center">
                <p className="mb-4">No projects found.</p>
                <Link href={`/project/create?orgId=${orgId}`}>
                    <Button>Create a new project</Button>
                </Link>
            </div>
        )

    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
                <CardHeader>
                    <CardTitle className='flex justify-between items-center'>{project.name}
                        <DeleteProject projectId={project.id}/>
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>More details about the project can be shown here.</p>
                </CardContent>
                <CardFooter>
                    <Link href={`/project/${project.id}`}>
                        <Button variant="outline">View Project</Button>
                    </Link>
                </CardFooter>
            </Card>
          ))}
        </div>
    );
}