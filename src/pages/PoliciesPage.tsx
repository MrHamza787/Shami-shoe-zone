import React from 'react';
import { ShieldCheck, RefreshCw, Truck, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { StoreSettings } from '../types';

interface PoliciesPageProps {
  settings: StoreSettings;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ settings }) => {
  const { isUrdu } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
          Customer Trust & Transparency
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-neutral-950">
          Store Policies & Guarantee
        </h1>
        <p className="text-xs text-neutral-500">
          Shami Shoe Zone – Shami General Store, Kala Pul, Abbottabad
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Return & Exchange */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-neutral-950 font-serif">
              7-Day Size Replacement & Exchange Policy
            </h2>
          </div>
          <div className="text-xs text-neutral-600 space-y-2 leading-relaxed pt-1">
            <p>
              We want you to wear shoes that fit you perfectly. If the shoe size you ordered does not fit comfortably:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Notify us via WhatsApp within <strong>7 days</strong> of delivery.</li>
              <li>The shoes must be unworn outdoors with the sole and tags intact.</li>
              <li>Our local Abbottabad rider will visit your address to swap for your preferred size (e.g. EU 41 to EU 42), or you can visit our Kala Pul store directly for instant replacement.</li>
            </ul>
          </div>
        </div>

        {/* Abbottabad Delivery */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-neutral-950 font-serif">
              Home Delivery in Abbottabad & Cash on Delivery (COD)
            </h2>
          </div>
          <div className="text-xs text-neutral-600 space-y-2 leading-relaxed pt-1">
            <p>
              We deliver to all areas of Abbottabad including Kala Pul, Mandian, Cantt, Supply Bazar, Jinnahabad, PMA Kakul Road, Bilal Town, Link Road, Kehal, and Nawan Shehr.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Standard delivery fee: <strong>PKR {settings.deliveryCharges}</strong> flat rate across Abbottabad.</li>
              <li><strong>Free Delivery</strong> on orders above PKR {settings.freeDeliveryThreshold.toLocaleString()}.</li>
              <li>Delivery time is typically <strong>same-day or within 2 to 4 hours</strong> of WhatsApp confirmation.</li>
              <li>Payment method is <strong>Cash on Delivery (COD)</strong>. You inspect your shoes upon arrival before handing cash to the delivery rider.</li>
            </ul>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-100 text-neutral-800">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-neutral-950 font-serif">
              Privacy & Customer Data Protection
            </h2>
          </div>
          <div className="text-xs text-neutral-600 space-y-2 leading-relaxed pt-1">
            <p>
              Your personal information (name, contact phone number, home address, and WhatsApp message) is stored securely in our encrypted Firebase database solely for the purpose of order fulfillment and delivery dispatch.
            </p>
            <p>
              We never sell, rent, or share your contact numbers or home address with any third-party marketing companies.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
