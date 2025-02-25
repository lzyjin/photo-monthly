import NavigationBar from "@/components/navigation-bar";
import {db} from "@/lib/db";
import {getLoggedInUserId} from "@/lib/session";
import {notFound} from "next/navigation";
import {deleteAccount, logout} from "@/app/profile/actions";
import {formatDate} from "@/lib/utils";

async function getUser(id: number) {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  return user;
}

export default async function ProfilePage() {
  const loggedInUserId = await getLoggedInUserId();

  if (!loggedInUserId) {
    notFound();
  }

  const user = await getUser(loggedInUserId);

  if (!user) {
    notFound();
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <NavigationBar goBackUrl="/setting" pageTitle="내 프로필"/>
      <div className="p-5 pt-20 flex-auto w-full flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{formatDate(user.createdAt)} 가입</p>
        </div>
        <div  className="flex flex-col gap-3">
          <form action={logout}>
            <button>로그아웃</button>
          </form>
          <form action={deleteAccount}>
            <button>회원 탈퇴</button>
            {/*TODO: 회원탈퇴 정말 탈퇴하시겠습니까? 모달 필요*/}
          </form>
        </div>
      </div>
    </div>
  );
}