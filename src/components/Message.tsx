import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IMessage, useMessageStore } from "@/lib/store/messages";
import { useUserStore } from "@/lib/store/user";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

export default function Message({ message }: { message: IMessage }) {
  const user = useUserStore((state) => state.user);

  return (
    <div className="flex gap-2">
      {/* <div className="h-10 w-10 bg-green-500 rounded-full"></div> */}
      <div>
        <Image
          src={message.users?.avatar_url!}
          alt={message.users?.display_name!}
          width={40}
          height={40}
          className="rounded-full ring-2"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <h1 className="font-bold">{message.users?.display_name}</h1>
            <h1 className="text-sm text-gray-400">
              {new Date(message.created_at).toDateString()}
            </h1>
          </div>
          {message.users?.id === user?.id && <MessageMenu message={message} />}
        </div>
        <p className="text-gray-300">{message.text}</p>
      </div>
    </div>
  );
}

const MessageMenu = ({ message }: { message: IMessage }) => {
  const setActionMessage = useMessageStore((state) => state.setActionMessage);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-delete")?.click();
            setActionMessage(message);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
