"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";

import { sprintSchema } from "@/lib/validators";
import type { z } from "zod";
import { createSprint } from "@/actions/sprints";
import { toast } from "sonner";

type SprintFormData = z.infer<typeof sprintSchema>;

interface SprintCreationFormProps {
  projectTitle: string;
  projectKey: string;
  projectId: string;
  sprintKey: string;
}

function SprintCreationForm({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
}: SprintCreationFormProps) {
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SprintFormData>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: new Date(),
      endDate: addDays(new Date(), 14),
      description: "",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const onSubmit = (data: SprintFormData) => {
    startTransition(async () => {
      try {
        await createSprint({
          projectId: projectId,
          name: data.name,
          description: data.description || "",
          startDate: data.startDate,
          endDate: data.endDate,
        });
        setShowForm(false);
        router.refresh(); // Refresh the page to show updated data
      } catch (error) {
        console.error("Failed to create sprint:", error);
        // TODO: Add user-facing error message (e.g., toast)
        toast.error("Failed to create sprint");
      }
    });
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-5xl font-bold mb-8 gradient-title">
          {projectTitle}
        </h1>
        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={!showForm ? "default" : "destructive"}
        >
          {!showForm ? "Create New Sprint" : "Cancel"}
        </Button>
      </div>
      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Sprint Name
                  </label>
                  <Input
                    id="name"
                    {...register("name")}
                    readOnly
                    className="bg-slate-950"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Sprint Duration
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal bg-slate-950 ${
                          !startDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate && endDate ? (
                          format(startDate, "LLL dd, y") +
                          " - " +
                          format(endDate, "LLL dd, y")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto bg-slate-900"
                      align="start"
                    >
                      <DayPicker
                        classNames={{
                          chevron: "fill-blue-500",
                          range_start: "bg-blue-700",
                          range_end: "bg-blue-700",
                          range_middle: "bg-blue-400",
                          day_button: "border-none",
                          today: "border-2 border-blue-700",
                        }}
                        mode="range"
                        disabled={[{ before: new Date() }]}
                        selected={{ from: startDate, to: endDate }}
                        onSelect={(range: DateRange | undefined) => {
                          if (range?.from) setValue("startDate", range.from);
                          if (range?.to) setValue("endDate", range.to);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {(errors.startDate || errors.endDate) && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate?.message || errors.endDate?.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                >
                  Sprint Goal
                </label>
                <Input
                  id="description"
                  {...register("description")}
                  placeholder="Define the goal for this sprint"
                  className="bg-slate-950"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Sprint"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default SprintCreationForm;