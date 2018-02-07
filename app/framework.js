//validate elements are present first always
var async = require('async');
var webdriver = require('selenium-webdriver');

var vals = require('app/lib/validations');
var help = require('app/lib/helpers');
var config = require('app/lib/dataconfig');
var data = config.confData;

var actions = require('app/lib/actions');
var logger = require('app/lib/logging');
var validator = require('app/lib/validations');

var driver;

module.exports = {

    browsername: null,
    attArray: [],

    openbrowser: function (browser) {
        if (typeof (browser) === 'undefined') { // initialize if driver variable
            browser = data.default_browser;
        } // is undefined
        module.exports.browsername = browser;

        var seleniumAddress = 'http://' +
            (process.env.SELHUB_PORT_4444_TCP_ADDR || process.env.SELENIUM_HUB_HOST || "localhost") +
            ':' +
            (process.env.SELHUB_PORT_4444_TCP_PORT || process.env.SELENIUM_HUB_PORT || 4444) +
            '/wd/hub';

        driver = new webdriver.Builder().usingServer(seleniumAddress)
                .withCapabilities({
                    'browserName': browser,
                    'chromeOptions': {
                        'args': ['--disable-extensions', '--start-maximized']
                    }
                }).build();

        validator.addDriver(driver);
        actions.addDriver(driver);
        help.addDriver(driver);
        logger.addDriver(driver);
        actions.addArray(module.exports.attArray);

        driver.manage().deleteAllCookies();
    },

    openurl: function (url) {
        driver.get(url);
    },

    login_with_email: function (type, home, user, frontDesk, cb) {
        async.series([
            function (callback) {
                actions.sendkeys(type['name'], home['emailName'], 'Email Box', user['email']);
                callback();
            },

            function (callback) {
                actions.sendkeys(type['name'], home['passwordName'], 'password Box', user['password']);
                callback();
            },

            function (callback) {
                actions.clickButton(type['class'], home['loginBtnClass'], 'Login button');
                driver.sleep(7000);
                callback();
            },

            function (callback) {
                vals.validateElementText(type['xpath'], frontDesk['searchPatientXpath'], frontDesk['searchPatientTxt'], 'Front Page Validation ');
                callback();
            }

        ], cb)
    },

    search_for_patient: function (type, home, user, frontDesk, cb) {
        async.series([
            function (callback) {
                actions.sendkeys(type['name'], home['emailName'], 'Email Box', user['email']);
                callback();
            },

            function (callback) {
                actions.sendkeys(type['name'], home['passwordName'], 'password Box', user['password']);
                callback();
            },

            function (callback) {
                actions.clickButton(type['class'], home['loginBtnClass'], 'Login button');
                driver.sleep(10000);
                callback();
            },

            function (callback) {
                vals.validateElementText(type['xpath'], frontDesk['searchPatientXpath'], frontDesk['searchPatientTxt'], 'Front Page Validation ');
                callback();
            },

            function (callback) {
                actions.sendkeys(type['id'], frontDesk['searchBoxId'], 'Search Box', user['patientName']);
                callback();
            },

            function (callback) {
                actions.clickButton(type['class'], frontDesk['searchBtnClass'], 'Search button');
                driver.sleep(5000);
                callback();
            },

            function (callback) {
                vals.validateElementText(type['xpath'], frontDesk['searchResultXpath'], user['validatePatientName'], 'Patient Name Validation ');
                callback();
                driver.sleep(5000);
            }

        ], cb)
    },

    closebrowser: function (results, title) {
        driver.wait(function () {
            console.log("ready to close browser");

            driver.quit();
            return true;
        }, 10000000)
    }
};