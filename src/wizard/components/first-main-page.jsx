import { sprintf, __ } from '@wordpress/i18n';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHeading as Heading,
	Button
} from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';
import {
	useOnBoardingSettings,
} from '../../main-hooks/on-boarding-settings';
import {
	usePaidySettings,
} from '../../main-hooks/use-paidy-settings';
import {
    FlowExplanation,
    AgreementInfo,
	ApplyCompletedMessage,
	ReviewRejectedMessage,
	ReviewApprovedMessage,
	SettingSandboxMessage,
	SettingCompletedMessage,
} from '../../main-hooks/form-info';
import {
    StoreNameTextControl,
    SiteNameTextControl,
    StoreUrlTextControl,
    RegistEmailTextControl,
    ContactPhoneTextControl,
    RepresentativeLastNameTextControl,
    RepresentativeFirstNameTextControl,
    RepresentativeLastNameKanaTextControl,
    RepresentativeFirstNameKanaTextControl,
    RepresentativeDateOfBirthTextControl,
    AnnualGrossValueRadioControl,
    AveragePurchaseAmountRadioControl,
    SecuritySurvey01RadioControl,
    SecuritySurvey01TextControl,
    SecuritySurvey11CheckControl,
    SecuritySurvey12CheckControl,
    SecuritySurvey13CheckControl,
    SecuritySurvey14CheckControl,
    SecuritySurvey10TextAreaControl,
    SecuritySurvey08RadioControl,
    SecuritySurvey09RadioControl,
} from './controls';

const SettingsTitle = () => {
	return (
		<Heading level={ 1 }>
			{ __( 'Easy setup for Paidy payment', 'paidy-wc' ) }
		</Heading>
	);
};

const PaidyTitle = () => {
	return (
		<Heading level={ 2 }>
			{ __( 'Paidy application', 'paidy-wc' ) }
		</Heading>
	);
}

const ApplyButton = ( { onClick } ) => {
	return (
		<Button className="paidy-go-apply paidy-button is-primary" onClick={ onClick }>
			{ __( 'Get started now', 'paidy-wc' ) }
		</Button>
	);
};

const SaveButton = ( { onClick } ) => {
	return (
		<div className="paidy-save">
		<Button className="paidy-save paidy-button is-primary" onClick={ onClick }>
			{ __( 'I agree to the above and apply', 'paidy-wc' ) }
		</Button>
		</div>
	);
};

