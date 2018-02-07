var webdriver = require('selenium-webdriver');
var async = require('async');
var loggs = require('app/lib/logging');
var help = require('app/lib/helpers');

module.exports = {

    browser: null,

    addDriver: function (driver) {
        module.exports.browser = driver;
    },

    validatePageTitle: function (Title) {
        loggs.logtoconsole("validating pagetitle");
        module.exports.browser.wait(
            module.exports.browser.getTitle().then(function (title) {
                loggs.logtoconsole("title = " + title);
                loggs.logtoconsole("Title = " + Title);
                if (title === Title) {
                    loggs.logtoconsole("Validation == PASS :: " + 'Page :' + Title + ' is displayed successfully');
                    return true;
                } else {
                    loggs.assertEqualto(title, Title, 'Page:')
                }
            }), 50000, 'should be');
    },

    validateNotPageTitle: function (Title) {
        loggs.logtoconsole("validating pagetitle");
        module.exports.browser.manage().timeouts().implicitlyWait(120000);
        module.exports.browser.getTitle().then(function (title) {
            if (title !== Title) {
                loggs.logtoconsole("Validation == PASS :: Page Title - " + title + 'is not Equal To ' + Title);
                return true;
            } else {
                loggs.assertNotEqualto(title, Title, 'Page:')
            }
        });
        module.exports.browser.manage().timeouts().implicitlyWait(120000);
    },

    //Rafa::: use this function to validate if any type of element is present
    validateElementPresent: function (type, element, label) {
        module.exports.browser.manage().timeouts().implicitlyWait(10000);
        help.elementpresent(type, element).then(function (present) {
            if (present) {
                loggs.logtoconsole("Validation == PASS :: " + label + " is Present");
                return true;
            } else {
                loggs.assertTrue(label, 'present', present)
            }
        });
    },

    //Rafa::: use this function to validate if any type of element is displayed
    validateElementDisplayed: function (type, element, label) {
        module.exports.browser.manage().timeouts().implicitlyWait(120000);
        module.exports.validateElementPresent(type, element, label);
        help.findelement(type, element).isDisplayed().then(function (Link) {
            loggs.logtoconsole('Link = ' + Link);
            if (Link) {
                loggs.logtoconsole("Validation == PASS :: " + label + " is displayed");
                return true;
            } else {
                loggs.assertTrue(label, 'displayed', Link)
            }
        }, function (err) {
            loggs.errorroutine(err);
        });
    },

    //Rafa::: use this function to validate if any type of element is selected
    validateElementSelected: function (type, element, label) {
        module.exports.browser.manage().timeouts().implicitlyWait(120000);
        module.exports.validateElementDisplayed(type, element, label);
        help.findelement(type, element).isSelected().then(function (link) {
            if (link) {
                loggs.logtoconsole("Validation == PASS :: " + label + " is Selected");
                return true;
            } else {
                loggs.assertTrue(label, 'selected', link)
            }
            assert(help.findelement(type, element)).isSelected.isTrue();
        }, function (err) {
            loggs.errorroutine(err);
        });
    },

    //Rafa::: use this function to validate the text of any type of element
    validateElementText: function (type, element, text, label) {
        module.exports.validateElementPresent(type, element, label);
        module.exports.browser.manage().timeouts().implicitlyWait(10000);
        help.findelement(type, element).getText().then(function (Text) {
            loggs.logtoconsole('Current text is :' + Text);
            loggs.logtoconsole('Expected text is :' + text);
            var link = (Text === text);
            if (link) {
                loggs.logtoconsole("Validation == PASS :: " + label + " text is equal to " + Text);
                return true;
            } else {
                loggs.assertEqualto(Text, text, label)
            }
        });
    },

    //Rafa::: use this function to validate if any type of element contains a given text
    validateelementcontainstext: function (type, element, text, label) {
        async.series([function (callbackpro) {
            module.exports.validateElementDisplayed(type, element, label);
            module.exports.browser.manage().timeouts().implicitlyWait(120000);
            help.findelement(type, element).getText().then(function (Text) {
                loggs.logtoconsole('Current text is :' + Text);
                loggs.logtoconsole('Expected text is :' + text);
                var link = Text.indexOf(text) > -1;
                if (link) {
                    loggs.logtoconsole("Validation == PASS :: " + text + " is found in " + Text);
                    return true;
                } else {
                    loggs.assertContains(Text, text, label)
                }
            });
            callbackpro(null);
        }], function (err, result) {
            if (err) {
                loggs.errorroutine(err);
            }
        });
    },

    validateurl: function (url) {
        module.exports.browser.manage().timeouts().implicitlyWait(120000);
        module.exports.browser.getCurrentUrl().then(function (link) {
            loggs.logtoconsole('Actual URL is : ' + link);
            loggs.logtoconsole('Expected URL is: ' + url);
            var check = (link === url);
            loggs.logtoconsole('link is equalto url :' + check);
            if (check) {
                loggs.logtoconsole("Correct URL Displayed");
                loggs.logtoconsole('URL :' + link + ' is displayed');
                loggs.logtoconsole('URL :' + url + ' should be displayed');
                return true;
            } else {
                loggs.assertEqualto(url, link, 'Url');
            }
        });
    },

    validatepagenot404: function (page) {
        module.exports.browser.getTitle().then(function (name) {
            var result = (name.indexOf("404") !== 0);
            if (result) {
                loggs.logtoconsole("Page: " + page + " displayed successfully");
                return true;
            } else {
                loggs.assertContains(name, '404', page);
            }
        });
    },

    //Rafa::: use this function to validate button is selected with any element
    valradioBtnisselected: function (type, element, label) {
        async.series([function (callbackpro) {
            module.exports.validateElementPresent(type, element, label);
            module.exports.browser.manage().timeouts().implicitlyWait(120000);
            help.findelement(type, element).getAttribute('checked').then(function (attribute) {
                if (attribute = 'checked') {
                    loggs.logtoconsole("Validation == PASS :: " + label + ' is selected')
                } else {
                    loggs.assertEqualto(attribute, checked, label)
                }
            });
            callbackpro(null);
        }], function (err, result) {
            if (err) {
                loggs.errorroutine(err);
            }
        });
    },

    validatcurrwindowHandle: function (winHandle) {
        module.exports.browser.wait(function () {
            loggs.logtoconsole("Getting current Window handle");
            module.exports.browser.getWindowHandle().then(function (Window) {
                logs.logtoconsole("Current Window Handle: " + Window);
                if (winHandle === Window) {
                    logs.logtoconsole("On current Window");
                    return true;
                } else {
                    logs.logtoconsole("not on current window");
                    return false;
                }
            });
        }, 6000).then(function () {
        }, function (err) {
            logs.errorroutine(err);
        });
    }
};

