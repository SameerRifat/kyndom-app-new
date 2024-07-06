import React from 'react'

const page = () => {
    return (
        <div>
            <h1 className="py-6 font-elmessiri font-semibold text-3xl leading-6 text-center">
                TERMS AND CONDITIONS
            </h1>
            <p className='text-sm text-light-gray mt-3'>
                Welcome to the Kyndom LLC website and online store. If you continue to browse and use this website and any affiliated mobile applications, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy, govern Kyndom LLC's relationship with you in relation to this website and any products or services you purchase through this website.
                <br /> <br />
                The term "Kyndom LLC" or "us" or "we" refers to the owner of the website. The term "you" refers to the user or viewer of our website or purchaser of our products and services.
                <br /> <br />
                The use of this website is subject to the following terms of use:
            </p>

            {termsAndConditionsData.map((item, index) => {
                return (
                    <>
                        <div className='mt-7' key={index}>
                            <h1 className="font-elmessiri text-2xl leading-6 mb-3">{item.heading}</h1>
                            {item.description && (
                                <p className='text-sm text-light-gray'>
                                    {item.description}
                                </p>
                            )}
                            {item.descriptionWithBullets && (
                                <>
                                    {item.descriptionWithBullets}
                                </>
                            )}
                        </div>
                    </>
                )
            })}
        </div>
    )
}

export default page