const FirstMainPage = () => {
	const {
        currentStep,
		setCurrentStep,
		storeName,
		setStoreName,
		siteName,
		setSiteName,
		storeUrl,
		setStoreUrl,
		registEmail,
		setRegistEmail,
		contactPhone,
		setContactPhone,
		representativeLastName,
		setRepesentativeLastName,
		representativeFirstName,
		setRepresentativeFirstName,
		representativeLastNameKana,
		setRepresentativeLastNameKana,
		representativeFirstNameKana,
		setRepresentativeFirstNameKana,
		representativeDateOfBirth,
		setRepresentativeDateOfBirth,
		annualGrossValue,
		setAnnualGrossValue,
		averagePurchaseAmount,
		setAveragePurchaseAmount,
		securitySurvey01RadioControl,
		setSecuritySurvey01RadioControl,
		securitySurvey01TextControl,
		setSecuritySurvey01TextControl,
		securitySurvey11CheckControl,
		setSecuritySurvey11CheckControl,
		securitySurvey12CheckControl,
		setSecuritySurvey12CheckControl,
		securitySurvey13CheckControl,
		setSecuritySurvey13CheckControl,
		securitySurvey14CheckControl,
		setSecuritySurvey14CheckControl,
		securitySurvey10TextAreaControl,
		setSecuritySurvey10TextAreaControl,
		securitySurvey08RadioControl,
		setSecuritySurvey08RadioControl,
		securitySurvey09RadioControl,
		setSecuritySurvey09RadioControl,
		saveSettings,
	} = useOnBoardingSettings();
	const {
		settingPaidy,
		setSettingPaidy,
		errorMessage,
	} = usePaidySettings();

	if ( errorMessage ) {
		console.debug( errorMessage );
        return <div>loading...</div>;
    }
	const PaidyEnvironment = settingPaidy?.settings?.environment?.value || [];
	const paidyAdUrl = window.paidyForWcSettings?.paidyAdUrl || 'https://paidy.com/merchant/';
	const pluginName = window.paidyForWcSettings?.pluginName || 'Paidy for WooCommerce';
	if ( currentStep === 1 ) {
		return (
			<>
			<PaidyTitle />
			<div id="paidy-on-boarding" className="paidy-on-boarding">
				<FlowExplanation />
				<div className="paidy-heading">
        			<Heading level={ 3 }>
            			{ __( 'Basic information', 'paidy-wc' ) }
        			</Heading>
        		</div>
        		<div className="paidy-basic-info">
        		<StoreNameTextControl
        		  value={ storeName } 
        		  onChange={ ( value ) => setStoreName( value ) } 
        		/>
        		<SiteNameTextControl
         		  value={ siteName }
        		  onChange={ ( value ) => setSiteName( value ) } 
        		/>
				<StoreUrlTextControl
         		  value={ storeUrl }
				  onChange={ ( value ) => setStoreUrl( value ) } 
				/>
				<RegistEmailTextControl 
         		  value={ registEmail }
				  onChange={ ( value ) => setRegistEmail( value ) } 
				/>
				<ContactPhoneTextControl
				  value={ contactPhone }
				  onChange={ ( value ) => setContactPhone( value ) }
				/>
				<RepresentativeLastNameTextControl
				  value={ representativeLastName }
				  onChange={ ( value ) => setRepesentativeLastName( value ) }
				/>
				<RepresentativeFirstNameTextControl
				  value={ representativeFirstName }
				  onChange={ ( value ) => setRepresentativeFirstName( value ) }
				/>
				<RepresentativeLastNameKanaTextControl
				  value={ representativeLastNameKana }
				  onChange={ ( value ) => setRepresentativeLastNameKana( value ) }
				/>
				<RepresentativeFirstNameKanaTextControl
				  value={ representativeFirstNameKana }
				  onChange={ ( value ) => setRepresentativeFirstNameKana( value ) }
				/>
				<RepresentativeDateOfBirthTextControl
				  value={ representativeDateOfBirth }
				  onChange={ ( value ) => setRepresentativeDateOfBirth( value ) }
				/>
				<AnnualGrossValueRadioControl
				  value={ annualGrossValue }
				  onChange={ ( value ) => setAnnualGrossValue( value ) }
				/>
				<AveragePurchaseAmountRadioControl
				  value={ averagePurchaseAmount }
				  onChange={ ( value ) => setAveragePurchaseAmount( value ) }
				/>
        		</div>
				<div className="paidy-heading">
					<Heading level={ 3 }>
						{ __( 'Security survey', 'paidy-wc' ) }
					</Heading>
					<p>
						{ __('Based on requests from the Ministry of Economy, Trade and Industry and the Japan Consumer Credit Association, all e-commerce affiliates are required to declare the status of their own security measures when joining. Please answer the following questions.', 'paidy-wc') }
					</p>
					<p>
						{createInterpolateElement(
      					__('For details, please refer to <link>the Security Measures Status Declaration Form FAQ.</link>', 'paidy-wc'),
      					{
							link: (
								<a 
        							href="https://paidy.com/merchant/faq/security-survey/" 
            						target="_blank" 
            					rel="noreferrer"
    							/>
							)
    					}
						)}
					</p>
					<p>
						{__('*If the system has not yet been built, please declare the check items for each security measure on the assumption that they will be satisfied once the system is built.', 'paidy-wc') }
					</p>
				</div>
        		<div className="paidy-security-survey">
					<Heading level={ 4 }>
						{ __( '[Measures to prevent leakage of cardholder data]', 'paidy-wc' ) }
					</Heading>
					<p>
						{ __('Administrator screen access restrictions and administrator ID/PW management', 'paidy-wc') }
					</p>
					<SecuritySurvey01RadioControl
					  value={ securitySurvey01RadioControl }
					  onChange={ ( value ) => setSecuritySurvey01RadioControl( value ) }
					/>
					<SecuritySurvey01TextControl
					  value={ securitySurvey01TextControl }
					  onChange={ ( value ) => setSecuritySurvey01TextControl( value ) }
					/>
					<br/>
					<Heading level={ 4 }>
						{ __( '[Countermeasures against unauthorized logins]', 'paidy-wc' ) }
					</Heading>
					<p>
						{ __('*At least one "Yes" is required. If any are missing, we will contact you.', 'paidy-wc') }<br/>
						{ __('Do you take the following measures to prevent unauthorized logins when changing a user\'s attributes?', 'paidy-wc') }
					</p>
					<SecuritySurvey11CheckControl
					  value={ securitySurvey11CheckControl }
					  onChange={ ( value ) => setSecuritySurvey11CheckControl( value ) }
					/>
					<SecuritySurvey12CheckControl
					  value={ securitySurvey12CheckControl }
					  onChange={ ( value ) => setSecuritySurvey12CheckControl( value ) }
					/>
					<SecuritySurvey13CheckControl
					  value={ securitySurvey13CheckControl }
					  onChange={ ( value ) => setSecuritySurvey13CheckControl( value ) }
					/>
					<SecuritySurvey14CheckControl
					  value={ securitySurvey14CheckControl }
					  onChange={ ( value ) => setSecuritySurvey14CheckControl( value ) }
					/>
					<SecuritySurvey10TextAreaControl
					  value={ securitySurvey10TextAreaControl }
					  onChange={ ( value ) => setSecuritySurvey10TextAreaControl( value ) }
					/>
					<Heading level={ 4 }>
						{ __( 'Questionnaire', 'paidy-wc' ) }
					</Heading>
					<SecuritySurvey08RadioControl
					  value={ securitySurvey08RadioControl }
					  onChange={ ( value ) => setSecuritySurvey08RadioControl( value ) }
					/>
					<SecuritySurvey09RadioControl
					  value={ securitySurvey09RadioControl }
					  onChange={ ( value ) => setSecuritySurvey09RadioControl( value ) }
					/>
				</div>
				<AgreementInfo />
				<SaveButton onClick={ saveSettings } />
			</div>
			</>
		);
	} else if ( currentStep === 2 ) {
		return (
			<>
			<PaidyTitle />
			<div className="paidy-on-boarding">
			<ApplyCompletedMessage />
			</div>
			</>
		);
	} else if ( currentStep === 3 && settingPaidy.enabled === true && PaidyEnvironment === 'sandbox' ) {
		return (
			<>
			<PaidyTitle />
			<div className="paidy-on-boarding">
			<SettingSandboxMessage />
			</div>
			</>
		);
	} else if ( currentStep === 3 && settingPaidy.enabled === true && PaidyEnvironment === 'live' ) {
		return (
			<>
			<PaidyTitle />
			<div className="paidy-on-boarding">
			<SettingCompletedMessage />
			</div>
			</>
		);
	} else if ( currentStep === 3 ) {
		return (
			<>
			<PaidyTitle />
			<div className="paidy-on-boarding">
			<ReviewApprovedMessage />
			</div>
			</>
		);
	} else if ( currentStep === 99 ) {
		return (
			<>
			<PaidyTitle />
			<div className="paidy-on-boarding">
			<ReviewRejectedMessage />
			</div>
			</>
		)
	} else {
		return (
			<>
			<SettingsTitle />
			<div className="paidy-on-boarding__description">
				<p>
					{ sprintf( __('Easy PayPay setup now available with %s.', 'paidy-wc'), pluginName ) }<br/>
					{__('Right now, we are offering a one-month trial with no payment fees!', 'paidy-wc')}
				</p>
			</div>
			<div className="paidy-on-boarding">
				<div className="paidy-on-boarding__img">
				<a href={paidyAdUrl} target="_blank" rel="noreferrer">
				<img src="/wp-content/plugins/paidy-wc/assets/images/paidy_logo_w800.png" alt="Paidy" />
				</a>
				</div>
				<div className="paidy-on-boarding__content">
					<ApplyButton onClick={ () => setCurrentStep( 1 ) } />
				</div>
			</div>
			<div className="paidy-on-boarding__description">
				<p className="paidy-on-boarding__description-text">
					♦️{__('What is Paidy?', 'paidy-wc')}<br/>
					✅{__('Paidy is a deferred payment service that can be used without the need for a credit card.', 'paidy-wc')}<br/>
					✅{__('Customers can make purchases with just their mobile phone number and email address.', 'paidy-wc')}<br/>
					✅{__('Payment can be made from the following month onwards via convenience store, bank or direct debit.', 'paidy-wc')}<br/>
					{__('We respond to the desire to "buy now."', 'paidy-wc')} <a href={paidyAdUrl} target="_blank" rel="noreferrer">{__('Learn more about Paidy', 'paidy-wc')}</a><br/>
				</p>
				<p className="paidy-on-boarding__description-text">
					♦️{__('Benefits of implementation (for EC businesses)', 'paidy-wc')}<br/>
					{__('No credit card registration is required, making it easy for new customers to make purchases with confidence.', 'paidy-wc')}<br/>
					{__('Installment payments are also supported, which is expected to increase the success rate of high-priced products.', 'paidy-wc')}<br/>
					({__('*Free installment fees only apply when paying by direct debit or bank transfer. Identity verification and app download required.', 'paidy-wc')})<br/>
					{__('Currently used on over 700,000 websites nationwide, including Amazon. Industry-leading track record.', 'paidy-wc')}<br/>
				</p>
				<p className="paidy-on-boarding__description-text">
					♦️{sprintf( __('%s * Paidy', 'paidy-wc'), pluginName )}<br/>
					{__('With this update, Paidy can now be installed in as little as 30 seconds!', 'paidy-wc')}<br/>
					{__('No initial or monthly fees.', 'paidy-wc')}<br/>
					{__('The review process is completed in as little as 1-2 days, and setup is easy.', 'paidy-wc')}<br/>
				</p>
			</div>
			<div className="paidy-on-boarding_bottom">
				<div>
					<ApplyButton onClick={ () => setCurrentStep( 1 ) } />
				</div>
				<div>
					<a href='/wp-admin/admin.php?page=wc-settings&tab=checkout'>{__('pass this time', 'paidy-wc')}</a>
				</div>
			</div>
			</>
		);
	}
}
export { FirstMainPage };
