import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChatHeader } from "@/components/chat-header";
import { ChatContainer } from "@/components/chat-container";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem"
        }
      }>
      <AppSidebar />
      <SidebarInset>
        <ChatHeader />
        <ChatContainer />
      </SidebarInset>
    </SidebarProvider>
  );
}
