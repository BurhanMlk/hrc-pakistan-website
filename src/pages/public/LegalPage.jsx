import PageHeader from '../../components/layout/PageHeader.jsx';

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    desc: 'How we collect, use and protect your personal information.',
    sections: [
      { h: '1. Information We Collect', p: 'We collect information you voluntarily provide through our forms — including membership, volunteer, event registration, contact and concern reporting forms — such as your name, contact details and any information you choose to share.' },
      { h: '2. How We Use Information', p: 'We use the information you provide to respond to your requests, process applications and registrations, and review reported concerns. We do not sell your personal information.' },
      { h: '3. Confidentiality of Concerns', p: 'Information submitted through the concern reporting system is treated with strict confidentiality and is accessible only to authorized staff on a need-to-know basis.' },
      { h: '4. Data Security', p: 'We apply appropriate technical and organizational measures to protect personal information against unauthorized access, alteration or disclosure.' },
      { h: '5. Your Rights', p: 'You may request access to, correction of, or deletion of your personal information by contacting us through the Contact page.' },
      { h: '6. Changes', p: 'We may update this policy from time to time. Changes will be posted on this page.' },
    ],
  },
  terms: {
    title: 'Terms of Use',
    desc: 'The terms governing your use of this website.',
    sections: [
      { h: '1. Acceptance', p: 'By accessing this website, you agree to these Terms of Use. If you do not agree, please do not use the website.' },
      { h: '2. Informational Content', p: 'Content on this website is provided for general informational purposes and does not constitute professional legal advice.' },
      { h: '3. No Emergency Service', p: 'This website is not an emergency service. If you are in immediate danger, contact local emergency services.' },
      { h: '4. User Submissions', p: 'You are responsible for the accuracy of information you submit. Do not submit false or misleading information.' },
      { h: '5. Intellectual Property', p: 'Content on this website is protected by applicable laws and may not be reproduced without permission.' },
      { h: '6. Limitation of Liability', p: 'The organization is not liable for any damages arising from the use of this website to the extent permitted by law.' },
    ],
  },
  data: {
    title: 'Data Protection Policy',
    desc: 'How we safeguard personal data in line with data protection principles.',
    sections: [
      { h: '1. Purpose', p: 'This policy explains how we collect, process, store and protect personal data provided to us.' },
      { h: '2. Lawful Processing', p: 'We process personal data based on consent, legitimate interest, or legal obligation, as applicable.' },
      { h: '3. Data Minimization', p: 'We collect only the information necessary for the purpose for which it is provided.' },
      { h: '4. Storage & Retention', p: 'Personal data is retained only for as long as necessary to fulfill its purpose or as required by law.' },
      { h: '5. Sharing', p: 'We share data only with authorized personnel and, where required, with relevant authorities in accordance with the law.' },
      { h: '6. Security Measures', p: 'We implement access controls, encryption, and other safeguards to protect personal data.' },
      { h: '7. Contact', p: 'For data protection inquiries, contact us through the Contact page.' },
    ],
  },
};

export default function LegalPage({ type }) {
  const content = CONTENT[type] || CONTENT.privacy;
  return (
    <>
      <PageHeader title={content.title} description={content.desc} eyebrow="Legal" breadcrumbs={[{ label: content.title }]} />
      <section className="section-pad">
        <div className="container-page prose-content mx-auto max-w-3xl">
          {content.sections.map((s) => (
            <div key={s.h}>
              <h2>{s.h}</h2>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
