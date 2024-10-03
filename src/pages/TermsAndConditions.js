import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Terms and Conditions</h1>
      <div className="space-y-4">
        <section>
          <h2 className="mb-2 text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p>By accessing or using the Local Listing service, you agree to be bound by these Terms and Conditions.</p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl font-semibold">2. Description of Service</h2>
          <p>Local Listing is a platform that allows users to post and browse local listings for various goods and services.</p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl font-semibold">3. User Accounts</h2>
          <p>
            Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their
            account.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl font-semibold">4. Listing Content</h2>
          <p>
            Users are solely responsible for the content of their listings. Prohibited content includes illegal items, offensive material, and
            fraudulent listings.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl font-semibold">5. Privacy</h2>
          <p>Our use of your personal information is governed by our Privacy Policy.</p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl font-semibold">6. Limitation of Liability</h2>
          <p>Local Listing is not responsible for the quality, safety, or legality of listed items or the accuracy of listings.</p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl font-semibold">7. Modifications to Service</h2>
          <p>We reserve the right to modify or discontinue the service at any time without notice.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
