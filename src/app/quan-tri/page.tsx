import { redirect } from "next/navigation";

// Fix #9: /quan-tri là dashboard cũ — redirect về /admin (dashboard mới đầy đủ hơn)
export default function QuanTriRedirect() {
  redirect("/admin");
}