const termsAndConditionsData = [
    {
        heading: '1. ACCEPTANCE OF TERMS',
        description: <>
            By using and shopping on this website, you agree to be bound by these terms and conditions and the Kyndom LLC Privacy Policy. If you do not agree to be legally bound by these terms and conditions and the Kyndom LLC Privacy Policy, you should not use or access this Site for any purpose, including to purchase products.
            <br /><br />
            These terms and conditions apply to the purchase and sale of products and services through the Site. Additional terms and conditions may apply to specific portions or features of the Site, all of which terms are made a part of these terms and conditions by this reference.
        </>
    },
    {
        heading: '2. GEOGRAPHIC SCOPE',
        description: 'The Site is intended for use by individuals located in the United States. We make no representation that the Site or Content (as further defined below) is appropriate or available for use in other locations. Users who choose to access the Site from other locations do so on their own initiative and are responsible for compliance with local laws, if and to the extent local laws are applicable.'
    },
    {
        heading: '3. USE OF THE SITE',
        descriptionWithBullets:
            <>
                <p className='text-sm text-light-gray'>
                    You agree to use the Site and the Content (as further defined below) only for purposes that are permitted by these terms and conditions, and only for purposes that are legal. By using the Site, you agree that you will not
                </p>
                <br />
                <ul className='list-disc text-sm text-light-gray ml-5'>
                    <li>
                        Use the Site in any way that violates federal, state, local, or international law or regulation.
                    </li>
                    <li>
                        Use the Site to transmit or otherwise make available any unsolicited or unauthorized advertising, promotional materials, junk mail, or any other form of solicitation.
                    </li>
                    <li>
                        Use the Site to impersonate any person or entity or otherwise misrepresent your affiliation with a person or entity.
                    </li>
                    <li>
                        Interfere with or disrupt the Site or Content or disobey any requirements, procedures, policies, or regulations provided to you from time to time regarding the Site or Content.
                    </li>
                    <li>
                        Send messages to any individual who has requested that you not send them a message.
                    </li>
                    <li>
                        Copy, reproduce, distribute, publish, display, perform, modify, create derivative works from, transmit, or in any other way exploit any part of the Site or Content, except as expressly permitted by Kyndom LLC.
                    </li>
                </ul>
                <br />
                <p className='text-sm text-light-gray'>
                    If you encounter technical difficulties accessing the platform or its content, please contact our customer service at info@kyndom.com. We will work with you to resolve any issues and ensure that you can successfully access and use the platform and its content.
                    Before making a purchase, please ensure that you have carefully reviewed the product description to ensure that the digital content provided on the platform meets your expectations.
                    If you have any questions about our refund policy for access to our digital content platform, please contact us at info@kyndom.com.
                </p>
            </>
    },
    {
        heading: '4. CHANGES TO TERMS OF USE',
        description: 'We reserve the right to change or modify the terms and conditions contained in these Terms or any policy or guideline of the Site, at any time and in our sole discretion. Any changes or modification will be effective immediately upon posting of the revisions on the Site, and your continued use of the Site following the posting of its changes or modifications will constitute your acceptance of such changes or modifications. If you do not agree with a change or modification, you must stop using the Site. We will use reasonable efforts to provide notice of changes or modifications to these Terms, such as by posting a notice on the Site or updating the "Last Updated" date above. However, we encourage you to check these Terms frequently to be informed of any changes or modifications.'
    },
    {
        heading: '5. INTELLECTUAL PROPERTY RIGHTS',
        description: <>
            Unless otherwise noted, the Site and all materials on the Site, including text, images, illustrations, designs, icons, photographs, video clips and other materials, and the copyrights, trademarks, trade dress and/or other intellectual property rights in such materials (collectively, the "Content"), are owned, controlled or licensed by Kyndom LLC.
            <br /> <br />
            The Site and the Content are intended solely for personal, non-commercial use. You may download or copy the Content and other downloadable materials displayed on the Site for your personal use only. No right, title or interest in any downloaded Content is transferred to you as a result of any such downloading or copying. You may not reproduce (except as noted above), publish, transmit, distribute, display, modify, create derivative works from, sell or exploit in any way any of the Content or the Site.
        </>
    },
    {
        heading: '6. YOUR ACCOUNT',
        description: <>
            You will need to create an account and provide certain information about yourself in order to use some of the features that are offered through the Site. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other similar breach of security. We may, in our sole discretion, terminate or suspend your password, account (or any part thereof), or use of the Site at any time and for any reason, including if we believe that you have violated or acted inconsistently with these Terms.
            <br /> <br />
            You agree that any information you provide to us, whether at registration or at any other time, will be true, accurate, current and complete. You also agree that you will ensure that this information is kept accurate and up to date at all times. If you have reason to believe that your account is no longer secure, you must immediately notify us.
        </>
    },
    {
        heading: '7. PRIVACY POLICY',
        description: 'Any personal information that you provide to the Site is subject to our Privacy Policy, which governs our collection and use of your personal information.'
    },
    {
        heading: '8. RESTRICTED ACTIVITIES',
        description: "You may not use the Site to: (a) transmit spam, bulk or unsolicited communications; (b) pretend to be Kyndom LLC or another person or entity, or spoof Kyndom LLC or another person or entity's identity; (c) misrepresent your affiliation with a person or entity; (d) engage in fraud; (e) violate any federal, state, or local laws; or (f) store or transmit material that is fraudulent, defamatory, obscene or violates any individual's privacy or intellectual property rights."
    },
    {
        heading: '9. PRODUCTS AND PRICING',
        description: <>
            All descriptions, images, references, features, content, specifications, products, and prices of products and services described or depicted on this Site are subject to change at any time without notice. Certain weights, measures, and similar descriptions are approximate and are for convenience only.
            <br /> <br />
            We reserve the right, with or without prior notice, to do any one or more of the following: (i) limit the available quantity of or discontinue any product; (ii) impose conditions on the honoring of any coupon, coupon code, promotional code, or other similar promotion; (iii) bar any user from making or completing any or all transaction(s); and (iv) refuse to provide any user with any product or service.
            <br /> <br />
            The inclusion of any products or services on this Site at a particular time does not imply or warrant that these products or services will be available at any time. It is your responsibility to ascertain and obey all applicable local, state, federal, and international laws (including minimum age requirements) in regard to the possession, use and sale of any item purchased from this Site.
            <br /> <br />
            The price and availability of items on the Site are subject to change without notice.
        </>
    },
    {
        heading: '10. ORDER ACCEPTANCE POLICY',
        description: "Please note that there may be certain orders that we are unable to accept and must cancel. We reserve the right, at our sole discretion, to refuse or cancel any order for any reason. Some situations that may result in your order being canceled include limitations on quantities available for purchase, inaccuracies or errors in product or pricing information, or problems identified by our credit and fraud avoidance department."
    },
    {
        heading: '11. ACCESS TO DIGITAL CONTENT',
        description: "Upon successful completion of your order, you will be granted access to our platform, which contains all the digital files and links associated with your purchase. Access to the platform will be provided through the email address associated with your account. It is your responsibility to ensure that you have provided a valid email address and to check your email, including your spam or junk mail folders, for the platform access information."
    },
    {
        heading: '12. REFUND POLICY',
        descriptionWithBullets:
            <>
                <p className='text-sm text-light-gray'>
                    At Kyndom LLC, we want you to be completely satisfied with your purchase of access to our digital content platform. If for any reason you are not satisfied with the content provided on the platform, we offer a 14-day satisfaction guarantee.
                    To be eligible for a refund, you must contact our customer service at info@kyndom.com within 14 days of your purchase date, stating the reason for your dissatisfaction. Upon approval, we will process your refund within 10 business days and revoke your access to the platform. Refunds will be issued to the original payment method used for the purchase.
                    Please note that we reserve the right to refuse refunds if we suspect abuse of this policy, such as:
                </p>
                <br />
                <ul className='list-disc text-sm text-light-gray ml-5'>
                    <li>
                        Excessive refund requests from the same customer
                    </li>
                    <li>
                        Refund requests after the 14-day satisfaction guarantee period
                    </li>
                    <li>
                        Refund requests for reasons unrelated to the quality or content of the digital files and links provided on the platform
                    </li>
                </ul>
                <br />
                <p className='text-sm text-light-gray'>
                    If you encounter technical difficulties accessing the platform or its content, please contact our customer service at info@kyndom.com. We will work with you to resolve any issues and ensure that you can successfully access and use the platform and its content.
                    Before making a purchase, please ensure that you have carefully reviewed the product description to ensure that the digital content provided on the platform meets your expectations.
                    If you have any questions about our refund policy for access to our digital content platform, please contact us at info@kyndom.com.
                </p>
            </>
    },
    {
        heading: '13. PAYMENT TERMS',
        description: <>
            For any purchases you make via the Site, you agree to pay, at the time of order, the price applicable for the products or services you ordered as of the time you submitted the order. We reserve the right, in our sole discretion, to change, modify, add or remove prices and fees for products and services offered through the Site at any time. We will charge your selected payment method for your purchase of products through the Site. Applicable taxes and other charges, if any, may be added to the price of products and services purchased through the Site.
            You are responsible for the timely payment of all fees and for providing us with a valid payment method for payment of all fees. You must promptly notify us if your credit card has expired by updating your account information.
        </>
    },
    {
        heading: '14. PRODUCT DESCRIPTIONS',
        description: <>
            We have taken reasonable precautions to ensure that all product descriptions, prices, and other Content on the Site are correct and fairly described. By placing an order on this Site, you are making an offer to Kyndom LLC. Our acknowledgment of an order means that your order request has been received; it does not mean that your order has been accepted or shipped or that the price or availability of an item has been confirmed. We reserve the right to not accept the offer if there has been a material error in the description of the product,
        </>
    },
    {
        heading: '15. DISCLAIMER OF WARRANTIES',
        description: <>
            YOU EXPRESSLY AGREE THAT USE OF THE SITE IS AT YOUR SOLE RISK. THE SITE AND ITS CONTENT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, KYNDOM LLC DISCLAIMS ALL WARRANTIES, REPRESENTATIONS AND CONDITIONS OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. KYNDOM LLC MAKES NO WARRANTY OR REPRESENTATION THAT (A) THE SITE WILL MEET YOUR REQUIREMENTS; (B) THE SITE WILL BE AVAILABLE ON AN UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE BASIS; (C) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SITE OR ANY SERVICES OFFERED THROUGH THE SITE WILL BE ACCURATE OR RELIABLE; OR (D) THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL PURCHASED OR OBTAINED BY YOU THROUGH THE SITE WILL MEET YOUR EXPECTATIONS.
        </>
    },
    {
        heading: '16. LIMITATION OF LIABILITY',
        description: <>
            IN NO EVENT SHALL KYNDOM LLC BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES (EVEN IF KYNDOM LLC HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), RESULTING FROM: (A) THE USE OR THE INABILITY TO USE THE SITE; (B) UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA; OR (C) ANY OTHER MATTER RELATING TO THE SITE. IN NO EVENT SHALL KYNDOM LLC'S TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES AND CAUSES OF ACTION (WHETHER IN CONTRACT, TORT OR OTHERWISE) EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR USING OR ACCESSING THE SITE.
        </>
    },
    {
        heading: '17. INDEMNIFICATION',
        description: <>
            You agree to indemnify, defend, and hold harmless Kyndom LLC, its officers, directors, employees, agents, licensors and suppliers from and against all claims, losses, liabilities, expenses, damages and costs, including reasonable attorneys' fees, resulting from (i) any violation of these terms and conditions, (ii) any activity related to your account, or (iii) your use of the Site.
        </>
    },
    {
        heading: '18. TERMINATION',
        description: <>
            We reserve the right, without notice and in our sole discretion, to terminate your license to use the Site and to block or prevent your future access to and use of the Site.
        </>
    },
    {
        heading: '19. SEVERABILITY',
        description: <>
            If any provision of these Terms shall be deemed unlawful, void, or for any reason unenforceable, then that provision shall be deemed severable from these Terms and shall not affect the validity and enforceability of any remaining provisions.
        </>
    },
    {
        heading: '20. APPLICABLE LAW AND JURISDICTION',
        description: <>
            These terms and conditions are governed by and construed in accordance with the laws of the State of [STATE], and you agree to submit to the exclusive jurisdiction of the courts located in the State of California. We recognize that it is possible for you to obtain access to the Site from any jurisdiction in the world, but we have no practical ability to prevent such access. The Site has been designed to comply with the laws of California. If any material on the Site, or your use of the Site, is contrary to the laws of the place where you are when you access it, the Site is not intended for you, and we ask you not to use the Site. You are responsible for informing yourself of the laws of your jurisdiction and complying with them.
        </>
    },
    {
        heading: '21. CONTACT INFORMATION',
        description: <>
            If you have any questions about these Terms, please contact us at info@kyndom.com.
            <br /> <br />
            Last Updated: May 22, 2024
        </>
    },
]