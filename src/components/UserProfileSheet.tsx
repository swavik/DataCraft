import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Calendar, Pencil, Check, X } from "lucide-react";
import { UserProfile } from "@/hooks/useUserProfile";

interface UserProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export default function UserProfileSheet({
  open,
  onOpenChange,
  profile,
  updateProfile,
}: UserProfileSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [editedPhone, setEditedPhone] = useState(profile.phone);

  useEffect(() => {
    if (open) {
      setEditedName(profile.name);
      setEditedPhone(profile.phone);
      setIsEditing(false);
    }
  }, [open, profile]);

  const handleSave = () => {
    updateProfile({
      name: editedName,
      phone: editedPhone,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(profile.name);
    setEditedPhone(profile.phone);
    setIsEditing(false);
  };
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-12 top-4 h-8 w-8 rounded-full"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit Profile</span>
          </Button>
        ) : (
          <div className="absolute right-12 top-4 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={handleSave}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Save</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-destructive"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel</span>
            </Button>
          </div>
        )}

        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
          <SheetDescription>
            Your account information and details
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center py-4">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold">
                {getInitials(isEditing ? editedName : profile.name)}
              </AvatarFallback>
            </Avatar>
            {isEditing ? (
              <div className="mt-4 w-full px-8">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Full Name"
                  className="text-center font-semibold h-9"
                  autoFocus
                />
              </div>
            ) : (
              <h3 className="mt-4 text-xl font-semibold">{profile.name}</h3>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <User className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                {isEditing ? (
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="mt-1 h-8 px-2 py-0 text-base font-semibold"
                  />
                ) : (
                  <p className="text-base font-semibold mt-1">{profile.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                <p className="text-base font-semibold mt-1 break-all">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Phone className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                {isEditing ? (
                  <Input
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    className="mt-1 h-8 px-2 py-0 text-base font-semibold"
                  />
                ) : (
                  <p className="text-base font-semibold mt-1">{profile.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Calendar className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                <p className="text-base font-semibold mt-1">{formatDate(profile.joinedDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
