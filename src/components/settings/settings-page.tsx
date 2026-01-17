'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Briefcase, ChevronRight, HardHat, LogOut as LogOutIcon, Shield, Smartphone, Trash2, UserCog, Water } from "lucide-react";


// This is a client component for UI demonstration. State is not persisted.
export function SettingsPageClient() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-secondary">Government Employee Settings</h1>
        <p className="text-muted-foreground">Manage your profile, notifications, and security settings.</p>
      </div>
      
      {/* Profile Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>Update your personal and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border">
              <AvatarImage src="https://api.dicebear.com/8.x/initials/svg?seed=Alex+Doe" alt="Alex Doe" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
                <Button variant="outline">Change Photo</Button>
                <p className="text-sm text-muted-foreground">JPG, PNG up to 5MB.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue="Alex Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" defaultValue="Municipal Supervisor" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" defaultValue="Public Works" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="alex.doe@gov.in" readOnly className="bg-muted/50 cursor-not-allowed"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue="+91-9876543210" />
            </div>
          </div>
           <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notification Preferences Section */}
      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Notification Preferences</span>
          </CardTitle>
          <CardDescription>Choose how you want to be notified about issue updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
                <Smartphone className="h-6 w-6 text-muted-foreground"/>
                <div className="space-y-0.5">
                    <Label className="text-base font-medium">In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts directly within the application.</p>
                </div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
                <Smartphone className="h-6 w-6 text-muted-foreground"/>
                <div className="space-y-0.5">
                    <Label className="text-base font-medium">SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get urgent alerts and status updates on your mobile phone.</p>
                </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      
      {/* Role & Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span>Role & Workload</span>
            </CardTitle>
            <CardDescription>Define your role and manage issue assignment preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="role">Assigned Role</Label>
                 <Select defaultValue="supervisor">
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="field-worker">Field Worker</SelectItem>
                    </SelectContent>
                 </Select>
             </div>
             <div className="space-y-2">
              <Label htmlFor="max-issues">Max issues assigned per day</Label>
              <Input id="max-issues" type="number" defaultValue="15" />
            </div>
            <div className="space-y-2">
              <Label>Preferred Issue Categories</Label>
              <div className="space-y-2">
                 <div className="flex items-center justify-between text-sm"><p className="flex items-center gap-2"><HardHat className="h-4 w-4"/>Road Repair / Pothole</p> <ChevronRight className="h-4 w-4 text-muted-foreground"/></div>
                 <div className="flex items-center justify-between text-sm"><p className="flex items-center gap-2"><Trash2 className="h-4 w-4"/>Garbage & Sanitation</p> <ChevronRight className="h-4 w-4 text-muted-foreground"/></div>
                 <div className="flex items-center justify-between text-sm"><p className="flex items-center gap-2"><Water className="h-4 w-4"/>Water Leakage / Supply</p> <ChevronRight className="h-4 w-4 text-muted-foreground"/></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Security Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Security</span>
            </CardTitle>
            <CardDescription>Manage your account security and active sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label className="text-base font-medium">Password</Label>
                    <p className="text-sm text-muted-foreground">Last changed on 1st Jan 2024</p>
                </div>
                <Button variant="outline">Change Password</Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Switch />
            </div>
             <div>
                <Label className="text-base font-medium">Active Sessions</Label>
                <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <div>
                            <p className="font-semibold">Chrome on macOS</p>
                            <p className="text-xs text-muted-foreground">Current Session</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary cursor-default hover:bg-transparent">Active</Button>
                    </div>
                     <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <div>
                            <p className="font-semibold">Safari on iPhone</p>
                            <p className="text-xs text-muted-foreground">Last seen 2 days ago</p>
                        </div>
                        <Button variant="outline" size="sm"><LogOutIcon className="mr-2 h-3 w-3"/>Log out</Button>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
