/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/components/index.js":
/*!***************************************!*\
  !*** ./src/admin/components/index.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApplyButton: function() { return /* binding */ ApplyButton; },
/* harmony export */   PaidyTitle: function() { return /* binding */ PaidyTitle; },
/* harmony export */   ReviewApprovedMessage: function() { return /* binding */ ReviewApprovedMessage; },
/* harmony export */   ReviewRejectedMessage: function() { return /* binding */ ReviewRejectedMessage; },
/* harmony export */   UnderReviewMessage: function() { return /* binding */ UnderReviewMessage; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);



var PaidyTitle = function PaidyTitle() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
    level: 2
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Easy Paidy payment setup', 'paidy-wc'));
};
var ApplyButton = function ApplyButton(_ref) {
  var onClick = _ref.onClick;
  var handleClick = function handleClick() {
    window.location.href = "/wp-admin/admin.php?page=wc-admin&path=%2Fpaidy-on-boarding";
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    isPrimary: true,
    className: "paidy-setting-step1 paidy-button",
    onClick: handleClick
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Start easy Paidy payment setup', 'paidy-wc'));
};
var UnderReviewMessage = function UnderReviewMessage() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "paidy-completed-message"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
    level: 3
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Status: Under review', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Thank you for your application. We will notify you of the results via email and dashboard.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The review process may take up to 10 business days.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Inquiries regarding screening: sales@paidy.com', 'paidy-wc'))));
};
var ReviewApprovedMessage = function ReviewApprovedMessage() {
  var _window$paidyForWcSet;
  var restUrl = ((_window$paidyForWcSet = window.paidyForWcSettings) === null || _window$paidyForWcSet === void 0 ? void 0 : _window$paidyForWcSet.restUrl) || '';
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "paidy-completed-message"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
    level: 3
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Status: Approved', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The review has been completed and the merchant agreement has been concluded.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('For terms of use, please check the terms and conditions notification email sent by Paidy Inc.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('We recommend setting the Webhook URL in the Paidy merchant management screen before publishing in production mode. Set the Webhook URL to the following value.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('[Common for test and production]', 'paidy-wc'), " ", restUrl, "wp-json/paidy/v1/order/"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please refer to the manual for information on the Paidy merchant management screen.', 'paidy-wc'))));
};
var ReviewRejectedMessage = function ReviewRejectedMessage() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "paidy-completed-message"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
    level: 3
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Status: Rejected', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('After careful and repeated review, we regret to inform you that we have decided to postpone the transaction at this time.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('We sincerely apologize for not being able to meet your expectations.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please understand that we cannot provide details about the content of the review.', 'paidy-wc'))));
};


/***/ }),

/***/ "./src/admin/onboarding-step/index.js":
/*!********************************************!*\
  !*** ./src/admin/onboarding-step/index.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OnBoardingStep: function() { return /* binding */ OnBoardingStep; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components */ "./src/admin/components/index.js");
/* harmony import */ var _main_hooks_form_info__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../main-hooks/form-info */ "./src/main-hooks/form-info.jsx");
/* harmony import */ var _main_hooks_on_boarding_settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../main-hooks/on-boarding-settings */ "./src/main-hooks/on-boarding-settings.js");





var OnBoardingStep = function OnBoardingStep() {
  var _useOnBoardingSetting = (0,_main_hooks_on_boarding_settings__WEBPACK_IMPORTED_MODULE_4__.useOnBoardingSettings)(),
    currentStep = _useOnBoardingSetting.currentStep;
  if (currentStep === 2) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_2__.PaidyTitle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_2__.UnderReviewMessage, null));
  } else if (currentStep === 3) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_2__.PaidyTitle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_main_hooks_form_info__WEBPACK_IMPORTED_MODULE_3__.ReviewApprovedMessage, null));
  } else if (currentStep === 99) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_2__.PaidyTitle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_main_hooks_form_info__WEBPACK_IMPORTED_MODULE_3__.ReviewRejectedMessage, null));
  } else {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_2__.PaidyTitle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components__WEBPACK_IMPORTED_MODULE_2__.ApplyButton, null));
  }
};

