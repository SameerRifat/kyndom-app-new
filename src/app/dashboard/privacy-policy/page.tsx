import React from 'react'

const page = () => {
  return (
    <div>
      <h1 className="py-6 font-elmessiri font-semibold text-3xl leading-6 text-center">
        Privacy Policy for Kyndom LLC:
      </h1>

      {privacyPolicyData.map((item, index) => {
        return (
          <>
            <div className='mt-7' key={index}>
              <h1 className="font-elmessiri text-2xl leading-6 mb-3">{item.heading}</h1>
              <p className='text-sm text-light-gray'>
                {item.description}
              </p>
            </div>
          </>
        )
      })}
    </div>
  )
}

export default page

const privacyPolicyData = [
  {
    heading: 'Privacy Policy',
    description: <>This Privacy Statement shall govern and apply to anyone accessing or using the websites located at Kyndom, our mobile application(s), our blog(s), and any other website(s) in existence now or created in the future (hereinafter the "Site") owned and/or operated by Kyndom LLC ("Kyndom LLC," "we," "us" or "our"). Kyndom LLC respects your right to privacy. This policy summarizes what personally identifiable information we may collect, and how we might use this information. This policy also describes other important topics relating to your privacy.</>
  },
  {
    heading: 'INFORMATION COLLECTED',
    description: <>
      Kyndom LLC only will collect personally identifiable information (such as name, title, company name, address, telephone number, or e-mail address) that you voluntarily provide through our website or e-mail correspondence. Our host web server tracks and collects general information about the visits to our Site. While IP addresses (the Internet address of a computer) are logged to track a user's session, the user remains anonymous. We analyze this data for certain trends and statistics, such as which parts of our site users are visiting, how long they spend there, the visitors' domain names and what states or countries those requests come from. We do not link your IP addresses to anything personally identifiable to you. We will collect general information (such as the type of browser you use and the files you request) to improve our Web site and better meet your needs.
      <br /> <br />
      Kyndom LLC also requests and collects personal information from our customers at various site locations and instances, including, but not limited to, when you make a purchase, communicate with us via social media, write a product review, participate in events, contests, or promotions, contact our customer care team, or post other customer-generated content to this Site. These are currently the primary ways in which we gather information, however, we may also collect data through other channels in the future. The types of personal information we may collect from you can vary according to the method through which it was attained.
    </>
  },
  {
    heading: 'PERSONAL INFORMATION PROVIDED',
    description:
      <>We receive and store any information you knowingly provide to us, such as:
        <br />
        Full name <br />
        Email address <br />
        Phone number <br />
        Shipping Address <br />
        Billing information and payment details (such as billing address, credit card details, and other sensitive financial information, specifically for the purpose of completing your transaction)
        Username and password for Kyndom.
        <br />
        A record of your Kyndom LLC orders, purchase history, and shopping behavior and preferences. <br /> <br />
        Information provided by you through your interactions with us on social media
        Location and geographic information that could be collected if you use our mobile site or app. <br /> <br />
        Other details that you may submit to us or that may be included in the information provided to us by third parties.
      </>,
  },
  {
    heading: 'PURPOSE OF COLLECTION',
    description: <>
      Kyndom LLC offers various products and services to our Customers and also strives to meet the needs of our Customers. We use your Personal Information for internal purposes such as tracking your order, analyzing your preferences, and noting trends and statistics. To do this effectively, we need to collect certain Personal Information.
    </>
  },
  {
    heading: 'CONSENT OF COLLECTION',
    description: <>
      All Personal Information we collect from you requires your consent, for example, opening an account, purchase and delivery of products, special offers, etc. We may request your consent from time to time to take part in improved product performance or for marketing purposes that we think will be useful to you. However, unless you are informed otherwise, the Personal Information we hold is for establishing and managing our business and customer relationship with you. Sensitive information is subject to greater restrictions and governed by law.
      <br /> <br />
      By communicating with Kyndom LLC, including by email and by completing online forms, you are giving your consent to the collection of what Personal Information you provide.
    </>
  },
  {
    heading: 'RECORDKEEPING OF YOUR PERSONAL INFORMATION',
    description:
      <>
        Depending on the product you have acquired, it may be necessary to keep a record of the transaction for business purposes or to enable us to respond to your concerns. We may hold Personal Information for the following purposes:
        Internal accounting and administration;
        <br /> <br />
        To supply you with information about your account including regular statements;
        <br /> <br />
        To respond to inquiries;
        <br /> <br />
        Enhancing customer service, product options and to improve product performance;
        <br /> <br />
        Promotions, competition entry forms, redemption vouchers, and special offers where you voluntarily supplied your personal details;
        <br /> <br />
        To administer sales records;
        <br /> <br />
        To provide information about us, our products, services and special offers; and to analyze our website usage.
        <br /> <br />
        Occasionally we require organizations outside Kyndom LLC to provide a service for purposes, which are necessary for us to conduct our business, functions and activities (for example advertising names of competition winners and delivering products). We take all steps to ensure these organizations both inside and outside of the United States deal with Personal Information according to this Policy.
      </>
  },
  {
    heading: 'MANAGEMENT OF YOUR PERSONAL INFORMATION',
    description:
      <>
        You may have contact with us personally, by telephone, mail, over the Internet or other electronic medium. We take all reasonable steps to keep your Personal Information secure in a combination of secure computer storage, hard copy files and other records. We take steps to protect the personal information we hold from misuse, loss, unauthorized access, modification or disclosure.
      </>
  },
  {
    heading: 'DISCLOSURE OF YOUR INFORMATION',
    description:
      <>
        Kyndom LLC does not share the personal information of its users with any unaffiliated third parties for their promotional purposes. However, we use a third-party payment processor and a third-party shipping agent to ensure the payment and delivery of your purchased products. These third parties have no authority to use your personal information for their own promotional purposes. These third parties will only have limited access to your personal information in order to help complete transactions.
        <br /> <br />
        Although Kyndom LLC uses industry standard BEST practices to protect your Personal Information, WE DO NOT REPRESENT, WARRANT AND/OR GUARANTEE THAT PERSONAL INFORMATION WILL REMAIN SECURE. Therefore, we cannot and do not guarantee, and you should not expect, that your Personal Information or private communications will always remain private. Notwithstanding this, as a matter of policy, we NEVER sell or rent any Personal Information about you to any third-party. In the event there is a breach of security, or we are made aware that your personal information could be jeopardized, we will take all necessary measures to communicate these issues to you so that you can take steps to protect yourself.
      </>
  },
  {
    heading: 'LEGAL DISCLOSURE',
    description: "Because Kyndom LLC considers the individual information we maintain to be confidential, our policy is to disclose no personal information to third parties (except as described above) unless release is required by law or is pertinent to judicial or government investigations or proceedings. We reserve the right to disclose personal information to our service providers, the government, law enforcement agencies, or other third parties under certain circumstances where a formal request has been made (such as in responding to a court order, subpoena, or judicial proceeding) as Kyndom LLC, in our sole and absolute discretion, deems necessary and appropriate. Moreover, in the event of a sale, merger, or transfer of some or all of Kyndom LLC's assets, or dissolution or bankruptcy, your personal information may be transferred to an unaffiliated third party as part of or apart from other transferred assets or assets. Any transfer will then be governed by and be the responsibility of any purchaser of or successor to the transferred assets or assets. We shall notify you by a notice on the home page of any change in the information practices governing your personal information as a result of any transfer of assets or any asset change in ownership, and your choices in how your information is used."
  },
  {
    heading: 'ACCESSING YOUR PERSONAL INFORMATION',
    description: "You have the right to access the Personal Information you have provided to us. If you require details of your Personal Information held by us, we will need to verify your identity before meeting your request, which we will process in a reasonable time. If you find that the information that we hold about you is inaccurate or out of date, then we will promptly correct it upon receipt of the changes from you."
  },
  {
    heading: 'DATA RETENTION',
    description: "We retain users' personal information for one fiscal year after they cancel their membership. After this period, the personal information will be securely deleted or anonymized."
  },
  {
    heading: 'LINKS TO THIRD PARTY SITES',
    description: "Our Site may contain links to other sites. We do not endorse or otherwise accept responsibility for the content or privacy policies of those sites. However, we encourage you to read the privacy policies of each website you visit prior to disclosing your personal information."
  },
  {
    heading: 'CHILDREN',
    description: "Any personal information or image content you voluntarily disclose online in a manner that other users can view (including, but not limited to: product reviews, comments, posts on social media pages, etc.) becomes publicly available, and can be read, collected, and used by other members of this Site to send you unsolicited messages. Your name, email, or other information may also be displayed when you post comments or upload images throughout the Site. Kyndom LLC is not responsible for the personal information users select to disclose in these forums."
  },
  {
    heading: 'COOKIE POLICY',
    description:
      <>
        By using the Site, you are consenting to the use of the technologies described in this Cookie Policy to collect both personally identifiable information and non-personal data and to the storage of information on your device or web browser as described below.
        <br /> <br />
        A cookie is a piece of information that is placed on your web browser or hard drive when you access and/or use the Site. Cookies store text and can later be read back by the Site or third parties. We use cookies to recognize your browser and you as a unique visitor to the Site through an anonymous unique identifier. Cookies can remember what information you access on one webpage to simplify your subsequent interactions with the Site or to use the information to streamline your transactions on related webpages. This makes it easier for you to move from one webpage to another and to complete commercial transactions over the Internet. Cookies should make your online experience easier and more personalized.
        <br /> <br />
        Cookies may be session cookies (i.e., last only for one browser session) or persistent cookies (i.e., continue on your browser until they are affirmatively deleted). You can manage cookies through your web browser's option settings and through those settings you may be able (a) to receive notifications when you are receiving new cookies; (b) to disable cookies; or (c) to delete cookies. Please refer to your web browser's help section for information on how to do this.
      </>
  },
  {
    heading: 'AGREEMENT TO OUR TERMS & CHANGES TO THIS PRIVACY STATEMENT',
    description:
      <>
        By using this Site, you consent to the collection and use of information by Kyndom LLC from the Site as indicated above. Kyndom LLC reserves the right to modify this privacy policy at any time. We will notify users of any changes to the privacy policy via email. The changes will also be promptly reflected in these Web pages.
        <br /> <br />
        If you have any questions or concerns about this Privacy Policy, please contact us at info@kyndom.com.
      </>
  },
]