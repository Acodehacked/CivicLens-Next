import { getStaffContext } from "@/lib/auth/staff-context";
import { getNotificationFeed } from "@/lib/data/analytics";
import NotificationsPage from "@/app/admin/pages/notifications/NotificationsPage";

export default async function NotificationsRoute() {
  const { role, department } = await getStaffContext();
  const scope = role === "admin" ? null : department;

  const items = await getNotificationFeed(scope, 40);

  return <NotificationsPage items={items} />;
}
