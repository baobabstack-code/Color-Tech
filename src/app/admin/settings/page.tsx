"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  getGeneralSettings,
  updateGeneralSettings,
  getProfileSettings,
  updateProfileSettings,
  getAppearanceSettings,
  updateAppearanceSettings,
  getBookingSettings,
  updateBookingSettings,
  getNotificationSettings,
  updateNotificationSettings,
  getIntegrationSettings,
  updateIntegrationSettings,
} from '@/services/settingsService';

const SettingsCard = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-600 mb-6">{description}</p>
    <div>{children}</div>
  </Card>
);

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [generalSettings, setGeneralSettings] = useState({ siteTitle: '', businessName: '', contactEmail: '', contactPhone: '' });
  const [profileSettings, setProfileSettings] = useState({ fullName: '', email: '', currentPassword: '', newPassword: '' });
  const [appearanceSettings, setAppearanceSettings] = useState({ themeColor: '#000000', logo: null as File | null });
  const [bookingSettings, setBookingSettings] = useState({ defaultDuration: 60, bookingWindow: 30, cancellationPolicy: '', enableOnlineBooking: true });
  const [notificationSettings, setNotificationSettings] = useState({ newBookings: true, cancellations: true, newReviews: false });
  const [integrations, setIntegrations] = useState({ googleCalendar: false, stripe: false, mailchimp: false });

  useEffect(() => {
    const fetchAllSettings = async () => {
      try {
        setLoading(true);
        const [general, profile, appearance, booking, notifications, integrationData] = await Promise.all([
          getGeneralSettings(),
          getProfileSettings(),
          getAppearanceSettings(),
          getBookingSettings(),
          getNotificationSettings(),
          getIntegrationSettings(),
        ]);
        setGeneralSettings(general as any);
        setProfileSettings(prev => ({ ...prev, ...profile }));
        setAppearanceSettings(prev => ({ ...prev, ...appearance }));
        setBookingSettings(booking as any);
        setNotificationSettings(notifications as any);
        setIntegrations(integrationData as any);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load settings.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchAllSettings();
  }, [toast]);

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateGeneralSettings(generalSettings);
      toast({ title: 'Success!', description: 'General settings have been updated.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update general settings.', variant: 'destructive' });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileSettings(profileSettings);
      toast({ title: 'Success!', description: 'Your profile has been updated.' });
      setProfileSettings(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' });
    }
  };

  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;
    if (id === 'logo' && files) {
      setAppearanceSettings(prev => ({ ...prev, logo: files[0] }));
    } else {
      setAppearanceSettings(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleAppearanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Note: File upload logic would be more complex in a real app
      await updateAppearanceSettings({ themeColor: appearanceSettings.themeColor });
      toast({ title: 'Success!', description: 'Appearance settings have been updated.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update appearance settings.', variant: 'destructive' });
    }
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checkedValue = (e.target as HTMLInputElement).checked;

    setBookingSettings(prev => ({ 
      ...prev, 
      [id]: isCheckbox ? checkedValue : value 
    }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBookingSettings(bookingSettings);
      toast({ title: 'Success!', description: 'Booking settings have been updated.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update booking settings.', variant: 'destructive' });
    }
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [id]: checked }));
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateNotificationSettings(notificationSettings);
      toast({ title: 'Success!', description: 'Notification settings have been updated.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update notification settings.', variant: 'destructive' });
    }
  };

  const handleIntegrationToggle = async (integration: keyof typeof integrations) => {
    const updatedIntegrations = { ...integrations, [integration]: !integrations[integration] };
    try {
      await updateIntegrationSettings(updatedIntegrations);
      setIntegrations(updatedIntegrations);
      toast({
        title: 'Success!',
        description: `${integration.charAt(0).toUpperCase() + integration.slice(1)} integration status has been updated.`,
      });
    } catch (error) {
      toast({ title: 'Error', description: `Failed to update ${integration} status.`, variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <SettingsCard title="General Settings" description="Manage general site settings.">
            <form onSubmit={handleGeneralSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700">Site Title</label>
                  <input type="text" id="siteTitle" value={generalSettings.siteTitle} onChange={handleGeneralChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
                  <input type="text" id="businessName" value={generalSettings.businessName} onChange={handleGeneralChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
                  <input type="email" id="contactEmail" value={generalSettings.contactEmail} onChange={handleGeneralChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
                  <input type="tel" id="contactPhone" value={generalSettings.contactPhone} onChange={handleGeneralChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors">Save Changes</button>
              </div>
            </form>
          </SettingsCard>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <SettingsCard title="Profile Settings" description="Update your personal information.">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" id="fullName" value={profileSettings.fullName} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" value={profileSettings.email} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.993A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Change</button>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input type="password" id="currentPassword" value={profileSettings.currentPassword} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                    <input type="password" id="newPassword" value={profileSettings.newPassword} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors">Update Profile</button>
              </div>
            </form>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <SettingsCard title="Appearance Settings" description="Customize the look and feel of your site.">
            <form onSubmit={handleAppearanceSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="themeColor" className="block text-sm font-medium text-gray-700">Theme Color</label>
                  <input type="color" id="themeColor" value={appearanceSettings.themeColor} onChange={handleAppearanceChange} className="mt-1 block w-full h-10 px-1 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo</label>
                  <div className="mt-1 flex items-center">
                    <input type="file" id="logo" onChange={handleAppearanceChange} className="sr-only" />
                    <label htmlFor="logo" className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Upload File</label>
                    <span className="ml-3 text-sm text-gray-500">{appearanceSettings.logo?.name || 'No file chosen'}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors">Save Changes</button>
              </div>
            </form>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="booking" className="mt-6">
          <SettingsCard title="Booking Settings" description="Configure booking-related options.">
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="defaultDuration" className="block text-sm font-medium text-gray-700">Default Booking Duration (minutes)</label>
                  <input type="number" id="defaultDuration" value={bookingSettings.defaultDuration} onChange={handleBookingChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="bookingWindow" className="block text-sm font-medium text-gray-700">Booking Window (days in advance)</label>
                  <input type="number" id="bookingWindow" value={bookingSettings.bookingWindow} onChange={handleBookingChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="cancellationPolicy" className="block text-sm font-medium text-gray-700">Cancellation Policy</label>
                <textarea id="cancellationPolicy" value={bookingSettings.cancellationPolicy} onChange={handleBookingChange} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="enableOnlineBooking" checked={bookingSettings.enableOnlineBooking} onChange={handleBookingChange} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="enableOnlineBooking" className="ml-2 block text-sm text-gray-900">Enable Online Booking</label>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors">Save Changes</button>
              </div>
            </form>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <SettingsCard title="Notification Settings" description="Manage when and how you receive notifications.">
            <form onSubmit={handleNotificationSubmit} className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <span className="text-sm font-medium text-gray-700">New Booking Notifications</span>
                <input type="checkbox" id="newBookings" checked={notificationSettings.newBookings} onChange={handleNotificationChange} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-md">
                <span className="text-sm font-medium text-gray-700">Cancellation Notifications</span>
                <input type="checkbox" id="cancellations" checked={notificationSettings.cancellations} onChange={handleNotificationChange} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-md">
                <span className="text-sm font-medium text-gray-700">New Review Notifications</span>
                <input type="checkbox" id="newReviews" checked={notificationSettings.newReviews} onChange={handleNotificationChange} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors">Save Changes</button>
              </div>
            </form>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <SettingsCard title="Integrations" description="Connect with third-party services.">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h4 className="font-medium">Google Calendar</h4>
                  <p className="text-sm text-gray-500">Sync your bookings with Google Calendar.</p>
                </div>
                <button 
                    type="button"
                    onClick={() => handleIntegrationToggle('googleCalendar')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                        integrations.googleCalendar 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}>
                    {integrations.googleCalendar ? 'Disconnect' : 'Connect'}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h4 className="font-medium">Stripe</h4>
                  <p className="text-sm text-gray-500">Enable online payments for your services.</p>
                </div>
                <button 
                    type="button"
                    onClick={() => handleIntegrationToggle('stripe')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                        integrations.stripe
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}>
                    {integrations.stripe ? 'Disconnect' : 'Connect'}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h4 className="font-medium">Mailchimp</h4>
                  <p className="text-sm text-gray-500">Sync your customer list with Mailchimp.</p>
                </div>
                <button 
                    type="button"
                    onClick={() => handleIntegrationToggle('mailchimp')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                        integrations.mailchimp
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}>
                    {integrations.mailchimp ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          </SettingsCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}