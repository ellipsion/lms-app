import { FC } from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/custom/banner";
import VideoPlayer from "./_components/video-player";
import CourseEnrollButton from "../../_components/course-enroll-btn";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/custom/preview";
import { FileIcon, PaperclipIcon } from "lucide-react";

interface ChapterDetailPageProps {
  params: { courseId: string; chapterId: string };
}

const ChapterDetailPage: FC<ChapterDetailPageProps> = async ({ params }) => {
  const { userId } = auth();
  const { chapterId, courseId } = params;

  if (!userId) {
    return redirect("/");
  }

  const { chapter, attachments, muxData, nextChapter, purchase, userProgress } =
    await getChapter({ userId, chapterId, courseId });

  if (!chapter) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const isCompleted = !!purchase && userProgress?.isCompleted;

  return (
    <div className="w-full">
      {isCompleted && (
        <Banner
          variant={"success"}
          label="You have already competed this chapter."
        />
      )}
      {isLocked && (
        <Banner
          variant={"warning"}
          label="Purchase the course to view this chapter."
        />
      )}
      <div className="flex flex-col w-full max-w-5xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            isCompleted={isCompleted}
          />
        </div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
          {purchase ? (
            <>{/* TODO: Progess */}</>
          ) : (
            <CourseEnrollButton
              courseId={courseId}
              price={chapter.course.price!}
            />
          )}
        </div>
        <Separator />
        <div>
          <Preview value={chapter.description!} />
        </div>
        {!!attachments.length && (
          <>
            <Separator />
            <div className="p-4">
              {attachments.map((attachment) => (
                <a
                  href={attachment.url}
                  target="_blank"
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                >
                  <FileIcon />
                  <p className="liine-clamp-1">{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterDetailPage;
