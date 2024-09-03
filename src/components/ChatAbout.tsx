export default function ChatAbout() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-5">
        <h1 className="text-3xl font-bold">Welcome to Daily Chat</h1>
        <p className="w-full">
          This is a chat application that power by supabase realtime database.
        </p>
        Login to send message.
      </div>
    </div>
  );
}
