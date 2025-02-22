import { Sidebar } from "@/components/site-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function Preferences() {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-[220px_1fr]">
      <Sidebar className="border-r" />
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold">Preferences</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Username</div>
              <div className="text-lg">{user?.username}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Role</div>
              <div className="text-lg capitalize">{user?.role}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
