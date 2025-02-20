import NavigationBar from "@/components/navigation-bar";
import Image from "next/image";
import {notFound} from "next/navigation";
import {getPost} from "@/app/calendar/[calendarId]/[postId]/actions";
import {formatDate} from "@/lib/utils";

export default async function PostPage({params}: {params: Promise<{calendarId: string; postId: string;}>}) {
  const calendarId = (await params).calendarId;
  const postId = (await params).postId;

  if (!calendarId || !postId) {
    return notFound();
  }

  const post = await getPost(postId);
  console.log(post);

  if (!post) {
    return notFound();
  }

  return (
    <div>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <NavigationBar goBackUrl="/" />
        <div className="p-5 flex-auto w-full">
          <div className="flex flex-col gap-5">
            <p className="text-center font-semibold text-sm">{formatDate(post.date)}</p>
            <Image src={`${post.photo}/public`} alt={`${post.date}의 사진`} width="700" height={500} className="object-cover" />
            <div className="border-foreground border-t border-b py-5 text-sm">
              {
                post.memo ?
                  <p>{post.memo}</p> :
                  <p className="">메모를 적어보세요 ☺️</p>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}