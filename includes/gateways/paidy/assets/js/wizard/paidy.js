/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "./src/main-hooks/use-paidy-settings.jsx":
/*!***********************************************!*\
  !*** ./src/main-hooks/use-paidy-settings.jsx ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   usePaidySettings: function() { return /* binding */ usePaidySettings; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);



var usePaidySettings = function usePaidySettings() {
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(),
    _useState2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
    settingPaidy = _useState2[0],
    setSettingPaidy = _useState2[1];
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(),
    _useState4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState3, 2),
    errorMessage = _useState4[0],
    setErrorMessage = _useState4[1];
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
      path: '/wc/v3/payment_gateways/paidy'
    }).then(function (data) {
      setSettingPaidy(data);
    }).catch(function (err) {
      setErrorMessage(err.message);
    });
  });
  return {
    settingPaidy: settingPaidy,
    setSettingPaidy: setSettingPaidy,
    errorMessage: errorMessage
  };
};


/***/ }),

/***/ "./src/wizard/components/controls.jsx":
/*!********************************************!*\
  !*** ./src/wizard/components/controls.jsx ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnnualGrossValueRadioControl: function() { return /* binding */ AnnualGrossValueRadioControl; },
/* harmony export */   AveragePurchaseAmountRadioControl: function() { return /* binding */ AveragePurchaseAmountRadioControl; },
/* harmony export */   ContactPhoneTextControl: function() { return /* binding */ ContactPhoneTextControl; },
/* harmony export */   RegistEmailTextControl: function() { return /* binding */ RegistEmailTextControl; },
/* harmony export */   RepresentativeDateOfBirthTextControl: function() { return /* binding */ RepresentativeDateOfBirthTextControl; },
/* harmony export */   RepresentativeFirstNameKanaTextControl: function() { return /* binding */ RepresentativeFirstNameKanaTextControl; },
/* harmony export */   RepresentativeFirstNameTextControl: function() { return /* binding */ RepresentativeFirstNameTextControl; },
/* harmony export */   RepresentativeLastNameKanaTextControl: function() { return /* binding */ RepresentativeLastNameKanaTextControl; },
/* harmony export */   RepresentativeLastNameTextControl: function() { return /* binding */ RepresentativeLastNameTextControl; },
/* harmony export */   SecuritySurvey01CheckControl: function() { return /* binding */ SecuritySurvey01CheckControl; },
/* harmony export */   SecuritySurvey02CheckControl: function() { return /* binding */ SecuritySurvey02CheckControl; },
/* harmony export */   SecuritySurvey03CheckControl: function() { return /* binding */ SecuritySurvey03CheckControl; },
/* harmony export */   SecuritySurvey04CheckControl: function() { return /* binding */ SecuritySurvey04CheckControl; },
/* harmony export */   SecuritySurvey05CheckControl: function() { return /* binding */ SecuritySurvey05CheckControl; },
/* harmony export */   SecuritySurvey06CheckControl: function() { return /* binding */ SecuritySurvey06CheckControl; },
/* harmony export */   SecuritySurvey07CheckControl: function() { return /* binding */ SecuritySurvey07CheckControl; },
/* harmony export */   SecuritySurvey08CheckControl: function() { return /* binding */ SecuritySurvey08CheckControl; },
/* harmony export */   SecuritySurvey09CheckControl: function() { return /* binding */ SecuritySurvey09CheckControl; },
/* harmony export */   SiteNameTextControl: function() { return /* binding */ SiteNameTextControl; },
/* harmony export */   StoreNameTextControl: function() { return /* binding */ StoreNameTextControl; },
/* harmony export */   StoreUrlTextControl: function() { return /* binding */ StoreUrlTextControl; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);



