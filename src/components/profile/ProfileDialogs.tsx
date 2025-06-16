
import React from 'react';
import { User2, Mail, Phone, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserData } from '@/types/profile';

const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(6, { message: "Please enter a valid phone number." })
});

const healthInfoSchema = z.object({
  bloodType: z.string().min(1, { message: "Please select a blood type." }),
  allergies: z.string().optional(),
  emergencyContact: z.string().min(6, { message: "Please provide an emergency contact." })
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface ProfileDialogsProps {
  openDialog: string | null;
  userData: UserData;
  onCloseDialog: () => void;
  onSavePersonalInfo: (data: z.infer<typeof personalInfoSchema>) => void;
  onSaveHealthInfo: (data: z.infer<typeof healthInfoSchema>) => void;
  onChangePassword: (data: z.infer<typeof passwordSchema>) => void;
}

const ProfileDialogs: React.FC<ProfileDialogsProps> = ({
  openDialog,
  userData,
  onCloseDialog,
  onSavePersonalInfo,
  onSaveHealthInfo,
  onChangePassword
}) => {
  const personalInfoForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone
    }
  });

  const healthInfoForm = useForm({
    resolver: zodResolver(healthInfoSchema),
    defaultValues: {
      bloodType: userData.healthInfo.bloodType,
      allergies: userData.healthInfo.allergies,
      emergencyContact: userData.healthInfo.emergencyContact
    }
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <>
      <Dialog open={openDialog === 'personal'} onOpenChange={(isOpen) => {
        if (!isOpen) onCloseDialog();
        if (isOpen) {
          personalInfoForm.reset({
            name: userData.name,
            email: userData.email,
            phone: userData.phone
          });
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User2 className="h-5 w-5 text-primary" />
              Personal Information
            </DialogTitle>
            <DialogDescription>
              Update your personal details and contact information
            </DialogDescription>
          </DialogHeader>
          
          <Form {...personalInfoForm}>
            <form onSubmit={personalInfoForm.handleSubmit(onSavePersonalInfo)} className="space-y-4 py-4">
              <FormField
                control={personalInfoForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={personalInfoForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Mail className="w-4 h-4 text-muted-foreground mr-2 self-center" />
                        <Input placeholder="your.email@example.com" type="email" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      We'll never share your email with anyone else.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={personalInfoForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Phone className="w-4 h-4 text-muted-foreground mr-2 self-center" />
                        <Input placeholder="+1 (555) 123-4567" type="tel" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={onCloseDialog}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="gap-1"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDialogs;
