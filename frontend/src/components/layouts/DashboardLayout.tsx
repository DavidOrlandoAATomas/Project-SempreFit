"use client";

import Sidebar
from "./Sidebar";
import Navbar from "./Navbar";
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
<div
 className="
 flex
 min-h-screen"
>

 <Sidebar />

 <div
  className="
  flex-1"
 >

  <Navbar />

  <main
   className="
   p-8
   bg-slate-100
   min-h-screen"
  >

   {children}

  </main>

 </div>

</div>

  );
}