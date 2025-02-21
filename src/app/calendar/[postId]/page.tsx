import NavigationBar from "@/components/navigation-bar";
import Image from "next/image";
import {notFound} from "next/navigation";
import {getPost} from "@/app/calendar/actions";
import {formatDate} from "@/lib/utils";
import Link from "next/link";
import {PencilIcon} from "@heroicons/react/24/solid";
import ButtonDeletePost from "@/components/button-delete-post";

export default async function PostPage({params}: {params: Promise<{postId: string;}>}) {
  const postId = (await params).postId;

  if (!postId) {
    return notFound();
  }

  const post = await getPost(postId);

  if (!post) {
    return notFound();
  }

  return (
    <div>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <NavigationBar goBackUrl="/" rightButtons={
          <>
            <Link href={`/calendar/add?id=${postId}&year=${post.date?.getFullYear()}&month=${post.date?.getMonth()}&date=${post.date?.getDate()}`}>
              <PencilIcon className="size-4"/>
            </Link>
            <ButtonDeletePost postId={postId} />
          </>
        } />
        <div className="p-5 flex-auto w-full">
          <div className="flex flex-col gap-5">
            <p className="text-center font-semibold text-sm">{formatDate(post.date)}</p>
            <Image src={`${post.photo}/public`} alt={`${post.date}의 사진`} width="700" height={500} className="object-cover" />
            {
              post.memo ?
              <div className="border-foreground border-t border-b py-5 text-sm">
                <p>{post.memo}</p>
              </div> :
              null
            }
          </div>
        </div>
      </div>
    </div>
  );
}