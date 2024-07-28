import { FC } from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  EyeIcon,
  ListChecksIcon,
  VideoIcon,
} from "lucide-react";
import { IconBadge } from "@/components/custom/icon-badge";
import { ChapterTitleForm } from "./_components/title-form";
import { ChapterDescriptionForm } from "./_components/description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { Banner } from "@/components/custom/banner";
import ChapterActions from "./_components/chapter-actions";

interface ChapterDetailpageProps {
  params: { courseId: string; chapterId: string };
}

const ChapterDetailpage: FC<ChapterDetailpageProps> = async ({
  params: { chapterId, courseId },
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
      courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant={"warning"}
          label="This chapter is unpublished. It will not be visible in the course."
        />
      )}
      <div className="p-6">
        <div>
          <Link
            href={`/teacher/courses/${courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to course setup
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2 text-slate-700">
            <h1 className="text-2xl font-medium">Chapter Setup</h1>
            <span className="text-sm ">
              Complete all fields {completionText}
            </span>
          </div>
          <ChapterActions
            chapterId={chapterId}
            courseId={courseId}
            isPublished={chapter.isPublished}
            disabled={!isComplete}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={BookOpenIcon} />
              <h1 className="text-xl">Customize chapter</h1>
            </div>
            <ChapterTitleForm
              initialData={{ title: chapter.title }}
              courseId={courseId}
              chapterId={chapterId}
            />
            <ChapterDescriptionForm initialData={chapter} courseId={courseId} />

            <div className="flex items-center gap-x-2">
              <IconBadge icon={EyeIcon} />
              <h1 className="text-xl">Access settings</h1>
            </div>
            <ChapterAccessForm initialData={chapter} courseId={courseId} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={VideoIcon} />
              <h1 className="text-xl">Add a video</h1>
            </div>
            <ChapterVideoForm initialData={chapter} courseId={courseId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterDetailpage;
