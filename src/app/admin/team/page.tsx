import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ManageTeamPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Team</h1>
        <Button>Add Team Member</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here you will be able to add, edit, or delete team members.</p>
          {/* Team members list will go here */}
        </CardContent>
      </Card>
    </div>
  );
}
