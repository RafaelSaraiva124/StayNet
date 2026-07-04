import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Hotel, Calendar, UserCheck } from "lucide-react";
import { db } from "@/database/drizzle";
import { users, hotels, bookings } from "@/database/schema";
import { eq, or, count } from "drizzle-orm";

export async function DashboardStats() {
  const normalUsers = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.role, "User"));

  const partners = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.role, "Partner"));

  const totalHotels = await db.select({ count: count() }).from(hotels);

  const activeBookings = await db
    .select({ count: count() })
    .from(bookings)
    .where(
      or(eq(bookings.status, "Confirmed"), eq(bookings.status, "Pending")),
    );

  const stats = [
    {
      title: "Utilizadores",
      value: normalUsers[0].count,
      icon: Users,
      description: "Total de utilizadores registados",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Parceiros",
      value: partners[0].count,
      icon: UserCheck,
      description: "Utilizadores parceiros",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Hotéis",
      value: totalHotels[0].count,
      icon: Hotel,
      description: "Total de hotéis registados",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Reservas Ativas",
      value: activeBookings[0].count,
      icon: Calendar,
      description: "Reservas confirmadas e pendentes",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