/***/ }),

/***/ "./src/main-hooks/form-info.jsx":
/*!**************************************!*\
  !*** ./src/main-hooks/form-info.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AgreementInfo: function() { return /* binding */ AgreementInfo; },
/* harmony export */   ApplyCompletedMessage: function() { return /* binding */ ApplyCompletedMessage; },
/* harmony export */   FlowExplanation: function() { return /* binding */ FlowExplanation; },
/* harmony export */   ReviewApprovedMessage: function() { return /* binding */ ReviewApprovedMessage; },
/* harmony export */   ReviewRejectedMessage: function() { return /* binding */ ReviewRejectedMessage; },
/* harmony export */   SettingCompletedMessage: function() { return /* binding */ SettingCompletedMessage; },
/* harmony export */   SettingSandboxMessage: function() { return /* binding */ SettingSandboxMessage; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/notices */ "@wordpress/notices");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_notices__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_6__);








var FlowExplanation = function FlowExplanation() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalHeading, {
    level: 3
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Application flow', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("ol", {
    className: "paidy-flow"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Please fill in all the fields on this application screen and click the "Agree to the above and apply" button at the bottom of the screen.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Paidy Co., Ltd. will review your application information and may take up to 10 business days.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('The results will be notified via email and dashboard.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('If your application is approved, you will be able to activate Paidy from your dashboard.', 'paidy-wc'), " ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("br", null), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('If your application is rejected, you will not be able to use Paidy.', 'paidy-wc'))));
};
var AgreementInfo = function AgreementInfo() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "paidy-heading"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalHeading, {
    level: 3
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Agreement', 'paidy-wc'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "paidy-agreement"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
    className: "paidy-agreement-text"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Please confirm and agree to the following contents.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("ol", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("a", {
    href: "https://terms.paidy.com/",
    target: "_blank"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Paidy Merchant Terms and Conditions', 'paidy-wc'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Agreement on handling of affiliated store information', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add the notation specified by our company to the notation based on the Specified Commercial Transactions Act.', 'paidy-wc'), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("a", {
    href: "https://merchant-support.paidy.com/hc/ja/articles/16629903258649-%E7%89%B9%E5%95%86%E6%B3%95%E3%81%AB%E5%9F%BA%E3%81%A5%E3%81%8F%E8%A1%A8%E7%A4%BA%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB",
    target: "_blank"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Display sample based on the Specified Commercial Transactions Act', 'paidy-wc'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add the specified notation to the privacy policy page.', 'paidy-wc'), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("a", {
    href: "https://merchant-support.paidy.com/hc/ja/articles/16631714849561-%E3%83%97%E3%83%A9%E3%82%A4%E3%83%90%E3%82%B7%E3%83%BC%E3%83%9D%E3%83%AA%E3%82%B7%E3%83%BC%E3%81%AE%E8%A8%98%E5%85%A5%E4%BE%8B",
    target: "_blank"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Example of a privacy policy', 'paidy-wc'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Paidy Inc. will set up the API key on your e-commerce site via WooCommerce on your behalf.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Our company (Shokunin Kobo LLC) will provide personal information to third parties in the following cases.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('When disclosing personal information for the purposes of merchant membership screening by payment companies, etc.', 'paidy-wc')))));
};
var ApplyCompletedMessage = function ApplyCompletedMessage() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "paidy-completed-message"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalHeading, {
    level: 3
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Status: Under review', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Thank you for your application. We will notify you of the results via email and dashboard.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("ul", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('The review process may take up to 10 business days.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Inquiries regarding screening: sales@paidy.com', 'paidy-wc'))));
};
var ReviewRejectedMessage = function ReviewRejectedMessage() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "paidy-rejected-message"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalHeading, {
    level: 3
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Status: The review was rejected', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("ul", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('After careful and repeated review, we regret to inform you that we have decided to postpone the transaction at this time.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('We sincerely apologize for not being able to meet your expectations.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Please understand that we cannot provide details about the content of the review.', 'paidy-wc'))));
};
var ReviewApprovedMessage = function ReviewApprovedMessage() {
  var _window$paidyForWcSet;
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false),
    _useState2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
    isLoading = _useState2[0],
    setIsLoading = _useState2[1];
  var _useDispatch = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_5__.store),
    createErrorNotice = _useDispatch.createErrorNotice,
    createSuccessNotice = _useDispatch.createSuccessNotice;
  var restUrl = ((_window$paidyForWcSet = window.paidyForWcSettings) === null || _window$paidyForWcSet === void 0 ? void 0 : _window$paidyForWcSet.restUrl) || '';
  var onSavingTestMode = function onSavingTestMode() {
    setIsLoading(true);
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4___default()({
      path: '/wc/v3/payment_gateways/paidy',
      method: 'PUT',
      data: {
        enabled: true,
        settings: {
          environment: 'sandbox'
        }
      }
    }).then(function (response) {
      createSuccessNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Settings saved.', 'paidy-wc'));
      window.location.href = '/wp-admin/admin.php?page=wc-settings&tab=checkout&section=paidy';
    }).catch(function (error) {
      setIsLoading(false);
      createErrorNotice(error.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Error enabling Paidy', 'paidy-wc'), {
        type: 'snackbar',
        isDismissible: true,
        autoDismiss: false
      });
    });
  };
  var onSavingProductionMode = function onSavingProductionMode() {
    setIsLoading(true);
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4___default()({
      path: '/wc/v3/payment_gateways/paidy',
      method: 'PUT',
      data: {
        enabled: true,
        settings: {
          environment: 'live'
        }
      }
    }).then(function (response) {
      window.location.href = '/wp-admin/admin.php?page=wc-settings&tab=checkout&section=paidy';
    }).catch(function (error) {
      setIsLoading(false);
      createErrorNotice(error.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Error enabling Paidy', 'paidy-wc'), {
        type: 'snackbar',
        isDismissible: true,
        autoDismiss: false
      });
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "paidy-approved-message"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalHeading, {
    level: 3
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Status: The review approved', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('The review has been completed and the merchant agreement has been concluded.', 'paidy-wc'), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("br", null), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('For terms of use, please check the terms and conditions notification email sent by Paidy Inc.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("ul", {
    className: "paidy-approved-list"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('We recommend setting the Webhook URL in the Paidy merchant management screen before publishing in production mode. Set the Webhook URL to the following value.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('[Common for test and production]', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, restUrl, "wp-json/paidy/v1/order/"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Please refer to the manual for information on the Paidy merchant management screen.', 'paidy-wc'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "paidy-enabled-button"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Please click one of the buttons below.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    className: "paidy-button test-button",
    isPrimary: true,
    onClick: onSavingTestMode,
    disabled: isLoading
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Enable test mode', 'paidy-wc'), isLoading ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Enabling Paidy...', 'paidy-wc') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Enable Paidy', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    className: "paidy-button production-button",
    isPrimary: true,
    onClick: onSavingProductionMode,
    disabled: isLoading
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Enable production mode', 'paidy-wc'))));
};
var SettingSandboxMessage = function SettingSandboxMessage() {
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false),
    _useState4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState3, 2),
    isLoading = _useState4[0],
    setIsLoading = _useState4[1];
  var _useDispatch2 = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_5__.store),
    createErrorNotice = _useDispatch2.createErrorNotice,
    createSuccessNotice = _useDispatch2.createSuccessNotice;
  var onSavingProductionMode = function onSavingProductionMode() {
    setIsLoading(true);
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4___default()({
      path: '/wc/v3/payment_gateways/paidy',
      method: 'PUT',
      data: {
        enabled: true,
        settings: {
          environment: 'live'
        }
      }
    }).then(function (response) {
      window.location.href = '/wp-admin/admin.php?page=wc-settings&tab=checkout&section=paidy';
    }).catch(function (error) {
      setIsLoading(false);
      createErrorNotice(error.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Error enabling Paidy', 'paidy-wc'), {
        type: 'snackbar',
        isDismissible: true,
        autoDismiss: false
      });
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "paidy-setting-sandbox-message"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalHeading, {
    level: 3
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Paidy test payments enabled', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('You can now test Paidy payments.', 'paidy-wc'), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("br", null), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Please check the test payment flow.', 'paidy-wc'), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("a", {
    href: "https://paidy.com/docs/jp/testing.html",
    target: "_blank"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Paidy test payment flow', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("br", null), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('After confirming the test payment, please switch to production mode.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    className: "paidy-button production-button",
    isPrimary: true,
    onClick: onSavingProductionMode,
    disabled: isLoading
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Enable production mode', 'paidy-wc')));
};
var SettingCompletedMessage = function SettingCompletedMessage() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "paidy-setting-completed-message"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalHeading, {
    level: 3
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Paidy Payments is now live', 'paidy-wc')));
};


/***/ }),

/***/ "./src/main-hooks/on-boarding-settings.js":
/*!************************************************!*\
  !*** ./src/main-hooks/on-boarding-settings.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useOnBoardingSettings: function() { return /* binding */ useOnBoardingSettings; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/notices */ "@wordpress/notices");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_notices__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);






var useOnBoardingSettings = function useOnBoardingSettings() {
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(),
    _useState2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
    currentStep = _useState2[0],
    setCurrentStep = _useState2[1];
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(),
    _useState4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState3, 2),
    storeName = _useState4[0],
    setStoreName = _useState4[1];
  var _useState5 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(),
    _useState6 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState5, 2),
    siteName = _useState6[0],
    setSiteName = _useState6[1];
  var _useState7 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(),
    _useState8 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState7, 2),
    storeUrl = _useState8[0],
    setStoreUrl = _useState8[1];
  var _useState9 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(),
    _useState10 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState9, 2),
    registEmail = _useState10[0],
    setRegistEmail = _useState10[1];
  var _useState11 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(),
    _useState12 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState11, 2),
    contactPhone = _useState12[0],
    setContactPhone = _useState12[1];
  var _useState13 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(),
    _useState14 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState13, 2),
    representativeLastName = _useState14[0],
    setRepesentativeLastName = _useState14[1];
  var _useState15 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(),
    _useState16 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState15, 2),
    representativeFirstName = _useState16[0],
    setRepresentativeFirstName = _useState16[1];
  var _useState17 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(),
    _useState18 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState17, 2),
    representativeLastNameKana = _useState18[0],
    setRepresentativeLastNameKana = _useState18[1];
  var _useState19 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(),
    _useState20 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState19, 2),
    representativeFirstNameKana = _useState20[0],
    setRepresentativeFirstNameKana = _useState20[1];
  var _useState21 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(),
    _useState22 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState21, 2),
    representativeDateOfBirth = _useState22[0],
    setRepresentativeDateOfBirth = _useState22[1];
  var _useState23 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(),
    _useState24 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState23, 2),
    annualGrossValue = _useState24[0],
    setAnnualGrossValue = _useState24[1];
  var _useState25 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(),
    _useState26 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState25, 2),
    averagePurchaseAmount = _useState26[0],
    setAveragePurchaseAmount = _useState26[1];
  var _useState27 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false),
    _useState28 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState27, 2),
    securitySurvey01CheckControl = _useState28[0],
    setSecuritySurvey01CheckControl = _useState28[1];
  var _useState29 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false),
    _useState30 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState29, 2),
    securitySurvey02CheckControl = _useState30[0],
    setSecuritySurvey02CheckControl = _useState30[1];
  var _useState31 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false),
    _useState32 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState31, 2),
    securitySurvey03CheckControl = _useState32[0],
    setSecuritySurvey03CheckControl = _useState32[1];
  var _useState33 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false),
    _useState34 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState33, 2),
    securitySurvey04CheckControl = _useState34[0],
    setSecuritySurvey04CheckControl = _useState34[1];
  var _useState35 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false),
    _useState36 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState35, 2),
    securitySurvey05CheckControl = _useState36[0],
    setSecuritySurvey05CheckControl = _useState36[1];
  var _useState37 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false),
    _useState38 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState37, 2),
    securitySurvey06CheckControl = _useState38[0],
    setSecuritySurvey06CheckControl = _useState38[1];
  var _useState39 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false),
    _useState40 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState39, 2),
    securitySurvey07CheckControl = _useState40[0],
    setSecuritySurvey07CheckControl = _useState40[1];
  var _useState41 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false),
    _useState42 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState41, 2),
    securitySurvey08CheckControl = _useState42[0],
    setSecuritySurvey08CheckControl = _useState42[1];
  var _useState43 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false),
    _useState44 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState43, 2),
    securitySurvey09CheckControl = _useState44[0],
    setSecuritySurvey09CheckControl = _useState44[1];
  var _useDispatch = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_3__.store),
    createErrorNotice = _useDispatch.createErrorNotice,
    createSuccessNotice = _useDispatch.createSuccessNotice;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(function () {
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
      path: '/wp/v2/settings'
    }).then(function (settings) {
      setCurrentStep(settings.woocommerce_paidy_on_boarding_settings.currentStep);
      setStoreName(settings.woocommerce_paidy_on_boarding_settings.storeName);
      setSiteName(settings.woocommerce_paidy_on_boarding_settings.siteName);
      setStoreUrl(settings.woocommerce_paidy_on_boarding_settings.storeUrl);
      setRegistEmail(settings.woocommerce_paidy_on_boarding_settings.registEmail);
      setContactPhone(settings.woocommerce_paidy_on_boarding_settings.contactPhone);
      setRepesentativeLastName(settings.woocommerce_paidy_on_boarding_settings.representativeLastName);
      setRepresentativeFirstName(settings.woocommerce_paidy_on_boarding_settings.representativeFirstName);
      setRepresentativeLastNameKana(settings.woocommerce_paidy_on_boarding_settings.representativeLastNameKana);
      setRepresentativeFirstNameKana(settings.woocommerce_paidy_on_boarding_settings.representativeFirstNameKana);
      setRepresentativeDateOfBirth(settings.woocommerce_paidy_on_boarding_settings.representativeDateOfBirth);
      setAnnualGrossValue(settings.woocommerce_paidy_on_boarding_settings.annualGrossValue);
      setAveragePurchaseAmount(settings.woocommerce_paidy_on_boarding_settings.averagePurchaseAmount);
      setSecuritySurvey01CheckControl(settings.woocommerce_paidy_on_boarding_settings.securitySurvey01CheckControl);
      setSecuritySurvey02CheckControl(settings.woocommerce_paidy_on_boarding_settings.securitySurvey02CheckControl);
      setSecuritySurvey03CheckControl(settings.woocommerce_paidy_on_boarding_settings.securitySurvey03CheckControl);
      setSecuritySurvey04CheckControl(settings.woocommerce_paidy_on_boarding_settings.securitySurvey04CheckControl);
      setSecuritySurvey05CheckControl(settings.woocommerce_paidy_on_boarding_settings.securitySurvey05CheckControl);
      setSecuritySurvey06CheckControl(settings.woocommerce_paidy_on_boarding_settings.securitySurvey06CheckControl);
      setSecuritySurvey07CheckControl(settings.woocommerce_paidy_on_boarding_settings.securitySurvey07CheckControl);
      setSecuritySurvey08CheckControl(settings.woocommerce_paidy_on_boarding_settings.securitySurvey08CheckControl);
      setSecuritySurvey09CheckControl(settings.woocommerce_paidy_on_boarding_settings.securitySurvey09CheckControl);
    });
  }, []);
  var saveSettings = function saveSettings() {
    var requiredFlag = false;
    var requiredFields = [{
      value: storeName,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Trade name / Store name', 'paidy-wc')
    }, {
      value: siteName,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your EC site name', 'paidy-wc')
    }, {
      value: storeUrl,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Store URL', 'paidy-wc')
    }, {
      value: registEmail,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Email address for registering Paidy', 'paidy-wc')
    }, {
      value: contactPhone,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Contact phone number', 'paidy-wc')
    }, {
      value: representativeLastName,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Representative (last name)', 'paidy-wc')
    }, {
      value: representativeFirstName,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Representative (first name)', 'paidy-wc')
    }, {
      value: representativeLastNameKana,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Representative (last name kana)', 'paidy-wc')
    }, {
      value: representativeFirstNameKana,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Representative (first name kana)', 'paidy-wc')
    }, {
      value: representativeDateOfBirth,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Representative\'s date of birth (Gregorian calendar)', 'paidy-wc')
    }];
    requiredFields.forEach(function (field) {
      if (!field.value) {
        createErrorNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('%s is a required field. Please enter it.', 'paidy-wc').replace('%s', field.label), {
          type: 'snackbar',
          isDismissible: true,
          autoDismiss: false
        });
        requiredFlag = true;
      }
    });
    var kanaFlag = false;
    var fullWidthKatakanaRegex = /^[ァ-ヶー]+$/;
    var requiredKanaFields = [{
      value: representativeLastNameKana,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Representative (last name kana)', 'paidy-wc')
    }, {
      value: representativeFirstNameKana,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Representative (first name kana)', 'paidy-wc')
    }];
    requiredKanaFields.forEach(function (field) {
      if (!fullWidthKatakanaRegex.test(field.value)) {
        createErrorNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('%s must be in full-width katakana. Please confirm.', 'paidy-wc').replace('%s', field.label), {
          type: 'snackbar',
          isDismissible: true,
          autoDismiss: false
        });
        kanaFlag = true;
      }
    });
    if (requiredFlag) {
      createErrorNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please fill in all the fields.', 'paidy-wc'), {
        type: 'snackbar',
        isDismissible: true,
        autoDismiss: false
      });
      return;
    }
    if (kanaFlag) {
      return;
    }
    setCurrentStep(currentStep + 1);
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
      path: '/wp/v2/settings',
      method: 'POST',
      data: {
        woocommerce_paidy_on_boarding_settings: {
          currentStep: currentStep,
          storeName: storeName,
          siteName: siteName,
          storeUrl: storeUrl,
          registEmail: registEmail,
          contactPhone: contactPhone,
          representativeLastName: representativeLastName,
          representativeFirstName: representativeFirstName,
          representativeLastNameKana: representativeLastNameKana,
          representativeFirstNameKana: representativeFirstNameKana,
          representativeDateOfBirth: representativeDateOfBirth,
          annualGrossValue: annualGrossValue,
          averagePurchaseAmount: averagePurchaseAmount,
          securitySurvey01CheckControl: securitySurvey01CheckControl,
          securitySurvey02CheckControl: securitySurvey02CheckControl,
          securitySurvey03CheckControl: securitySurvey03CheckControl,
          securitySurvey04CheckControl: securitySurvey04CheckControl,
          securitySurvey05CheckControl: securitySurvey05CheckControl,
          securitySurvey06CheckControl: securitySurvey06CheckControl,
          securitySurvey07CheckControl: securitySurvey07CheckControl,
          securitySurvey08CheckControl: securitySurvey08CheckControl,
          securitySurvey09CheckControl: securitySurvey09CheckControl
        }
      }
    }).then(function () {
      createSuccessNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings saved.', 'paidy-wc'));
    });
  };
  return {
    currentStep: currentStep,
    setCurrentStep: setCurrentStep,
    storeName: storeName,
    setStoreName: setStoreName,
    siteName: siteName,
    setSiteName: setSiteName,
    storeUrl: storeUrl,
    setStoreUrl: setStoreUrl,
    registEmail: registEmail,
    setRegistEmail: setRegistEmail,
    contactPhone: contactPhone,
    setContactPhone: setContactPhone,
    representativeLastName: representativeLastName,
    setRepesentativeLastName: setRepesentativeLastName,
    representativeFirstName: representativeFirstName,
    setRepresentativeFirstName: setRepresentativeFirstName,
    representativeLastNameKana: representativeLastNameKana,
    setRepresentativeLastNameKana: setRepresentativeLastNameKana,
    representativeFirstNameKana: representativeFirstNameKana,
    setRepresentativeFirstNameKana: setRepresentativeFirstNameKana,
    representativeDateOfBirth: representativeDateOfBirth,
    setRepresentativeDateOfBirth: setRepresentativeDateOfBirth,
    annualGrossValue: annualGrossValue,
    setAnnualGrossValue: setAnnualGrossValue,
    averagePurchaseAmount: averagePurchaseAmount,
    setAveragePurchaseAmount: setAveragePurchaseAmount,
    securitySurvey01CheckControl: securitySurvey01CheckControl,
    setSecuritySurvey01CheckControl: setSecuritySurvey01CheckControl,
    securitySurvey02CheckControl: securitySurvey02CheckControl,
    setSecuritySurvey02CheckControl: setSecuritySurvey02CheckControl,
    securitySurvey03CheckControl: securitySurvey03CheckControl,
    setSecuritySurvey03CheckControl: setSecuritySurvey03CheckControl,
    securitySurvey04CheckControl: securitySurvey04CheckControl,
    setSecuritySurvey04CheckControl: setSecuritySurvey04CheckControl,
    securitySurvey05CheckControl: securitySurvey05CheckControl,
    setSecuritySurvey05CheckControl: setSecuritySurvey05CheckControl,
    securitySurvey06CheckControl: securitySurvey06CheckControl,
    setSecuritySurvey06CheckControl: setSecuritySurvey06CheckControl,
    securitySurvey07CheckControl: securitySurvey07CheckControl,
    setSecuritySurvey07CheckControl: setSecuritySurvey07CheckControl,
    securitySurvey08CheckControl: securitySurvey08CheckControl,
    setSecuritySurvey08CheckControl: setSecuritySurvey08CheckControl,
    securitySurvey09CheckControl: securitySurvey09CheckControl,
    setSecuritySurvey09CheckControl: setSecuritySurvey09CheckControl,
    saveSettings: saveSettings
  };
};


/***/ }),

/***/ "./src/admin/index.scss":
/*!******************************!*\
  !*** ./src/admin/index.scss ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ (function(module) {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/dom-ready":
/*!**********************************!*\
  !*** external ["wp","domReady"] ***!
  \**********************************/
/***/ (function(module) {

module.exports = window["wp"]["domReady"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/notices":
/*!*********************************!*\
  !*** external ["wp","notices"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["notices"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayLikeToArray; }
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithHoles; }
/* harmony export */ });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArrayLimit; }
/* harmony export */ });
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableRest; }
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _slicedToArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _slicedToArray(arr, i) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr, i) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr, i) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _unsupportedIterableToArray; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
!function() {
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/dom-ready */ "@wordpress/dom-ready");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _onboarding_step__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./onboarding-step */ "./src/admin/onboarding-step/index.js");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index.scss */ "./src/admin/index.scss");





_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1___default()(function () {
  var root = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(document.getElementById('paidy-admin-settings'));
  root.render((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_onboarding_step__WEBPACK_IMPORTED_MODULE_2__.OnBoardingStep, null));
});
}();
/******/ })()
;
//# sourceMappingURL=paidy.js.map