var StoreNameTextControl = function StoreNameTextControl(_ref) {
  var value = _ref.value,
    onChange = _ref.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Trade name / Store name', 'paidy-wc'),
    className: "paidy-store-name",
    type: "text",
    onChange: onChange,
    value: value
  });
};
var SiteNameTextControl = function SiteNameTextControl(_ref2) {
  var value = _ref2.value,
    onChange = _ref2.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your EC site name', 'paidy-wc'),
    className: "paidy-site-name",
    type: "text",
    onChange: onChange,
    value: value
  });
};
var StoreUrlTextControl = function StoreUrlTextControl(_ref3) {
  var value = _ref3.value,
    onChange = _ref3.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Store URL', 'paidy-wc'),
    value: value,
    onChange: onChange
  });
};
var RegistEmailTextControl = function RegistEmailTextControl(_ref4) {
  var value = _ref4.value,
    onChange = _ref4.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Email address for registering Paidy', 'paidy-wc'),
    value: value,
    onChange: onChange
  });
};
var ContactPhoneTextControl = function ContactPhoneTextControl(_ref5) {
  var value = _ref5.value,
    onChange = _ref5.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Contact phone number', 'paidy-wc'),
    type: "tel",
    onChange: onChange,
    value: value
  });
};
var RepresentativeLastNameTextControl = function RepresentativeLastNameTextControl(_ref6) {
  var value = _ref6.value,
    onChange = _ref6.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Representative (last name)', 'paidy-wc'),
    onChange: onChange,
    value: value
  });
};
var RepresentativeFirstNameTextControl = function RepresentativeFirstNameTextControl(_ref7) {
  var value = _ref7.value,
    onChange = _ref7.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Representative (first name)', 'paidy-wc'),
    onChange: onChange,
    value: value
  });
};
var RepresentativeLastNameKanaTextControl = function RepresentativeLastNameKanaTextControl(_ref8) {
  var value = _ref8.value,
    onChange = _ref8.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Representative (last name kana)', 'paidy-wc'),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please enter in full-width katakana.', 'paidy-wc'),
    value: value,
    onChange: onChange
  });
};
var RepresentativeFirstNameKanaTextControl = function RepresentativeFirstNameKanaTextControl(_ref9) {
  var value = _ref9.value,
    onChange = _ref9.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Representative (first name kana)', 'paidy-wc'),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please enter in full-width katakana.', 'paidy-wc'),
    value: value,
    onChange: onChange
  });
};
var RepresentativeDateOfBirthTextControl = function RepresentativeDateOfBirthTextControl(_ref10) {
  var value = _ref10.value,
    onChange = _ref10.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Representative\'s date of birth (Gregorian calendar)', 'paidy-wc'),
    value: value,
    type: "date",
    onChange: onChange
  });
};
var AnnualGrossValueRadioControl = function AnnualGrossValueRadioControl(_ref11) {
  var value = _ref11.value,
    onChange = _ref11.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RadioControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Annual gross merchandise value', 'paidy-wc'),
    selected: value,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Less than 10 million yen', 'paidy-wc'),
      value: 'less-than-10-million-yen'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('10 million yen or more', 'paidy-wc'),
      value: '10-million-yen-or-more'
    }],
    onChange: onChange
  });
};
var AveragePurchaseAmountRadioControl = function AveragePurchaseAmountRadioControl(_ref12) {
  var value = _ref12.value,
    onChange = _ref12.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RadioControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Average purchase amount per order', 'paidy-wc'),
    selected: value,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Less than 50,000 yen', 'paidy-wc'),
      value: 'less-than-50000-yen'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Over 50,000 yen', 'paidy-wc'),
      value: '50000-yen-or-more'
    }],
    onChange: onChange
  });
};
var SecuritySurvey01CheckControl = function SecuritySurvey01CheckControl(_ref13) {
  var value = _ref13.value,
    onChange = _ref13.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('To access (log in to) the cart system management screen, you must enter a password.', 'paidy-wc'),
    checked: value,
    onChange: onChange
  });
};
var SecuritySurvey02CheckControl = function SecuritySurvey02CheckControl(_ref14) {
  var value = _ref14.value,
    onChange = _ref14.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The cart system\'s management screen allows for login restrictions using ID and password, as well as access restrictions.', 'paidy-wc'),
    checked: value,
    onChange: onChange
  });
};
var SecuritySurvey03CheckControl = function SecuritySurvey03CheckControl(_ref15) {
  var value = _ref15.value,
    onChange = _ref15.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Regarding access restrictions to the administration screen, one of the following measures can be taken.', 'paidy-wc'),
    checked: value,
    onChange: onChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Administrators can restrict the IP addresses that can access the system.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('It is possible to set access restrictions such as basic authentication in the administration screen.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('This is handled in other ways.', 'paidy-wc'))));
};
var SecuritySurvey04CheckControl = function SecuritySurvey04CheckControl(_ref16) {
  var value = _ref16.value,
    onChange = _ref16.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The settings for data directory* disclosure are configured in one of the following ways:', 'paidy-wc'),
    checked: value,
    onChange: onChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Make certain directories private so that important files cannot be placed in the public directory.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Take care to place important files outside of public directories.', 'paidy-wc'))));
};
var SecuritySurvey05CheckControl = function SecuritySurvey05CheckControl(_ref17) {
  var value = _ref17.value,
    onChange = _ref17.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings are made to restrict the extensions and files that can be uploaded by the web server or web application.', 'paidy-wc'),
    checked: value,
    onChange: onChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('This is handled in other ways.', 'paidy-wc'))));
};
var SecuritySurvey06CheckControl = function SecuritySurvey06CheckControl(_ref18) {
  var value = _ref18.value,
    onChange = _ref18.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Vulnerability assessments or penetration tests* are conducted regularly (once a year or when the system is changed).', 'paidy-wc'),
    checked: value,
    onChange: onChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Vulnerability assessments or penetration tests are conducted on a regular basis, and any necessary corrective actions are taken.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('To counter SQL injection and cross-site scripting vulnerabilities, we are using plugins that do not have the vulnerabilities and upgrading our software.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('When developing or customizing a web application, we conduct a source code review to confirm that it is securely coded. At that time, we also check the input values of input forms.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('This is handled in other ways.', 'paidy-wc'))));
};
var SecuritySurvey07CheckControl = function SecuritySurvey07CheckControl(_ref19) {
  var value = _ref19.value,
    onChange = _ref19.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Anti-virus software is introduced and operated as a measure against malware using the following methods.', 'paidy-wc'),
    checked: value,
    onChange: onChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('We have introduced antivirus software as a measure to detect and remove malware, and we update signatures and perform regular full scans.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('This is handled in other ways.', 'paidy-wc'))));
};
var SecuritySurvey08CheckControl = function SecuritySurvey08CheckControl(_ref20) {
  var value = _ref20.value,
    onChange = _ref20.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('We have not received any disciplinary action under the Act on Specified Commercial Transactions in the past five years.', 'paidy-wc'),
    checked: value,
    onChange: onChange
  });
};
var SecuritySurvey09CheckControl = function SecuritySurvey09CheckControl(_ref21) {
  var value = _ref21.value,
    onChange = _ref21.onChange;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('In the last five years, we have not been the subject of a civil lawsuit for violating the Consumer Contract Act and have not lost the case.', 'paidy-wc'),
    checked: value,
    onChange: onChange
  });
};


