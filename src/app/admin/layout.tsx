import Link from "next/link"
import {
  Package,
  Home,
  Newspaper,
  MessageSquareQuote,
  Mails,
  Settings,
  PanelLeft,
  FileText,
  ImageIcon,
  FolderKanban,
} from "lucide-react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import UserMenu from "./_components/UserMenu"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile) {
    // This could happen if the user exists in auth but not in the public users table.
    // Redirecting to login will allow them to sign out and try again.
    return redirect('/login?message=Could not find user profile.');
  }

  if (profile.role !== 'admin') {
     // If the user is not an admin, redirect them to the homepage.
    return redirect('/');
  }

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar className="hidden md:block">
          <SidebarHeader>
            <Link href="/" className="block flex-shrink-0">
              <h1 className="text-xl font-semibold font-headline">InSecret Admin</h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin" asChild>
                  <Link href="/admin">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/products" asChild>
                  <Link href="/admin/products">
                    <Package />
                    <span>Products</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/admin/categories" asChild>
                  <Link href="/admin/categories">
                    <FolderKanban />
                    <span>Categories</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/blog" asChild>
                  <Link href="/admin/blog">
                    <Newspaper />
                    <span>Blog Posts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/testimonials" asChild>
                  <Link href="/admin/testimonials">
                    <MessageSquareQuote />
                    <span>Testimonials</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/admin/media" asChild>
                  <Link href="/admin/media">
                    <ImageIcon />
                    <span>Media</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/contact" asChild>
                  <Link href="/admin/contact">
                    <Mails />
                    <span>Contact Submissions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
             <Collapsible asChild>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild className="w-full">
                    <SidebarMenuButton>
                      <FileText />
                      <span>Pages</span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="/admin/pages/home" asChild>
                                <Link href="/admin/pages/home">Home Page</Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                         <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="/admin/pages/home/signature-collections" asChild>
                                <Link href="/admin/pages/home/signature-collections" className="ml-4">Signature Collections</Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                         <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="/admin/pages/home/symphony-of-flavors" asChild>
                                <Link href="/admin/pages/home/symphony-of-flavors" className="ml-4">Symphony of Flavors</Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="/admin/pages/about" asChild>
                                <Link href="/admin/pages/about">About Page</Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="/admin/pages/contact" asChild>
                                <Link href="/admin/pages/contact">Contact Page</Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    </SidebarMenuSub>
                </CollapsibleContent>
               </SidebarMenuItem>
             </Collapsible>
             <SidebarMenuItem>
                <SidebarMenuButton href="/admin/settings" asChild>
                    <Link href="/admin/settings">
                        <Settings />
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden">
              <PanelLeft />
            </SidebarTrigger>
            <div className="w-full flex-1">
              {/* You can add a search bar here in the future if needed */}
            </div>
            <UserMenu user={user} />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
              {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
