import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Truck,
  ExternalLink
} from 'lucide-react';
import { StoreSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl } from '../services/storeService';

interface ContactPageProps {
  settings: StoreSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const { isUrdu } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('Shoe Size / Availability');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedText = `INQUIRY – SHAMI SHOE ZONE ABBOTTABAD

Name: ${name}
Phone: ${phone}
Subject: ${inquiryType}
Message: ${message}`;

    window.open(getWhatsAppUrl(settings.whatsappNumber, formattedText), '_blank');
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Title */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
          {isUrdu ? 'رابطہ کریں' : 'Get in Touch'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-neutral-950">
          Contact Shami Shoe Zone
        </h1>
        <p className="text-xs text-neutral-500">
          We’re here to help you find the right fit and fulfill your footwear orders across Abbottabad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-neutral-950 font-serif">
              Store Information
            </h3>

            <div className="space-y-4 text-xs text-neutral-700">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Physical Store Location</h4>
                  <p className="text-neutral-600 mt-0.5">{settings.storeAddress}</p>
                  <p className="text-[11px] text-amber-800 font-medium mt-0.5">{settings.storeAddressUrdu}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 flex-shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">WhatsApp Orders & Sizing</h4>
                  <p className="text-neutral-600 mt-0.5">{settings.displayWhatsApp}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Instant WhatsApp replies</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Store Timings</h4>
                  <p className="text-neutral-600 mt-0.5">{settings.storeTiming}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Open Monday through Sunday</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 flex-shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Delivery Coverage</h4>
                  <p className="text-neutral-600 mt-0.5">{settings.deliveryArea}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={getWhatsAppUrl(settings.whatsappNumber, 'Hello Shami Shoe Zone! I want to visit your shop at Kala Pul, Abbottabad.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp Directly</span>
              </a>
            </div>
          </div>

          {/* Quick FAQ / Visiting advice */}
          <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200/80 text-xs text-amber-950 space-y-2">
            <h4 className="font-bold">Visiting Kala Pul Store?</h4>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Our store is conveniently located along Kala Pul bridge on the Karakoram Highway in Abbottabad. Parking is available right outside the Shami General Store complex.
            </p>
          </div>
        </div>

        {/* Message / Inquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-950 font-serif">
              Send an Inquiry to Shami Shoe Zone
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Have questions regarding specific shoe sizes, bulk orders, or Abbottabad home delivery? Submit below to open in WhatsApp.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950">Inquiry Prepared!</h4>
              <p className="text-xs text-emerald-800">
                Your message has been sent to WhatsApp for instant confirmation by our Abbottabad staff.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asad Mehmood"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Inquiry Subject</label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white"
                >
                  <option value="Shoe Size / Availability">Shoe Size & Stock Availability</option>
                  <option value="Abbottabad Delivery Time">Abbottabad Delivery Time Inquiry</option>
                  <option value="Custom Peshawari Chappal Order">Custom Peshawari Chappal Order</option>
                  <option value="Size Exchange Request">Size Exchange / Replacement</option>
                  <option value="Wholesale & Bulk Orders">Wholesale & Wedding Footwear Orders</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Message or Specific Shoe Name *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us which footwear model or size you need..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>Submit & Chat on WhatsApp</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
