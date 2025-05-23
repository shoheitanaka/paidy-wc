import { __ } from '@wordpress/i18n';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHeading as Heading,
	Button,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

const FlowExplanation = () => {
    return (
        <>
        <Heading level={ 3 }>
            { __( 'Application flow', 'paidy-wc' ) }
        </Heading>
        <ol className="paidy-flow">
            <li>{ __( 'Please fill in all the fields on this application screen and click the "Agree to the above and apply" button at the bottom of the screen.', 'paidy-wc' ) }</li>
            <li>{ __( 'Paidy Co., Ltd. will review your application information and may take up to 10 business days.', 'paidy-wc' ) }</li>
            <li>{ __( 'The results will be notified via email and dashboard.', 'paidy-wc' ) }</li>
            <li>{ __( 'If your application is approved, you will be able to activate Paidy from your dashboard.', 'paidy-wc' ) } <br/> 
                { __( 'If your application is rejected, you will not be able to use Paidy.', 'paidy-wc' ) }</li>
        </ol>
        </>
    );
};

const AgreementInfo = () => {
    return (
        <>
        <div className="paidy-heading">
        <Heading level={ 3 }>
            { __( 'Agreement', 'paidy-wc' ) }
        </Heading>
        </div>
        <div className="paidy-agreement">
            <p className="paidy-agreement-text">
            { __( 'Please confirm and agree to the following contents.', 'paidy-wc' ) }
            </p>
            <ol>
                <li><a href="https://terms.paidy.com/" target="_blank">{ __( 'Paidy Merchant Terms and Conditions', 'paidy-wc' ) }</a></li>
                <li>{ __( 'Agreement on handling of affiliated store information', 'paidy-wc' ) }</li>
                <li>{ __( 'Add the notation specified by our company to the notation based on the Specified Commercial Transactions Act.', 'paidy-wc' ) }<br />
                <a href="https://merchant-support.paidy.com/hc/ja/articles/16629903258649-%E7%89%B9%E5%95%86%E6%B3%95%E3%81%AB%E5%9F%BA%E3%81%A5%E3%81%8F%E8%A1%A8%E7%A4%BA%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB" target="_blank">{ __( 'Display sample based on the Specified Commercial Transactions Act', 'paidy-wc' ) }</a></li>
                <li>{ __( 'Add the specified notation to the privacy policy page.', 'paidy-wc' ) }<br />
                <a href="https://merchant-support.paidy.com/hc/ja/articles/16631714849561-%E3%83%97%E3%83%A9%E3%82%A4%E3%83%90%E3%82%B7%E3%83%BC%E3%83%9D%E3%83%AA%E3%82%B7%E3%83%BC%E3%81%AE%E8%A8%98%E5%85%A5%E4%BE%8B" target="_blank">{ __( 'Example of a privacy policy', 'paidy-wc' ) }</a></li>
                <li>{ __( 'Paidy Inc. will set up the API key on your e-commerce site via WooCommerce on your behalf.', 'paidy-wc' ) }</li>
                <li>{ __( 'Our company (Shokunin Kobo LLC) will provide personal information to third parties in the following cases.', 'paidy-wc' ) }</li>
                <li>{ __( 'When disclosing personal information for the purposes of merchant membership screening by payment companies, etc.', 'paidy-wc' ) }</li>
            </ol>
        </div>
        </>
    );
};

