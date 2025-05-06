import { __ } from '@wordpress/i18n';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHeading as Heading,
	Button,
} from '@wordpress/components';
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
    SecuritySurvey01CheckControl,
    SecuritySurvey02CheckControl,
    SecuritySurvey03CheckControl,
    SecuritySurvey04CheckControl,
    SecuritySurvey05CheckControl,
    SecuritySurvey06CheckControl,
    SecuritySurvey07CheckControl,
    SecuritySurvey08CheckControl,
    SecuritySurvey09CheckControl,
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
		securitySurvey01CheckControl,
		setSecuritySurvey01CheckControl,
		securitySurvey02CheckControl,
		setSecuritySurvey02CheckControl,
		securitySurvey03CheckControl,
		setSecuritySurvey03CheckControl,
		securitySurvey04CheckControl,
		setSecuritySurvey04CheckControl,
		securitySurvey05CheckControl,
		setSecuritySurvey05CheckControl,
		securitySurvey06CheckControl,
		setSecuritySurvey06CheckControl,
		securitySurvey07CheckControl,
		setSecuritySurvey07CheckControl,
		securitySurvey08CheckControl,
		setSecuritySurvey08CheckControl,
		securitySurvey09CheckControl,
		setSecuritySurvey09CheckControl,
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
				</div>
        		<div className="paidy-security-survey">
					<SecuritySurvey01CheckControl
					  value={ securitySurvey01CheckControl }
					  onChange={ ( value ) => setSecuritySurvey01CheckControl( value ) }
					/>
					<SecuritySurvey02CheckControl
					  value={ securitySurvey02CheckControl }
					  onChange={ ( value ) => setSecuritySurvey02CheckControl( value ) }
					/>
					<SecuritySurvey03CheckControl
					  value={ securitySurvey03CheckControl }
					  onChange={ ( value ) => setSecuritySurvey03CheckControl( value ) }
					/>
					<SecuritySurvey04CheckControl
					  value={ securitySurvey04CheckControl }
					  onChange={ ( value ) => setSecuritySurvey04CheckControl( value ) }
					/>
					<SecuritySurvey05CheckControl
					  value={ securitySurvey05CheckControl }
					  onChange={ ( value ) => setSecuritySurvey05CheckControl( value ) }
					/>
					<SecuritySurvey06CheckControl
					  value={ securitySurvey06CheckControl }
					  onChange={ ( value ) => setSecuritySurvey06CheckControl( value ) }
					/>
					<SecuritySurvey07CheckControl
					  value={ securitySurvey07CheckControl }
					  onChange={ ( value ) => setSecuritySurvey07CheckControl( value ) }
					/>
					<SecuritySurvey08CheckControl
					  value={ securitySurvey08CheckControl }
					  onChange={ ( value ) => setSecuritySurvey08CheckControl( value ) }
					/>
					<SecuritySurvey09CheckControl
					  value={ securitySurvey09CheckControl }
					  onChange={ ( value ) => setSecuritySurvey09CheckControl( value ) }
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
			<div className="paidy-on-boarding">
				<div className="paidy-on-boarding__img">
				<a href="https://paidy.com/merchant/" target="_blank" rel="noreferrer">
				<img src="/wp-content/plugins/paidy-wc/assets/images/paidy_logo_w800.png" alt="Paidy" />
				</a>
				</div>
				<div className="paidy-on-boarding__content">
					<p>{__('Applying for and setting up Paidy is easy.', 'paidy-wc')}</p>
					<ApplyButton onClick={ () => setCurrentStep( 1 ) } />
				</div>
			</div>
			<div className="paidy-on-boarding__description">
				<p>
					{__('Paidy has zero installation costs and payment fees starting from 3.5%.', 'paidy-wc')}
					 <a href="https://paidy.com/merchant/" target="_blank" rel="noreferrer">{__('Learn more about Paidy', 'paidy-wc')}</a>
				</p>
			</div>
			</>
		);
	}
}
export { FirstMainPage };
