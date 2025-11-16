"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateDentistFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateDentistForm({
  open,
  onOpenChange,
  onSuccess,
}: CreateDentistFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    specialization: "",
    qualifications: "",
    experience: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure both passwords are the same.",
      });
      setIsLoading(false);
      return;
    }

    // Validate password requirements
    if (formData.password.length < 8) {
      toast.error("Password too short", {
        description: "Password must be at least 8 characters long.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/users/create-dentist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          specialization: formData.specialization || undefined,
          qualifications: formData.qualifications || undefined,
          experience: formData.experience || undefined,
          address: formData.address || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Failed to create dentist", {
          description: data.error || "Please try again.",
        });
        return;
      }

      toast.success("Dentist created successfully!", {
        description: `${data.user.name} has been added to the system.`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        specialization: "",
        qualifications: "",
        experience: "",
        address: "",
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating dentist:", error);
      toast.error("An unexpected error occurred", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((s) => !s);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Dentist</DialogTitle>
          <DialogDescription>
            Add a new dentist to the system. Email verification is not required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field className="gap-1">
                <FieldLabel htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Dr. Dental U Care"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </Field>

              <Field className="gap-1">
                <FieldLabel htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field className="gap-1">
                <FieldLabel htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={togglePassword}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center p-1 text-sm opacity-70 hover:opacity-100"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <Field className="gap-1">
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  minLength={8}
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field className="gap-1">
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Field>

              <Field className="gap-1">
                <FieldLabel htmlFor="specialization">Specialization</FieldLabel>
                <Input
                  id="specialization"
                  name="specialization"
                  type="text"
                  placeholder="e.g., Orthodontics"
                  value={formData.specialization}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Field>
            </div>

            <Field className="gap-1">
              <FieldLabel htmlFor="qualifications">Qualifications</FieldLabel>
              <Textarea
                id="qualifications"
                name="qualifications"
                placeholder="Enter qualifications, degrees, certifications..."
                value={formData.qualifications}
                onChange={handleChange}
                disabled={isLoading}
                rows={3}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field className="gap-1">
                <FieldLabel htmlFor="experience">Years of Experience</FieldLabel>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  placeholder="5"
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={isLoading}
                  min="0"
                />
              </Field>

              <Field className="gap-1">
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="123 Main St, City, State"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Dentist"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
