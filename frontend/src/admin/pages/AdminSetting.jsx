import React, { useState } from "react";
import {
  Save,
  Percent,
  Mail,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminSetting = () => {
  const [settings, setSettings] = useState({
    platformName: "Cayman Maintenance",
    supportEmail: "support@cayman.com",
    commissionRate: 10,
    currency: "USD",
    paymentGateway: "Stripe",
    enableEmailNotifs: true,
    enableSmsNotifs: false,
    smtpServer: "smtp.example.com",
    smsApiKey: "sk_test_12345",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Settings saved successfully");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Platform Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure global application preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* General */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="text-base sm:text-lg font-bold">
              General Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <input
              type="text"
              name="platformName"
              value={settings.platformName}
              onChange={handleChange}
              placeholder="Platform Name"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              placeholder="Support Email"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Financial Settings */}
        {/* Financial settings removed per request */}
        {/* Financial */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <Percent className="w-5 h-5 text-green-600" />
            <h2 className="text-base sm:text-lg font-bold">
              Financial Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <input
              type="number"
              name="commissionRate"
              value={settings.commissionRate}
              onChange={handleChange}
              placeholder="Commission %"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>INR</option>
            </select>

            <select
              name="paymentGateway"
              value={settings.paymentGateway}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option>Stripe</option>
              <option>PayPal</option>
              <option>Razorpay</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <Mail className="w-5 h-5 text-purple-600" />
            <h2 className="text-base sm:text-lg font-bold">
              Notifications
            </h2>
          </div>

          <div className="space-y-6">

            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-800">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Send emails via SMTP
                </p>
              </div>

              <input
                type="checkbox"
                name="enableEmailNotifs"
                checked={settings.enableEmailNotifs}
                onChange={handleChange}
                className="w-5 h-5"
              />
            </div>

            {settings.enableEmailNotifs && (
              <input
                type="text"
                name="smtpServer"
                value={settings.smtpServer}
                onChange={handleChange}
                placeholder="SMTP Server"
                className="w-full p-3 rounded-xl border border-gray-200"
              />
            )}

            {/* SMS */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-800">
                  SMS Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Send via API
                </p>
              </div>

              <input
                type="checkbox"
                name="enableSmsNotifs"
                checked={settings.enableSmsNotifs}
                onChange={handleChange}
                className="w-5 h-5"
              />
            </div>

            {settings.enableSmsNotifs && (
              <input
                type="text"
                name="smsApiKey"
                value={settings.smsApiKey}
                onChange={handleChange}
                placeholder="SMS API Key"
                className="w-full p-3 rounded-xl border border-gray-200"
              />
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
          >
            <Save className="w-5 h-5 inline mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSetting;