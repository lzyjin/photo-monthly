"use client";

import {TrashIcon} from "@heroicons/react/24/solid";
import {useState} from "react";
import ModalDelete from "@/components/modal-delete";

interface ButtonDeletePostProps {
  postId: string;
}

export default function ButtonDeletePost({postId}: ButtonDeletePostProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClickDeleteButton = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button onClick={onClickDeleteButton}>
        <TrashIcon className="size-4"/>
      </button>
      {
        isModalOpen &&
        <ModalDelete setIsModalOpen={setIsModalOpen} postId={postId} />
      }
    </>
  );
}