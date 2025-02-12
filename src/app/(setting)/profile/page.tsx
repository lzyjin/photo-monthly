import NavigationBar from "@/components/navigation-bar";
import {db} from "@/lib/db";
import {getLoggedInUserId} from "@/lib/session";
import {notFound} from "next/navigation";
import {deleteAccount, logout} from "@/app/(setting)/profile/actions";

async function getUser(id: number) {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  return user;
}

export default async function Profile() {
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
      <NavigationBar goBackUrl="/" pageTitle="마이페이지"/>
      <div className="p-5 pt-20 flex-auto w-full">
        <div>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.createdAt.toString()}</p>
        </div>
        <form action={logout}>
          <button>로그아웃</button>
        </form>
        <form action={deleteAccount}>
          <button>회원 탈퇴</button>
          {/*TODO: 회원탈퇴 정말 탈퇴하시겠습니까? 모달 필요*/}
        </form>
      </div>
    </div>
  );
}