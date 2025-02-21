import {deletePost} from "@/app/calendar/actions";

interface ModalDeleteProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  postId: string;
}

export default function ModalDelete({setIsModalOpen, postId}: ModalDeleteProps) {
  return (
    <div className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white w-2/3 max-w-72">
        <div className="flex justify-center items-center py-10 border-b border-foreground">
          <span>정말 삭제하시나요?</span>
        </div>
        <div className="grid grid-cols-2">
          <button className="py-4 border-r border-foreground" onClick={() => setIsModalOpen(false)}>취소</button>
          <form action={() => deletePost(postId)}>
            <button className="py-4 w-full h-full">삭제</button>
          </form>
        </div>
      </div>
    </div>
  );
}