const ApplyCompletedMessage = () => {
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

const ReviewRejectedMessage = () => {
    return (
        <div className="paidy-rejected-message">
            <Heading level={ 3 }>
                { __( 'Status: The review was rejected', 'paidy-wc' ) }
            </Heading>
            <ul>
                <li>{ __( 'After careful and repeated review, we regret to inform you that we have decided to postpone the transaction at this time.', 'paidy-wc' ) }</li>
                <li>{ __( 'We sincerely apologize for not being able to meet your expectations.', 'paidy-wc' ) }</li>
                <li>{ __( 'Please understand that we cannot provide details about the content of the review.', 'paidy-wc') }</li>
            </ul>
        </div>
    );
};

const ReviewApprovedMessage = () => {
    const [isLoading, setIsLoading] = useState(false);
	const { createErrorNotice, createSuccessNotice } = useDispatch( noticesStore );
	const restUrl = window.paidyForWcSettings?.restUrl || '';

    const onSavingTestMode = () => {
        setIsLoading(true);

        apiFetch({
            path: '/wc/v3/payment_gateways/paidy',
            method: 'PUT',
            data: {
                enabled: true,
                settings: {
                    environment:'sandbox'
                },
            },
        }).then((response) => {
			createSuccessNotice(
				__( 'Settings saved.', 'paidy-wc' )
			);
            window.location.href = '/wp-admin/admin.php?page=wc-settings&tab=checkout&section=paidy';
        }).catch((error) => {
            setIsLoading(false);
            createErrorNotice(
                ( error.message || __('Error enabling Paidy', 'paidy-wc') ),
                { type: 'snackbar', isDismissible: true, autoDismiss: false }
            );
        });
    };

    const onSavingProductionMode = () => {
        setIsLoading(true);

        apiFetch({
            path: '/wc/v3/payment_gateways/paidy',
            method: 'PUT',
            data: {
                enabled: true,
                settings: {
                    environment:'live'
                },
            },
        }).then((response) => {
            window.location.href = '/wp-admin/admin.php?page=wc-settings&tab=checkout&section=paidy';
        }).catch((error) => {
            setIsLoading(false);
            createErrorNotice(
                ( error.message || __('Error enabling Paidy', 'paidy-wc') ),
                { type: 'snackbar', isDismissible: true, autoDismiss: false }
            );
        });
    };
    return (
        <div className="paidy-approved-message">
            <Heading level={ 3 }>
                { __( 'Status: The review approved', 'paidy-wc' ) }
            </Heading>
            <p>{ __( 'The review has been completed and the merchant agreement has been concluded.', 'paidy-wc' ) }<br />
            { __( 'For terms of use, please check the terms and conditions notification email sent by Paidy Inc.', 'paidy-wc' ) }</p>
            <ul className="paidy-approved-list">
                <li>{ __( 'We recommend setting the Webhook URL in the Paidy merchant management screen before publishing in production mode. Set the Webhook URL to the following value.', 'paidy-wc' ) }</li>
                <li>{ __( '[Common for test and production]', 'paidy-wc' ) }</li>
                <li>{restUrl}wp-json/paidy/v1/order/</li>
                <li>{ __( 'Please refer to the manual for information on the Paidy merchant management screen.', 'paidy-wc') }</li>
            </ul>
            <div className="paidy-enabled-button">
                <p>{ __( 'Please click one of the buttons below.', 'paidy-wc' ) }</p>
                <Button className="paidy-button test-button"
                isPrimary 
                onClick={ onSavingTestMode }
                disabled={ isLoading }
                >
                    { __( 'Enable test mode', 'paidy-wc' ) }
                    { isLoading
                        ? __('Enabling Paidy...', 'paidy-wc')
                        : __('Enable Paidy', 'paidy-wc')
                    }
                </Button><br />
                <Button className="paidy-button production-button" 
                isPrimary 
                onClick={ onSavingProductionMode }
                disabled={ isLoading }
                >
                    { __( 'Enable production mode', 'paidy-wc' ) }
                </Button>
            </div>
        </div>
    );
};

const SettingSandboxMessage = () => {
    const [isLoading, setIsLoading] = useState(false);
	const { createErrorNotice, createSuccessNotice } = useDispatch( noticesStore );

    const onSavingProductionMode = () => {
        setIsLoading(true);

        apiFetch({
            path: '/wc/v3/payment_gateways/paidy',
            method: 'PUT',
            data: {
                enabled: true,
                settings: {
                    environment:'live'
                },
            },
        }).then((response) => {
            window.location.href = '/wp-admin/admin.php?page=wc-settings&tab=checkout&section=paidy';
        }).catch((error) => {
            setIsLoading(false);
            createErrorNotice(
                ( error.message || __('Error enabling Paidy', 'paidy-wc') ),
                { type: 'snackbar', isDismissible: true, autoDismiss: false }
            );
        });
    };
    return (
        <div className="paidy-setting-sandbox-message">
            <Heading level={ 3 }>
                { __( 'Paidy test payments enabled', 'paidy-wc' ) }
            </Heading>
            <p>
                { __( 'You can now test Paidy payments.', 'paidy-wc' ) }<br/>
                { __( 'Please check the test payment flow.', 'paidy-wc' ) }<br/>
                <a href="https://paidy.com/docs/jp/testing.html" target="_blank">{ __( 'Paidy test payment flow', 'paidy-wc' ) }</a><br/>
                { __( 'After confirming the test payment, please switch to production mode.', 'paidy-wc' ) }
            </p>
            <Button className="paidy-button production-button" 
                isPrimary 
                onClick={ onSavingProductionMode }
                disabled={ isLoading }
                >
                    { __( 'Enable production mode', 'paidy-wc' ) }
            </Button>
        </div>
    );
};

const SettingCompletedMessage = () => {
    return (
        <div className="paidy-setting-completed-message">
            <Heading level={ 3 }>
                { __( 'Paidy Payments is now live', 'paidy-wc' ) }
            </Heading>
        </div>
    );
};

export {
    FlowExplanation,
    AgreementInfo,
    ApplyCompletedMessage,
    ReviewRejectedMessage,
    ReviewApprovedMessage,
    SettingSandboxMessage,
    SettingCompletedMessage,
};