/***/ }),

/***/ "./src/wizard/components/first-main-page.jsx":
/*!***************************************************!*\
  !*** ./src/wizard/components/first-main-page.jsx ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FirstMainPage: function() { return /* binding */ FirstMainPage; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _main_hooks_on_boarding_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../main-hooks/on-boarding-settings */ "./src/main-hooks/on-boarding-settings.js");
/* harmony import */ var _main_hooks_use_paidy_settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../main-hooks/use-paidy-settings */ "./src/main-hooks/use-paidy-settings.jsx");
/* harmony import */ var _main_hooks_form_info__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../main-hooks/form-info */ "./src/main-hooks/form-info.jsx");
/* harmony import */ var _controls__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./controls */ "./src/wizard/components/controls.jsx");







var SettingsTitle = function SettingsTitle() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
    level: 1
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Easy setup for Paidy payment', 'paidy-wc'));
};
var PaidyTitle = function PaidyTitle() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
    level: 2
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Paidy application', 'paidy-wc'));
};
var ApplyButton = function ApplyButton(_ref) {
  var onClick = _ref.onClick;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    isPrimary: true,
    className: "paidy-go-apply paidy-button",
    onClick: onClick
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get started now', 'paidy-wc'));
};
var SaveButton = function SaveButton(_ref2) {
  var onClick = _ref2.onClick;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "paidy-save"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    isPrimary: true,
    className: "paidy-save paidy-button",
    onClick: onClick
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('I agree to the above and apply', 'paidy-wc')));
};
var FirstMainPage = function FirstMainPage() {
  var _settingPaidy$setting;
  var _useOnBoardingSetting = (0,_main_hooks_on_boarding_settings__WEBPACK_IMPORTED_MODULE_3__.useOnBoardingSettings)(),
    currentStep = _useOnBoardingSetting.currentStep,
    setCurrentStep = _useOnBoardingSetting.setCurrentStep,
    storeName = _useOnBoardingSetting.storeName,
    setStoreName = _useOnBoardingSetting.setStoreName,
    siteName = _useOnBoardingSetting.siteName,
    setSiteName = _useOnBoardingSetting.setSiteName,
    storeUrl = _useOnBoardingSetting.storeUrl,
    setStoreUrl = _useOnBoardingSetting.setStoreUrl,
    registEmail = _useOnBoardingSetting.registEmail,
    setRegistEmail = _useOnBoardingSetting.setRegistEmail,
    contactPhone = _useOnBoardingSetting.contactPhone,
    setContactPhone = _useOnBoardingSetting.setContactPhone,
    representativeLastName = _useOnBoardingSetting.representativeLastName,
    setRepesentativeLastName = _useOnBoardingSetting.setRepesentativeLastName,
    representativeFirstName = _useOnBoardingSetting.representativeFirstName,
    setRepresentativeFirstName = _useOnBoardingSetting.setRepresentativeFirstName,
    representativeLastNameKana = _useOnBoardingSetting.representativeLastNameKana,
    setRepresentativeLastNameKana = _useOnBoardingSetting.setRepresentativeLastNameKana,
    representativeFirstNameKana = _useOnBoardingSetting.representativeFirstNameKana,
    setRepresentativeFirstNameKana = _useOnBoardingSetting.setRepresentativeFirstNameKana,
    representativeDateOfBirth = _useOnBoardingSetting.representativeDateOfBirth,
    setRepresentativeDateOfBirth = _useOnBoardingSetting.setRepresentativeDateOfBirth,
    annualGrossValue = _useOnBoardingSetting.annualGrossValue,
    setAnnualGrossValue = _useOnBoardingSetting.setAnnualGrossValue,
    averagePurchaseAmount = _useOnBoardingSetting.averagePurchaseAmount,
    setAveragePurchaseAmount = _useOnBoardingSetting.setAveragePurchaseAmount,
    securitySurvey01CheckControl = _useOnBoardingSetting.securitySurvey01CheckControl,
    setSecuritySurvey01CheckControl = _useOnBoardingSetting.setSecuritySurvey01CheckControl,
    securitySurvey02CheckControl = _useOnBoardingSetting.securitySurvey02CheckControl,
    setSecuritySurvey02CheckControl = _useOnBoardingSetting.setSecuritySurvey02CheckControl,
    securitySurvey03CheckControl = _useOnBoardingSetting.securitySurvey03CheckControl,
    setSecuritySurvey03CheckControl = _useOnBoardingSetting.setSecuritySurvey03CheckControl,
    securitySurvey04CheckControl = _useOnBoardingSetting.securitySurvey04CheckControl,
    setSecuritySurvey04CheckControl = _useOnBoardingSetting.setSecuritySurvey04CheckControl,
    securitySurvey05CheckControl = _useOnBoardingSetting.securitySurvey05CheckControl,
    setSecuritySurvey05CheckControl = _useOnBoardingSetting.setSecuritySurvey05CheckControl,
    securitySurvey06CheckControl = _useOnBoardingSetting.securitySurvey06CheckControl,
    setSecuritySurvey06CheckControl = _useOnBoardingSetting.setSecuritySurvey06CheckControl,
    securitySurvey07CheckControl = _useOnBoardingSetting.securitySurvey07CheckControl,
    setSecuritySurvey07CheckControl = _useOnBoardingSetting.setSecuritySurvey07CheckControl,
    securitySurvey08CheckControl = _useOnBoardingSetting.securitySurvey08CheckControl,
    setSecuritySurvey08CheckControl = _useOnBoardingSetting.setSecuritySurvey08CheckControl,
    securitySurvey09CheckControl = _useOnBoardingSetting.securitySurvey09CheckControl,
    setSecuritySurvey09CheckControl = _useOnBoardingSetting.setSecuritySurvey09CheckControl,
    saveSettings = _useOnBoardingSetting.saveSettings;
  var _usePaidySettings = (0,_main_hooks_use_paidy_settings__WEBPACK_IMPORTED_MODULE_4__.usePaidySettings)(),
    settingPaidy = _usePaidySettings.settingPaidy,
    setSettingPaidy = _usePaidySettings.setSettingPaidy,
    errorMessage = _usePaidySettings.errorMessage;
  if (errorMessage) {
    console.debug(errorMessage);
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, "loading...");
  }
  var PaidyEnvironment = (settingPaidy === null || settingPaidy === void 0 || (_settingPaidy$setting = settingPaidy.settings) === null || _settingPaidy$setting === void 0 || (_settingPaidy$setting = _settingPaidy$setting.environment) === null || _settingPaidy$setting === void 0 ? void 0 : _settingPaidy$setting.value) || [];
  if (currentStep === 1) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(PaidyTitle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      id: "paidy-on-boarding",
      className: "paidy-on-boarding"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_main_hooks_form_info__WEBPACK_IMPORTED_MODULE_5__.FlowExplanation, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "paidy-heading"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 3
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Basic information', 'paidy-wc'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "paidy-basic-info"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.StoreNameTextControl, {
      value: storeName,
      onChange: function onChange(value) {
        return setStoreName(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.SiteNameTextControl, {
      value: siteName,
      onChange: function onChange(value) {
        return setSiteName(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.StoreUrlTextControl, {
      value: storeUrl,
      onChange: function onChange(value) {
        return setStoreUrl(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.RegistEmailTextControl, {
      value: registEmail,
      onChange: function onChange(value) {
        return setRegistEmail(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.ContactPhoneTextControl, {
      value: contactPhone,
      onChange: function onChange(value) {
        return setContactPhone(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.RepresentativeLastNameTextControl, {
      value: representativeLastName,
      onChange: function onChange(value) {
        return setRepesentativeLastName(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.RepresentativeFirstNameTextControl, {
      value: representativeFirstName,
      onChange: function onChange(value) {
        return setRepresentativeFirstName(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.RepresentativeLastNameKanaTextControl, {
      value: representativeLastNameKana,
      onChange: function onChange(value) {
        return setRepresentativeLastNameKana(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.RepresentativeFirstNameKanaTextControl, {
      value: representativeFirstNameKana,
      onChange: function onChange(value) {
        return setRepresentativeFirstNameKana(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.RepresentativeDateOfBirthTextControl, {
      value: representativeDateOfBirth,
      onChange: function onChange(value) {
        return setRepresentativeDateOfBirth(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.AnnualGrossValueRadioControl, {
      value: annualGrossValue,
      onChange: function onChange(value) {
        return setAnnualGrossValue(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.AveragePurchaseAmountRadioControl, {
      value: averagePurchaseAmount,
      onChange: function onChange(value) {
        return setAveragePurchaseAmount(value);
      }
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "paidy-heading"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
      level: 3
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Security survey', 'paidy-wc'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "paidy-security-survey"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.SecuritySurvey01CheckControl, {
      value: securitySurvey01CheckControl,
      onChange: function onChange(value) {
        return setSecuritySurvey01CheckControl(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.SecuritySurvey02CheckControl, {
      value: securitySurvey02CheckControl,
      onChange: function onChange(value) {
        return setSecuritySurvey02CheckControl(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.SecuritySurvey03CheckControl, {
      value: securitySurvey03CheckControl,
      onChange: function onChange(value) {
        return setSecuritySurvey03CheckControl(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.SecuritySurvey04CheckControl, {
      value: securitySurvey04CheckControl,
      onChange: function onChange(value) {
        return setSecuritySurvey04CheckControl(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.SecuritySurvey05CheckControl, {
      value: securitySurvey05CheckControl,
      onChange: function onChange(value) {
        return setSecuritySurvey05CheckControl(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.SecuritySurvey06CheckControl, {
      value: securitySurvey06CheckControl,
      onChange: function onChange(value) {
        return setSecuritySurvey06CheckControl(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.SecuritySurvey07CheckControl, {
      value: securitySurvey07CheckControl,
      onChange: function onChange(value) {
        return setSecuritySurvey07CheckControl(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.SecuritySurvey08CheckControl, {
      value: securitySurvey08CheckControl,
      onChange: function onChange(value) {
        return setSecuritySurvey08CheckControl(value);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_controls__WEBPACK_IMPORTED_MODULE_6__.SecuritySurvey09CheckControl, {
      value: securitySurvey09CheckControl,
      onChange: function onChange(value) {
        return setSecuritySurvey09CheckControl(value);
      }
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_main_hooks_form_info__WEBPACK_IMPORTED_MODULE_5__.AgreementInfo, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SaveButton, {
      onClick: saveSettings
    })));
  } else if (currentStep === 2) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(PaidyTitle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "paidy-on-boarding"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_main_hooks_form_info__WEBPACK_IMPORTED_MODULE_5__.ApplyCompletedMessage, null)));
  } else if (currentStep === 3 && settingPaidy.enabled === true && PaidyEnvironment === 'sandbox') {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(PaidyTitle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "paidy-on-boarding"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_main_hooks_form_info__WEBPACK_IMPORTED_MODULE_5__.SettingSandboxMessage, null)));
  } else if (currentStep === 3 && settingPaidy.enabled === true && PaidyEnvironment === 'live') {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(PaidyTitle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "paidy-on-boarding"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_main_hooks_form_info__WEBPACK_IMPORTED_MODULE_5__.SettingCompletedMessage, null)));
  } else if (currentStep === 3) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(PaidyTitle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "paidy-on-boarding"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_main_hooks_form_info__WEBPACK_IMPORTED_MODULE_5__.ReviewApprovedMessage, null)));
  } else if (currentStep === 99) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(PaidyTitle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "paidy-on-boarding"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_main_hooks_form_info__WEBPACK_IMPORTED_MODULE_5__.ReviewRejectedMessage, null)));
  } else {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SettingsTitle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "paidy-on-boarding"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "paidy-on-boarding__img"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: "https://paidy.com/merchant/",
      target: "_blank",
      rel: "noreferrer"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      src: "/wp-content/plugins/paidy-wc/assets/images/paidy_logo_w800.png",
      alt: "Paidy"
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "paidy-on-boarding__content"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Applying for and setting up Paidy is easy.', 'paidy-wc')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ApplyButton, {
      onClick: function onClick() {
        return setCurrentStep(1);
      }
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "paidy-on-boarding__description"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Paidy has zero installation costs and payment fees starting from 3.5%.', 'paidy-wc'), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: "https://paidy.com/merchant/",
      target: "_blank",
      rel: "noreferrer"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Learn more about Paidy', 'paidy-wc')))));
  }
};


/***/ }),

/***/ "./src/wizard/index.scss":
/*!*******************************!*\
  !*** ./src/wizard/index.scss ***!
  \*******************************/
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

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ (function(module) {

module.exports = window["wp"]["hooks"];

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
/*!*****************************!*\
  !*** ./src/wizard/index.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_first_main_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/first-main-page */ "./src/wizard/components/first-main-page.jsx");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./index.scss */ "./src/wizard/index.scss");





var BackAdminFooter = function BackAdminFooter() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "paidy-on-boarding footer"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "/wp-admin/admin.php?page=wc-settings&tab=checkout&section=paidy"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Back to Paidy settings', 'paidy-wc')));
};
var PaidyOnBoardingPage = function PaidyOnBoardingPage() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_first_main_page__WEBPACK_IMPORTED_MODULE_3__.FirstMainPage, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(BackAdminFooter, null));
};
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.addFilter)('woocommerce_admin_pages_list', 'paidy-on-boarding', function (pages) {
  pages.push({
    container: PaidyOnBoardingPage,
    path: '/paidy-on-boarding',
    breadcrumbs: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Easy setup for Paidy payment', 'paidy-wc')]
  });
  return pages;
});
}();
/******/ })()
;
//# sourceMappingURL=paidy.js.map