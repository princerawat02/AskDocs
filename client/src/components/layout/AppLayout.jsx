export function AppLayout({ sidebar, viewer, chat }) {
  return (
    <div className="flex h-screen min-h-[680px] overflow-hidden bg-[#f6f8fb]">
      {sidebar}
      <main className="flex min-w-0 flex-1 flex-col">{viewer}</main>
      {chat}
    </div>
  );
}
