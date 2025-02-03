import { __ } from '@wordpress/i18n';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHeading as Heading,
	Button,
} from '@wordpress/components';

const PaidyTitle = () => {
	return (
		<Heading level={ 2 }>
			{ __( 'Easy Paidy payment setup', 'paidy-wc' ) }
		</Heading>
	);
}

const ApplyButton = ( { onClick } ) => {
    const handleClick = () => {
        window.location.href = "/wp-admin/admin.php?page=wc-admin&path=%2Fpaidy-on-boarding";
      };
    
	return (
		<Button isPrimary className="paidy-setting-step1 paidy-button" onClick={ handleClick }>
			{ __( 'Start easy Paidy payment setup', 'paidy-wc' ) }
		</Button>
	);
};

const UnderReviewMessage = () => {
	return (
        <div className="paidy-completed-message">
            <Heading level={ 3 }>
                { __( 'Status: Under review', 'paidy-wc' ) }
            </Heading>
            <p>{ __( 'Thank you for your application. We will notify you of the results via email and dashboard.', 'paidy-wc' ) }</p>
            <ul>
                <li>{ __( 'The review process may take up to 10 business days.', 'paidy-wc' ) }</li>
                <li>{ __( 'Inquiries regarding screening: sales@paidy.com', 'paidy-wc' ) }</li>
            </ul>
        </div>
	);
};

const ReviewApprovedMessage = () => {
	const restUrl = window.paidyForWcSettings?.restUrl || '';
	return (
		<div className="paidy-completed-message">
			<Heading level={ 3 }>
				{ __( 'Status: Approved', 'paidy-wc' ) }
			</Heading>
			<p>{ __( 'The review has been completed and the merchant agreement has been concluded.', 'paidy-wc' ) }</p>
			<p>{ __( 'For terms of use, please check the terms and conditions notification email sent by Paidy Inc.', 'paidy-wc' ) }</p>
			<ul>
				<li>{ __( 'We recommend setting the Webhook URL in the Paidy merchant management screen before publishing in production mode. Set the Webhook URL to the following value.', 'paidy-wc' ) }</li>
				<li>{ __( '[Common for test and production]', 'paidy-wc' ) } { restUrl }wp-json/paidy/v1/order/</li>
                <li>{ __( 'Please refer to the manual for information on the Paidy merchant management screen.', 'paidy-wc') }</li>
			</ul>
		</div>
	);
};

const ReviewRejectedMessage = () => {
	return (
		<div className="paidy-completed-message">
			<Heading level={ 3 }>
				{ __( 'Status: Rejected', 'paidy-wc' ) }
			</Heading>
            <ul>
                <li>{ __( 'After careful and repeated review, we regret to inform you that we have decided to postpone the transaction at this time.', 'paidy-wc' ) }</li>
                <li>{ __( 'We sincerely apologize for not being able to meet your expectations.', 'paidy-wc' ) }</li>
                <li>{ __( 'Please understand that we cannot provide details about the content of the review.', 'paidy-wc') }</li>
            </ul>
		</div>
    );
}

export {
    PaidyTitle,
    ApplyButton,
	UnderReviewMessage,
	ReviewApprovedMessage,
	ReviewRejectedMessage,
};