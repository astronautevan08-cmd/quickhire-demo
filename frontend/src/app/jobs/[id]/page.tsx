"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useJob, useCreateApplication } from "@/hooks/useJobsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  resume_link: z.string().url("Resume link must be a valid URL"),
  cover_note: z.string().min(1, "Cover note is required"),
});

type FormValues = z.infer<typeof schema>;

export default function JobDetailsPage() {
  const params = useParams();
  const rawId = (params as any)?.id;
  const id: string | undefined = Array.isArray(rawId) ? rawId[0] : rawId;

  const { data: job, isLoading, error } = useJob(id || "");
  const apply = useCreateApplication();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", resume_link: "", cover_note: "" },
  });

  async function onSubmit(values: FormValues) {
    if (!id) {
      toast({
        title: "Missing Job ID",
        description: "Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      job_id: id,
      name: values.name,
      email: values.email,
      resume_link: values.resume_link,
      cover_note: values.cover_note,
    };

    try {
      await apply.mutateAsync(payload);

      toast({
        title: "Application submitted",
        description: "We received your application.",
      });

      form.reset();
    } catch (e: any) {
      toast({
        title: "Failed",
        description: e.message || "Could not submit application",
        variant: "destructive",
      });
    }
  }

  if (!id) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-10">Job not found.</div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-10">Loading...</div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-10">Job not found.</div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to jobs
      </Link>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Details */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {job.company} • {job.location} • {job.category}
          </p>

          <div className="mt-6 whitespace-pre-wrap text-foreground leading-relaxed">
            {job.description}
          </div>
        </div>

        {/* Apply */}
        <div className="border border-border rounded-xl p-5 bg-background">
          <h2 className="text-lg font-semibold">Apply Now</h2>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-3"
          >
            <div>
              <Input placeholder="Full name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Input placeholder="Email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                placeholder="Resume link (URL)"
                {...form.register("resume_link")}
              />
              {form.formState.errors.resume_link && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.resume_link.message}
                </p>
              )}
            </div>

            <div>
              <Textarea
                placeholder="Cover note"
                rows={5}
                {...form.register("cover_note")}
              />
              {form.formState.errors.cover_note && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.cover_note.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={apply.isPending}>
              {apply.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
