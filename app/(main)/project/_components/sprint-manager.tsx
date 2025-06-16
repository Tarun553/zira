"use client"
import { isAfter, isBefore, format } from 'date-fns';
import React, { useTransition } from 'react'
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';
import { updateSprintStatus } from '@/actions/sprints';
import { toast } from 'sonner';

const SprintManager = ({sprint, setSprint, sprints}: {sprint: {id: string, name: string, startDate: Date, endDate: Date, status: string}, setSprint: (sprint: {id: string, name: string, startDate: Date, endDate: Date, status: string}) => void, sprints: {id: string, name: string, startDate: Date, endDate: Date, status: string}[]}) => {
    const [status, setStatus] = React.useState(sprint.status);
    const [isPending, startTransition] = useTransition();

    const StartDate = new Date(sprint.startDate);
    const EndDate = new Date(sprint.endDate);
    const now = new Date();

    const canStart = isBefore(now, EndDate) && isAfter(now, StartDate) && status === "PLANNED";
    const canEnd = isAfter(now, EndDate) && status === "ACTIVE";

    const handelSprintChange = (value: string) => {
      const selectedSprint = sprints.find((sprint: {id: string, name: string, startDate: Date, endDate: Date, status: string}) => sprint.id === value);
      if (selectedSprint) {
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
      }
    }

    const getStatusText = () => {
      if (status === "COMPLETED") return `Sprint Ended`;
      if (status === "ACTIVE" && isBefore(now, EndDate)) return `Sprint Active`;
      if (status === "PLANNED" && isBefore(now, StartDate)) return `Sprint Planned`;
      return `Sprint Not Started`;
    }
    const handelSprintStatusChange = (value: string) => {
      startTransition(() => {
        updateSprintStatus(sprint.id, value)
        .then((res) => {
          if(res.success) {
            toast.success(res.success);
            setStatus(value);
          }
          if(res.error) {
            toast.error("error");
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
        })
      })
    }
    
  return (
    <>
    <div className="flex gap-2">
    <Select value={sprint.id} onValueChange={(value: string) => handelSprintChange(value)}>
  <SelectTrigger className="w-[280px] bg-slate-950 self-start text-white">
    <SelectValue placeholder="Select Sprint" />
  </SelectTrigger>
  <SelectContent className="">
    {sprints.map((sprint: {id: string, name: string, startDate: Date, endDate: Date, status: string}) => {
        return (
            <SelectItem key={sprint.id} value={sprint.id}>{sprint.name} ({format(sprint.startDate, "dd/MM/yyyy")} to{" "} {format(sprint.endDate, "dd/MM/yyyy")})</SelectItem>
        )
    })}
   
  </SelectContent>
</Select>

{canStart && <Button variant="default" disabled={isPending} onClick={() => handelSprintStatusChange("ACTIVE")}>Start Sprint</Button>}
{canEnd && <Button variant="destructive" disabled={isPending} onClick={() => handelSprintStatusChange("COMPLETED")}>End Sprint</Button>}
    </div>
    {getStatusText() && (
      <Badge className='mt-2 ml-2 self-start'> {getStatusText()}</Badge>
    )}
    </>
  )
}

export default SprintManager