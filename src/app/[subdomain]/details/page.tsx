import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardDetailsPage({
  params,
}: {
  params: { subdomain: string };
}) {
  const { subdomain } = params;

  try {
    const dashboard = await prisma.dashboard.findUnique({
      where: { subdomain },
    });

    if (!dashboard) {
      notFound();
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl">{dashboard.name} Details</CardTitle>
            <CardDescription>Subdomain: {subdomain}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">ID:</h3>
                <p>{dashboard.id}</p>
              </div>
              <div>
                <h3 className="font-semibold">Name:</h3>
                <p>{dashboard.name}</p>
              </div>
              <div>
                <h3 className="font-semibold">Subdomain:</h3>
                <p>{dashboard.subdomain}</p>
              </div>
              {/* Add more dashboard details here as needed */}
            </div>
          </CardContent>
        </Card>
        <Link href={`/`} className="mt-8">
          <Button variant="outline">Back to Dashboard Home</Button>
        </Link>
      </div>
    );
  } catch (error) {
    console.error("DashboardDetailsPage: Error fetching dashboard:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold text-red-500">Error</h1>
        <p>There was an error loading the dashboard details.</p>
      </div>
    );
  }
}
