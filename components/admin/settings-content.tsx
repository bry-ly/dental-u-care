"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconBell,
  IconBriefcase,
  IconKey,
  IconShield,
  IconUser,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
  getAdminSettings,
  updateAdminSettings,
} from "@/lib/actions/settings-actions";

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

type AdminSettingsContentProps = {
  user: User;
};

export function AdminSettingsContent({}: AdminSettingsContentProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  // General Settings State
  const [clinicName, setClinicName] = React.useState("Dental U-Care");
  const [clinicEmail, setClinicEmail] = React.useState("info@dentalucare.com");
  const [clinicPhone, setClinicPhone] = React.useState("+1 (555) 123-4567");
  const [clinicAddress, setClinicAddress] = React.useState(
    "123 Medical Plaza, Suite 100"
  );
  const [timezone, setTimezone] = React.useState("America/New_York");

  // Appointment Settings State
  const [appointmentDuration, setAppointmentDuration] = React.useState("60");
  const [bufferTime, setBufferTime] = React.useState("15");
  const [maxAdvanceBooking, setMaxAdvanceBooking] = React.useState("90");
  const [cancellationDeadline, setCancellationDeadline] = React.useState("24");
  const [autoConfirmAppointments, setAutoConfirmAppointments] =
    React.useState(false);

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [smsNotifications, setSmsNotifications] = React.useState(true);
  const [appointmentReminders, setAppointmentReminders] = React.useState(true);
  const [reminderHoursBefore, setReminderHoursBefore] = React.useState("24");
  const [newBookingNotifications, setNewBookingNotifications] =
    React.useState(true);
  const [cancellationNotifications, setCancellationNotifications] =
    React.useState(true);

  // Payment Settings State
  const [requirePaymentUpfront, setRequirePaymentUpfront] =
    React.useState(false);
  const [allowPartialPayment, setAllowPartialPayment] = React.useState(true);
  const [depositPercentage, setDepositPercentage] = React.useState("50");
  const [acceptCash, setAcceptCash] = React.useState(true);
  const [acceptCard, setAcceptCard] = React.useState(true);
  const [acceptEWallet, setAcceptEWallet] = React.useState(true);

  // Security Settings State
  const [twoFactorAuth, setTwoFactorAuth] = React.useState(false);
  const [sessionTimeout, setSessionTimeout] = React.useState("60");
  const [passwordExpiry, setPasswordExpiry] = React.useState("90");
  const [loginAttempts, setLoginAttempts] = React.useState("5");

  // Load settings on mount
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getAdminSettings();
        if (settings) {
          setClinicName(settings.clinicName);
          setClinicEmail(settings.clinicEmail);
          setClinicPhone(settings.clinicPhone);
          setClinicAddress(settings.clinicAddress);
          setTimezone(settings.timezone);
          setAppointmentDuration(settings.appointmentDuration);
          setBufferTime(settings.bufferTime);
          setMaxAdvanceBooking(settings.maxAdvanceBooking);
          setCancellationDeadline(settings.cancellationDeadline);
          setAutoConfirmAppointments(settings.autoConfirmAppointments);
          setEmailNotifications(settings.emailNotifications);
          setSmsNotifications(settings.smsNotifications);
          setAppointmentReminders(settings.appointmentReminders);
          setReminderHoursBefore(settings.reminderHoursBefore);
          setNewBookingNotifications(settings.newBookingNotifications);
          setCancellationNotifications(settings.cancellationNotifications);
          setRequirePaymentUpfront(settings.requirePaymentUpfront);
          setAllowPartialPayment(settings.allowPartialPayment);
          setDepositPercentage(settings.depositPercentage);
          setAcceptCash(settings.acceptCash);
          setAcceptCard(settings.acceptCard);
          setAcceptEWallet(settings.acceptEWallet);
          setTwoFactorAuth(settings.twoFactorAuth);
          setSessionTimeout(settings.sessionTimeout);
          setPasswordExpiry(settings.passwordExpiry);
          setLoginAttempts(settings.loginAttempts);
        }
      } catch (error) {
        console.error("Failed to load admin settings:", error);
        toast.error("Failed to load settings");
      }
    };
    loadSettings();
  }, []);

  const handleSaveGeneral = async () => {
    setIsLoading(true);
    try {
      const result = await updateAdminSettings({
        clinicName,
        clinicEmail,
        clinicPhone,
        clinicAddress,
        timezone,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save general settings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAppointments = async () => {
    setIsLoading(true);
    try {
      const result = await updateAdminSettings({
        appointmentDuration,
        bufferTime,
        maxAdvanceBooking,
        cancellationDeadline,
        autoConfirmAppointments,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save appointment settings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      const result = await updateAdminSettings({
        emailNotifications,
        smsNotifications,
        appointmentReminders,
        reminderHoursBefore,
        newBookingNotifications,
        cancellationNotifications,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save notification settings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePayments = async () => {
    setIsLoading(true);
    try {
      const result = await updateAdminSettings({
        requirePaymentUpfront,
        allowPartialPayment,
        depositPercentage,
        acceptCash,
        acceptCard,
        acceptEWallet,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save payment settings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    setIsLoading(true);
    try {
      const result = await updateAdminSettings({
        twoFactorAuth,
        sessionTimeout,
        passwordExpiry,
        loginAttempts,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save security settings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your clinic settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="general" className="gap-2">
            <IconBriefcase className="size-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-2">
            <IconUser className="size-4" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <IconBell className="size-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <IconKey className="size-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <IconShield className="size-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Information</CardTitle>
              <CardDescription>
                Update your clinic&apos;s basic information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clinic-name">Clinic Name</Label>
                  <Input
                    id="clinic-name"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="Dental U-Care"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-email">Email Address</Label>
                  <Input
                    id="clinic-email"
                    type="email"
                    value={clinicEmail}
                    onChange={(e) => setClinicEmail(e.target.value)}
                    placeholder="info@dentalucare.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-phone">Phone Number</Label>
                  <Input
                    id="clinic-phone"
                    value={clinicPhone}
                    onChange={(e) => setClinicPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time (PT)
                      </SelectItem>
                      <SelectItem value="Asia/Manila">
                        Philippine Time (PHT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinic-address">Clinic Address</Label>
                <Textarea
                  id="clinic-address"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  placeholder="123 Medical Plaza, Suite 100"
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointment Settings */}
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Configuration</CardTitle>
              <CardDescription>
                Manage appointment durations, booking limits, and scheduling
                rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="appointment-duration">
                    Default Duration (minutes)
                  </Label>
                  <Select
                    value={appointmentDuration}
                    onValueChange={setAppointmentDuration}
                  >
                    <SelectTrigger id="appointment-duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buffer-time">Buffer Time (minutes)</Label>
                  <Select value={bufferTime} onValueChange={setBufferTime}>
                    <SelectTrigger id="buffer-time">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No buffer</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-advance">
                    Maximum Advance Booking (days)
                  </Label>
                  <Input
                    id="max-advance"
                    type="number"
                    value={maxAdvanceBooking}
                    onChange={(e) => setMaxAdvanceBooking(e.target.value)}
                    min="1"
                    max="365"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellation-deadline">
                    Cancellation Deadline (hours)
                  </Label>
                  <Input
                    id="cancellation-deadline"
                    type="number"
                    value={cancellationDeadline}
                    onChange={(e) => setCancellationDeadline(e.target.value)}
                    min="1"
                    max="72"
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-confirm Appointments</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically confirm new bookings without manual review
                  </p>
                </div>
                <Switch
                  checked={autoConfirmAppointments}
                  onCheckedChange={setAutoConfirmAppointments}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveAppointments} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure email, SMS, and reminder notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminders to patients before appointments
                    </p>
                  </div>
                  <Switch
                    checked={appointmentReminders}
                    onCheckedChange={setAppointmentReminders}
                  />
                </div>
                {appointmentReminders && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="reminder-hours">
                      Send reminder (hours before)
                    </Label>
                    <Select
                      value={reminderHoursBefore}
                      onValueChange={setReminderHoursBefore}
                    >
                      <SelectTrigger id="reminder-hours">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="12">12 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Booking Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new appointments are booked
                    </p>
                  </div>
                  <Switch
                    checked={newBookingNotifications}
                    onCheckedChange={setNewBookingNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cancellation Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when appointments are cancelled
                    </p>
                  </div>
                  <Switch
                    checked={cancellationNotifications}
                    onCheckedChange={setCancellationNotifications}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>
                Manage payment methods and billing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Payment Upfront</Label>
                    <p className="text-sm text-muted-foreground">
                      Require full payment when booking
                    </p>
                  </div>
                  <Switch
                    checked={requirePaymentUpfront}
                    onCheckedChange={setRequirePaymentUpfront}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Partial Payment</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow patients to pay a deposit
                    </p>
                  </div>
                  <Switch
                    checked={allowPartialPayment}
                    onCheckedChange={setAllowPartialPayment}
                  />
                </div>
                {allowPartialPayment && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="deposit-percentage">
                      Deposit Percentage
                    </Label>
                    <div className="relative">
                      <Input
                        id="deposit-percentage"
                        type="number"
                        value={depositPercentage}
                        onChange={(e) => setDepositPercentage(e.target.value)}
                        min="10"
                        max="100"
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                )}
                <Separator />
                <div className="space-y-3">
                  <Label>Accepted Payment Methods</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-normal">Cash</Label>
                      <Switch
                        checked={acceptCash}
                        onCheckedChange={setAcceptCash}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="font-normal">Credit/Debit Card</Label>
                      <Switch
                        checked={acceptCard}
                        onCheckedChange={setAcceptCard}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="font-normal">E-Wallet</Label>
                      <Switch
                        checked={acceptEWallet}
                        onCheckedChange={setAcceptEWallet}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSavePayments} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
              <CardDescription>
                Manage security settings and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                  />
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">
                      Session Timeout (minutes)
                    </Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      min="15"
                      max="480"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-expiry">
                      Password Expiry (days)
                    </Label>
                    <Input
                      id="password-expiry"
                      type="number"
                      value={passwordExpiry}
                      onChange={(e) => setPasswordExpiry(e.target.value)}
                      min="30"
                      max="365"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-attempts">
                      Maximum Login Attempts
                    </Label>
                    <Input
                      id="login-attempts"
                      type="number"
                      value={loginAttempts}
                      onChange={(e) => setLoginAttempts(e.target.value)}
                      min="3"
                      max="10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
