/**
 * Created by tobi.fagbohungbe on 4/20/16.
 **/
/** Indigo Frontend Sanity tests **/

var framework = require('app/framework');
var config = require('app/lib/dataconfig');
var data = config.confData;
var test = require('selenium-webdriver/testing');
var logs = require('app/lib/logging');


test.describe('Indigo Frontend Sanity Test', function() {

    test.beforeEach(function(){
        framework.openbrowser();
        framework.openurl(data.home.url);
    });

    test.it('Login with email', function() {
        framework.login_with_email(data.type, data.home, data.user, data.frontDesk);
    });

    test.it('Search for a patient', function() {
        framework.search_for_patient(data.type, data.home, data.user, data.frontDesk);
    });

    test.afterEach(function () {
        framework.closebrowser();
    })
});