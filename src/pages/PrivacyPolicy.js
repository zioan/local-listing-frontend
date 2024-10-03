import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
      <div className="space-y-6">
        <section>
          <h2 className="mb-2 text-2xl font-semibold">1. Introduction</h2>
          <p>
            Welcome to Local Listing. We're committed to protecting your privacy and personal information. This policy explains how we collect and use
            your data when you use our service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-semibold">2. Information We Collect</h2>
          <p>We collect information you provide when you:</p>
          <ul className="pl-5 mt-2 list-disc">
            <li>Create an account (like your name, email, and username)</li>
            <li>Post a listing (such as item descriptions and images)</li>
            <li>Communicate with other users</li>
          </ul>
          <p className="mt-2">
            We also automatically collect some data when you use our site, like your IP address and device information, to help us improve our service
            and prevent misuse.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-semibold">3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="pl-5 mt-2 list-disc">
            <li>Provide and improve our service</li>
            <li>Communicate with you about your account or listings</li>
            <li>Ensure the security of our platform</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-semibold">4. Information Sharing</h2>
          <p>We don't sell your personal information. We only share your information:</p>
          <ul className="pl-5 mt-2 list-disc">
            <li>With other users when necessary (like when you're communicating about a listing)</li>
            <li>If required by law</li>
            <li>To protect the rights and safety of our users and the public</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-semibold">5. Your Choices</h2>
          <p>You can:</p>
          <ul className="pl-5 mt-2 list-disc">
            <li>Access and update your account information anytime</li>
            <li>Choose what information to include in your listings and messages</li>
            <li>Delete your account (though we may retain some information as required by law)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-semibold">6. Security</h2>
          <p>
            We take reasonable measures to protect your information, but no online service is 100% secure. Use strong passwords and be careful about
            what information you share online.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-semibold">7. Changes to This Policy</h2>
          <p>We may update this policy from time to time. We'll notify you of any significant changes by posting a notice on our website.</p>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-semibold">8. Contact Us</h2>
          <p>If you have any questions about this policy, please contact us at:</p>
          <p className="mt-2">
            support@locallisting.com
            <br />
            Local Listing
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
