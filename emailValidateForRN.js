// Check for load_script support
if (!$.load_script) {
  (function($) {
    $.extend({
      load_script: function(src, func, test) {
        if (typeof(test) !== 'undefined') {
          this.test_load_script(src, func, test);
        } else {
          if (typeof(window.initialize) !== 'function') {
            window.initialize = function() {};
          }
          var head = document.getElementsByTagName('head')[0];
          var script = document.createElement('script');
          script.type = 'text/javascript';
          if (typeof(func) == 'function') {
            script.onreadystatechange = function() {
              if (this.readyState == 'complete') {
                func();
              }
            };
            script.onload = func;
          }
          script.src = src;
          head.appendChild(script);
        }
      },
      test_load_script: function(src, func, test) {
        if (test && typeof(func) == 'function') {
          func();
        } else {
          $.load_script(src, func);
        }
      }
    });
  })(jQuery);
}

var freshAddressSiteToken = undefined;
(function() {
    var subDomain = window.location.origin.match(/http:\/\/(\w+)/)[1];

    switch(subDomain) {
        case "carlosshoes":
            freshAddressSiteToken = "9a788c121f6414882c4221f546e229d683e0ae4629ed5fbd205814cb3f16dc2d1537a9a2a14f04560fc0600f481237da";
            break;
        case "bzees":
            freshAddressSiteToken = "c75801a7242935012229300c391f340be1906710d8bcc26a2b8cc09843e452bc34959c1dd598bf34004c47330171a216";
            break;
        case "drschollsshoes": 
            freshAddressSiteToken = "8c3f387c1253c4c23df03d27102e95aeeede24cdde454d1e993893b5fe9d252283391492500accf06e8321cd0295e6c7"; //this is not a drschollsshoes.custhelp.com token
            break;
        case "fergieshoes":
            freshAddressSiteToken = "ad3c58305b56a5cf114e09c534c59887b89da12067d6d088a3b0e5084f9ecd1e184501c3a48f2062ae204d46acacc492";
            break;
        case "francosarto":
            freshAddressSiteToken = "e4df592a10fc33ff2fbc522392299827c416f51deec8a1b2aa4f2eba92ac2bae057fc1dc3099aff70fede506ac9c9814";
            break;
        case "georgebrownbilt":
            freshAddressSiteToken = "e01cf489c3c491fc435e790cfcacf984d0e0d7616a3f45bd5fa803a9e2d955563c0c4ea45f18fb94ade242478d8793c8";
            break;
        case "lifestride":
            freshAddressSiteToken = "a3d75755df7cdbb39f3f23934bcd7ff49e10c05e777f2f0b02b5e8c48ddb3249e44d1e5e15602c29a9a43b65aa9c5871";
            break;
        case "naturalizer":
            freshAddressSiteToken = "603f6235207568991ea95ca0eb63355433847c620f1ab0dec5399dd2fb2db8fcb677d006be9b7dfff53fde82128d4031";
            break;
        case "ryka":
            freshAddressSiteToken = "26c383b4b0fc4919bd86a9da3c493028b0df541d6049578659bf866581f04f7139a996aab01b169be9e61a8b506ebc13";
            break;
        case "viaspiga":
            freshAddressSiteToken = "360fc2e287deca97c05b60d81d016d223a798e6cc150830785e2dd916e5bac46d546a8954caec596c45e7f3a7df97b56";
            break;
        default:
            break;
    }
})();

(function($) {
  if (!jQuery().emailValidate) {
    $.emailValidate = function(el, options) {
      var base = this;
      base.$el = $(el);
      base.el = el;
      base.timeout = false;
      base.completed = false;
      // Add a reverse reference to the DOM object
      base.$el.data("emailValidate", base);
      if (base.$el.attr('name').length < 1) {
        base.$el.attr('name', 'email_address');
      } else if (!/email/i.test(base.$el.attr('name'))) {
        base.$el.attr('name', base.$el.attr('name') + '-email');
      }
      base.init = function() {
        base.options = $.extend({}, $.emailValidate.defaultOptions, options);
        base.options.callback = base.options.callback ? base.options.callback : 'freshValidate' + parseInt(Math.random() * 10000);
        base.testedEmail = [];
        base.sentEmail = [];
        base.startStyles = base.$el.attr('style') ? base.$el.attr('style') : '';
        base.setSelector(); // SET SELECTOR FOR STYLES
        base.setText();
        if (!base.options.source && /local/.test(window.location.href)) {
          alert('Please set the source');
        }
        base.$el.unbind();
        if (!base.options.submitBtn) {
          /* FIND SUBMIT BUTTON */
          var linkCheck = base.$el.siblings('a[class*="submit"], a[class*="Submit"]');
          var btnCheck = base.$el.siblings('input[type="submit"]');
          if (linkCheck.length > 0) {
            base.options.submitBtn = linkCheck.first();
          } else if (btnCheck.length > 0) {
            base.options.submitBtn = btnCheck.first();
          } else {
            //below is a special grandCheck for CSR RightNow portal
            var grandCheck = $(".rn_PageContent, #rn_PageContent").find('a[class*="submit"], a[class*="Submit"], a[id*="submit"], input[type="submit"], button[type="submit"], button[id*="submit"], button[class*="submit"]');
            //end special grandCheck for CSR RightNow portal
            var nestCheck = $(base.grandSelector).parent().find('a[class*="submit"], a[class*="Submit"], a[id*="submit"], input[type="submit"], button[id*="submit"], button[class*="submit"]');
            if (grandCheck.length > 0) {
              base.options.submitBtn = grandCheck.first();
              base.options.submitBtn.prop("disabled", true);
            } else if (nestCheck.length > 0) {
              base.options.submitBtn = nestCheck.first();
            } else if (/local/.test(window.location.href)) {
              alert('Woah! We don\'t have a submit button for the email plugin');
            }
          }
        }

        var sibInputs = $(base.grandSelector + ' input[type="text"]').filter(function() {
          return typeof($(this).attr('placeholder')) !== 'undefined';
        });
        /* ADD PLACEHOLDER SUPPORT TO SIBLINGS */
        if (sibInputs.length > 0) {
          $(sibInputs).each(function() {
            if (!jQuery.support.placeholder) {
              $(this).val($(this).attr('placeholder'));
              $(this).focus(function() {
                if ($(this).val() == $(this).attr('placeholder')) {
                  $(this).val('');
                }
              }).blur(function() {
                if ($(this).val() == '') {
                  $(this).val($(this).attr('placeholder'));
                }
              });
            }
          });
        }

        if (base.options.placeholder.length > 0) {
          if (!base.$el.attr('placeholder') || base.options.language) {
            base.$el.attr('placeholder', base.options.placeholder);
          }
          if (!jQuery.support.placeholder) {
            base.$el.val(base.options.placeholder);
            base.$el.focus(function() {
              if ($(this).val() == base.options.placeholder) {
                $(this).val('');
              }
            }).blur(function() {
              if ($(this).val() == '') {
                $(this).val(base.options.placeholder);
              }
            });
          }
        }
        base.$el.focus(function() {
          setTimeout(function() {
            base.submitted = false;
          }, 600);
          if ($(this).val() == base.options.successMsg) {
            $(this).val('');
          }
        });

        // Click
        try {
          base.options.submitBtn.unbind().off().click(function(e) {
            e.preventDefault();
            base.submitted = true;
            base.submitFresh();
          });
        } catch(e){
          base.options.submitBtn.unbind().die().click(function(e) {
            e.preventDefault();
            base.submitted = true;
            base.submitFresh();
          });
        }

        // Keyup
        base.$el.keydown(function(e) {
          if (e.which == 13) {
            e.preventDefault();
            base.$el.blur();
            base.submitted = true;
            base.submitFresh();
          }
          else if((base.options.exp.test(base.$el.val()) && base.$el.hasClass(base.options.errorClass)) || base.$el.val().length == 0) {
            // PASSED - remove bad format warning
            base.reset();
          }
        });

        // Blur Test
        base.$el.blur(function() {
          if ((base.$el.val().length > 0 && !base.options.exp.test(base.$el.val())) || (base.$el.val().length == 0 && base.submitted)) {
            if(base.$el.val() === base.options.placeholder || base.$el.val() === base.options.successMsg) {
              base.options.submitBtn.prop("disabled", true);
              base.reset();
            }
            else {
              base.options.submitBtn.prop("disabled", true);
              base.displayError();
            }
          } else {
            base.options.submitBtn.prop("disabled", true);
            base.reset();
          }
          if(base.options.exp.test(base.$el.val())) {
            base.options.submitBtn.prop("disabled", false);
          }
        });

        //create email opt-in checkbox and place on page next to email input
        var $optinCheckbox = $("<input type='checkbox' id='email-optin'><label for='email-optin'>Email Opt-in</label>");
        base.$el.after($optinCheckbox);

        /* VALIDATION AND DISPLAY FUNCTION */
        if (!window[base.options.callback]) {
          window[base.options.callback] = function(FA) {
            if (base.timeout) {
              clearTimeout(base.timeout);
              base.timeout = false;
              base.passed = false;
              if (FA.FA_VALID == 'yes') {
                base.testedEmail.push(base.$el.val(FA.FA_EMAIL));
                if (base.submitted && typeof(base.options.validation) == 'function') {
                  if (base.options.validation()) {
                    base.success();
                  } else if (typeof(base.options.validationError) == 'function') {
                    base.options.validationError();
                  }
                } else if (base.submitted) {
                  base.success();
                }
                return true;
              } else if (!base.commentEl) {
                // SLIGHT DELAY FOR OLD BROWSERS
                setTimeout(function() {
                  base.submitted = false;
                }, 10);
                var baseFontSize = base.options.fontSize ? base.options.fontSize : baseFontSize;
                var baseHeight = base.$el.outerHeight();
                var baseWidth = base.$el.outerWidth();
                var baseIEWidth = base.$el.width();
                var baseLeft = parseInt(base.$el.css('padding-left')) + parseInt(base.$el.css("border-left-width"));
                var baseRight = parseInt(base.$el.css('padding-right')) + parseInt(base.$el.css("border-right-width"));
                var baseBorder = parseInt(base.$el.css('border-left-width'));
                var position = base.$el.position();
                var offsetParent = base.$el.offsetParent();
                var iconWidth = 24;
                if (offsetParent.css('position') == 'static') {
                  offsetParent.css('position', 'relative');
                } else if (typeof(offsetParent.css('z-index')) == 'undefined' || offsetParent.css('z-index') === 0) {
                  offsetParent.css('z-index', 1);
                }
                var offsetHeight = offsetParent.outerHeight();
                var offsetWidth = offsetParent.outerWidth();
                position.top = isNaN(parseInt(base.$el.css('margin-top'))) ? position.top : position.top + parseInt(base.$el.css('margin-top'));
                position.bottom = offsetHeight - position.top + 6;
                position.left = parseInt(base.$el.css('margin-left')) > 0 ? parseInt(position.left) + parseInt(base.$el.css('margin-left')) + 1 : position.left;
                /* ADJUST FOR POSITIONED FROM CENTER */
                var margin = {};
                margin.left = position.left - parseInt(offsetWidth / 2);
                if (baseHeight <= 25) {
                  var iconHeight = Math.floor(baseHeight * .6);
                  iconWidth = iconHeight;
                  var iconTop = position.top + Math.floor((baseHeight - iconHeight) / 2) + 2;
                } else {
                  var iconTop = position.top + Math.ceil((baseHeight - 24) / 2);
                  var iconHeight = '24';
                }
                baseLeft = 18 - (baseLeft + Math.floor(iconHeight / 2)) + baseLeft;
                // Add Base Styles
                if (!base.stylesAdded) {
                  $('head').append('<style>p.email-error:after { content: \'\'; display: block; position: absolute; bottom: -10px; left: 6px; border-top: 12px solid ' + base.options.backgroundColor + '; border-right: 12px solid transparent; border-bottom: none; border-left: 12px solid transparent; }</style>');
                  base.stylesAdded = true;
                }

                var iconLeft = position.left + baseLeft;
                var iconMargin = iconLeft - parseInt(offsetWidth / 2);
                var comment = '<p class="email-error" style="max-width:none; text-align:left; width:' + base.$el.outerWidth() + 'px; bottom:' + position.bottom + 'px;left:50%;margin:0 0 0 ' + margin.left + 'px; *margin:0 0 0 ' + (margin.left + 2) + 'px; -moz-box-sizing: border-box; box-sizing: border-box; position: absolute; padding: .5em 1em; color:' + base.options.fontColor + '; background-color:' + base.options.backgroundColor + '; font-size:' + baseFontSize + ';' + base.options.styles + '">' + (/.+\@.+\..+/.test(FA.FA_COMMENT) ? FA.FA_COMMENT : FA.FA_EMAIL + ' ' + FA.FA_COMMENT) + '</p>';
                var iconStyles = 'position:absolute; left:50%;margin-left:' + iconMargin + 'px; top:' + iconTop + 'px; height:' + iconHeight + 'px;';
                var icon = '<img src="' + base.options.iconSrc + '" style="' + iconStyles + '" />';
                base.commentEl = $(comment + icon);
                base.$el.before(base.commentEl);
                base.$el.css({
                  'padding-left': baseLeft + iconWidth + Math.floor(iconWidth / 4),
                  'width': baseWidth - (baseLeft + iconWidth + baseRight + baseBorder * 2 + Math.floor(iconWidth / 4))
                }).addClass(base.options.errorClass);
              } else {
                base.submitted = false;
                try {
                  $(base.commentEl).text(FA.FA_EMAIL + ' ' + FA.FA_COMMENT);
                } catch (e) {}
              }
            }
          }
        }
      };

      base.splitStyles = function(styles, style_combo) {
        var split_styles = styles.split(';');
        for (var i in split_styles) {
          var d_split = split_styles[i].split(':');
          if (typeof(d_split[1]) !== 'undefined') {
            style_combo[$.trim(d_split[0])] = $.trim(d_split[1]);
          }
        }
        return style_combo;
      };

      base.joinStyles = function(styles) {
        var join_styles = [];
        for (var i in styles) {
          join_styles.push(i + ':' + styles[i]);
        }
        return join_styles.join(';') + ';';
      };

      base.reset = function(flag) {
        if (jQuery.inArray(base.$el.val(), base.testedEmail) < 0) {
          if (base.startStyles.length > 0) {
            base.$el.attr('style', base.startStyles);
          } else {
            base.$el.removeAttr('style');
          }
          if (base.commentEl) {
            base.commentEl.remove();
            base.commentEl = false;
          }
        } else if (typeof(flag) !== 'undefined' && flag) {
          if (base.commentEl) {
            base.commentEl.remove();
            base.commentEl = false;
          }
        }
        base.$el.removeClass(base.options.errorClass);
      };

      base.submitFresh = function() {
        if(!base.options.exp.test(base.$el.val())) {
          base.displayError();
          var errorValue = base.$el.val().length > 0 ? base.options.invalidAddressMessage : base.options.enterAddressMessage;
          //trackErrorEvent('ErrorEvent', 'ErrorDescription', (errorValue || 'Error Message not set'));
          return;
        }
        var FA = {};
        FA.FA_VALID = 'yes';
        FA.FA_EMAIL = base.$el.val();
        FA.Timeout = true;
        base.timeout = setTimeout(function() {
          window[base.options.callback](FA);
        }, (base.submitted ? 600 : base.options.timeout));

        if (jQuery.inArray(base.$el.val(), base.testedEmail) > 0 || typeof(freshAddressSiteToken) == 'undefined') {
          base.reset();
          if (base.submitted) {
            base.success();
          } 
        } else {
          $.load_script('https://api.freshaddress.biz/js/lib/freshaddress-client-7.0.js?token=' + freshAddressSiteToken, function() {
            if (base.timeout) {
              clearTimeout(base.timeout);
            }
            else {
              return;
            }

            if(base.$el.val() == base.options.successMsg || base.$el.val() == base.options.placeholder) {
              return;
            }

            FreshAddress.validateEmail(base.$el.val(), {
              emps: false,
              rtc_timeout: 1200//,
              //ref: base.options.source
            }).then(function(x) {
              var FA = {
                FA_VALID: 'yes',
                FA_EMAIL: x.getResponse().EMAIL,
                FA_COMMENT: ''
              };
              if (x.isServiceError()) { /* KEEP IT VALID */ }
              if (x.isValid()) {
                if (x.hasSuggest()) {
                  FA.FA_VALID = 'no';
                  FA.FA_COMMENT = base.options.suggest + x.getSuggEmail() + "?";
                }
              } else if (x.isError() || x.isWarning()) {
                FA.FA_VALID = 'no';
                if (x.hasSuggest()) {
                  FA.FA_COMMENT = base.options.suggestType + x.getSuggEmail() + "?";
                } else {
                  if(base.options.language) {
                    if(x.getErrorResponse() == 'The email address you entered cannot be registered') {
                      FA.FA_COMMENT = base.options.register;
                    }
                    if(x.getErrorResponse() == 'The email address you entered has a typo at the end') {
                      FA.FA_COMMENT = base.options.typo;
                    }
                  }
                  else {
                    FA.FA_COMMENT = x.getErrorResponse().replace(/The email address you entered/i, '') + ".";
                  }
                }
              }

              window[base.options.callback](FA);
            }).fail(function(x) {
              if (base.timeout) clearTimeout(base.timeout);
              var FA = {
                FA_VALID: 'yes',
                FA_EMAIL: base.$el.val(),
                Timeout: true
              };
              window[base.options.callback](FA);
            });
          }, typeof(FreshAddress) !== 'undefined');
        }
      }

      base.displayError = function() {
        base.timeout = true;
        var data = {
          FA_EMAIL: base.$el.val(),
          FA_COMMENT: base.$el.val().length > 0 ? base.options.invalidAddressMessage : base.options.enterAddressMessage,
          FA_VALID: 'no'
        };
        window[base.options.callback](data);
      }

      base.buildSalesforceURL = function(key) {
        return base.options.salesBase + base.$el.val() + '&key=' + key + '&attributes=';
      }

      base.buildSalesforceJSON = function() {
        var salesforceJSON = {
          "source" : base.options.source,
          "partnerid" : base.options.partnerid
        };
        return salesforceJSON;
      };

      base.success = function() {
        if (!base.options.submitURL) {
          base.seturl();
        } // SET URL
        var iframe = document.createElement('IFRAME');
        var sibInputs = $(base.grandSelector + ' input, ' + base.grandSelector + ' select').filter(function() {
          return $(this).val().length > 0;
        });
        var sibsURL = (!base.options.useCase) ? '' : base.buildSalesforceJSON();
        var bdTests = [];
        var bdVals = [];
        var bdData = [];

        $(sibInputs).each(function() {
          for (var i in base.options.sibTests) {
            if (base.options.sibTests[i].exp.test($(this).attr('name'))) {
              if (base.options.sibTests[i].key) {
                if (!base.options.useCase) {
                  sibsURL += '&' + base.options.sibTests[i].key + '=' + encodeURI($(this).val());
                } else {
                  if(base.options.sibTests[i].saleskey == 'to') {
                    continue;
                  }
                  sibsURL[base.options.sibTests[i].saleskey] = $(this).val();
                }
              }
              break;
            }
          }

          for (var i in base.options.bdTest) {
            if (base.options.bdTest[i].exp.test($(this).attr('name')) && jQuery.inArray(base.options.bdTest[i].exp, bdTests) < 0) {
              bdTests.push(base.options.bdTest[i].exp);
              bdData[base.options.bdTest[i].type] = $(this).val();
              break;
            }
          }
        });

        if (bdTests.length == base.options.bdTest.length && bdData['month'] && bdData['year'] && bdData['day']) {
          sibsURL += '&' + base.options.bdTest[0].key + '=' + encodeURI(bdData['year']) + '-' + encodeURI(bdData['month']) + '-' + encodeURI(bdData['day']) + ' 00:00:01';
        }

        var url = !base.options.useCase ? base.options.submitURL + sibsURL + '&s_email_status_id=100&s_reg_source=' + base.options.source : base.options.submitURL += encodeURIComponent(JSON.stringify(sibsURL));

        if (jQuery.inArray(base.$el.val(), base.sentEmail) < 0) {
          base.sentEmail.push(base.$el.val());

          /* UPDATE URL VARS -------------- */
          /* ------------ REMOVABLE SECTION */
          if (/ebm\.cm/.test(url)) {
            var k_transforms = {
              's_email_status_id': false,
              's_email_address': 'email',
              's_email': 'email',
              's_reg_source': 'SOURCE',
              's_rewards_number': 'REWARDSNUMBER',
              's_home_zipcode': 'ZIP',
              's_name_first': 'FNAME',
              's_name_last': 'LNAME'
            };
            var urlVars = url.split('?')[1].split('&');
            var cmVars = [];
            for (var i in urlVars) {
              var urlParts = urlVars[i].split('=');
              if (k_transforms[urlParts[0]] === false) {
                // NADA
              } else if (k_transforms[urlParts[0]]) {
                cmVars.push(k_transforms[urlParts[0]] + '=' + urlParts[1]);
              } else {
                cmVars.push(urlVars[i]);
              }
            }

            url = /\?/.test(base.options.submitURL) ? base.options.submitURL.split('?')[0] + '?' + cmVars.join('&') : base.options.submitURL + '?' + cmVars.join('&');
          }
          /* // end ---- REMOVABLE SECTION */

          if (/https:/.test(window.location.href)) {
            url = url.replace(/http:\/\/f\.[^\.]+\.[^\/]+/, 'https://activity.conversen.com').replace('http:', 'https:');
          }

          //only submit to Salesforce if the User opts in
          if($("#email-optin")[0].checked === true) {
            $(iframe).attr('src', url).css({
              position: 'absolute',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
              visibility: 'hidden'
            });
            $('body').append(iframe);
            }
        }
        //base.reset(true);
        if (base.options.successMsg) {
          base.$el.val(base.options.successMsg);
        }
        if (typeof(base.options.success) == 'function') {
          base.options.success();
        }
        // track the source in adobe analytics (commented out for RightNow portal as the s object does not exist)
        // window.s.prop27 = base.options.source;
        // window.s.tl();
      };

      base.seturl = function() {
        var tests = [{
          exp: /naturalizer/i,
          url: 'http://f.naturalizer.com/ats/post.aspx?cr=100070&fm=94&s_email_address_sp4_status_id=',
          salesforce: base.buildSalesforceURL('nat0usaengwelcomedefault01')
        }, {
          exp: /bzees/i,
          url: '',
          salesforce: base.buildSalesforceURL('bze0usaengwelcomedefault01')
        }, {
          exp: /izer\.ca.*lang=fr/i,
          url: 'http://f.naturalizer.ca/ats/post.aspx?cr=100075&fm=96&s_email_address_sp3_status_id=',
          salesforce: base.buildSalesforceURL('nca0canfrewelcomedefault01')
        }, {
          exp: /naturalizer\.ca/i,
          url: 'http://f.naturalizer.ca/ats/post.aspx?cr=100075&fm=95&s_email_address_sp3_status_id=',
          salesforce: base.buildSalesforceURL('nca0canengwelcomedefault01')
        }, {
          exp: /carlosshoes/i,
          url: 'http://f.carlosshoes.com/ats/post.aspx?cr=100071&fm=90&s_email_address_sp7_status_id=',
          salesforce: base.buildSalesforceURL('car0usaengwelcomedefault01')
        }, {
          exp: /drschollsshoes/i,
          url: 'http://f.drschollsshoes.com/ats/post.aspx?cr=100072&fm=91&s_email_address_sp5_status_id=',
          salesforce: base.buildSalesforceURL('drs0usaengwelcomedefault01')
        }, {
          exp: /famousfootwear/i,
          url: 'http://f.famousfootwear.com/ats/post.aspx?cr=100068&fm=86&s_email_address_sp1_status_id=',
          salesforce: base.buildSalesforceURL('Welcome1USNonRewards')
        }, {
          exp: /fergieshoes/i,
          url: 'http://f.fergieshoes.com/ats/post.aspx?cr=100073&fm=92&s_email_address_sp9_status_id=',
          salesforce: base.buildSalesforceURL('fer0usaengwelcomedefault01')
        }, {
          exp: /francosarto/i,
          url: 'http://f.francosarto.com/ats/post.aspx?cr=100073&fm=92&s_email_address_sp9_status_id=', //may be incorrect, but should never be used anyway
          salesforce: base.buildSalesforceURL('fra0UsaEngWelcomeDefault')
        }, {
          exp: /georgebrownbilt/i,
          url: 'http://f.georgebrownbilt.com/ats/post.aspx?cr=100073&fm=92&s_email_address_sp9_status_id=', //may be incorrect, but should never be used anyway
          salesforce: base.buildSalesforceURL('gbb0UsaEngWelcomeDefault')
        }, {
          exp: /lifestride/i,
          url: 'http://f.lifestride.com/ats/post.aspx?cr=100074&fm=93&s_email_address_sp8_status_id=',
          salesforce: base.buildSalesforceURL('lif0usaengwelcomedefault01')
        }, {
          exp: /viaspiga/i,
          url: 'http://f.viaspiga.com/ats/post.aspx?cr=100080&fm=89&s_email_address_sp6_status_id=',
          salesforce: base.buildSalesforceURL('via0usaengwelcomedefault01')
        }, {
          exp: /ryka/i,
          url: 'http://f.ryka.com/ats/post.aspx?cr=100077&fm=98&s_email_address_sp16_status_id=',
          salesforce: base.buildSalesforceURL('ryk0usaengwelcomedefault01')
        }, {
          exp: /samedelman/i,
          url: 'http://f.samedelman.com/ats/post.aspx?cr=100078&fm=99&s_email_address_sp12_status_id=',
          salesforce: base.buildSalesforceURL('sam0usaengwelcomedefault01')
        }];
        for (i in tests) {
          if (tests[i].exp.test(window.location.href)) {
            if (base.options.useCase) {
              base.options.submitURL = tests[i].salesforce;
            } else {
              base.options.submitURL = tests[i].url;
            }
            break;
          }
        }

        /* ------------- REMOVABLE SECTION */
        /* SECONDARY TEST FOR COOKIE MATCH */
        var cookie_tests = [{
          exp: /FFCA-EMAIL/,
          url: base.options.useCase ? base.buildSalesforceURL('Welcome1CANonRewards') : 'http://f.famousfootwear.com/ats/post.aspx?cr=100068&fm=86&s_email_address_sp1_status_id=',
          sourceAppend: '-FFCA'
        }];
        for (i in cookie_tests) {
          if (cookie_tests[i].exp.test(document.cookie)) {
            if(/fr-CA/i.test(document.location.href) && base.options.useCase) {
              cookie_tests[i].url = base.buildSalesforceURL('Welcome1FRCANonRewards');
            }
            base.options.submitURL = cookie_tests[i].url;
            base.options.source = cookie_tests[i].sourceAppend ? base.options.source + cookie_tests[i].sourceAppend : base.options.source;
            break;
          }
        }
        /* // end ------ REMOVABLE SECTION */

      };

      base.setSelector = function() {
        var parent = base.$el.parent();
        var grandfather = parent.parent();
        var parSelector = parent.attr('class') ? parent[0].nodeName.toLowerCase() + '.' + $.trim(parent.attr('class')).replace(/\s/gi, '.') : parent[0].nodeName.toLowerCase();
        var grandSelector = grandfather[0].nodeName.toLowerCase();
        if (grandfather.attr('id') || grandfather.attr('class')) {
          grandSelector += grandfather.attr('id') ? '#' + grandfather.attr('id') : '.' + $.trim(grandfather.attr('class')).replace(/\s/gi, '.');
        }
        base.grandSelector = grandSelector;
        base.cssSelector = grandSelector + ' ' + parSelector;

        // sets grandSelector for custhelp.com pages
        base.grandSelector = ".rn_PageContent, #rn_PageContent";
      };

      base.setText = function() {
        if (!base.options.language) {
          return;
        }

        base.options.enterAddressMessage = 'Entrez votre adresse courriel'; //Enter your email address
        base.options.invalidAddressMessage = ' est pas une adresse valide'; // is not a valid address
        base.options.successMsg = 'Merci pour votre inscription!'; //Thanks for signing up!
        base.options.placeholder = 'Adresse E-mail'; //Email Address
        base.options.suggest = 'Tu voulais dire '; //Did you mean
        base.options.suggestType = 'Vouliez-vous dire &agrave; taper '; //Did you mean to type
        base.options.register = 'ne peut pas &ecirc;tre enregistr&eacute;';
        base.options.typo = 'ne peut pas &ecirc;tre enregistr&eacute;';
      };

      // INIT
      base.init();
    };

    $.emailValidate.defaultOptions = {
      useCase: 'salesforce',
      language: false,
      salesBase: window.location.origin.match(/https?:\/\/\w+/) + '.com/webservices/salesforce.asmx/Welcome?to=',
      exp: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      backgroundColor: '#d11919',
      fontColor: '#ffffff',
      fontSize: false,
      errorClass: 'error',
      placeholder: '',
      enterAddressMessage: 'Please enter your address.',
      invalidAddressMessage: ' is not a valid address.',
      suggest: 'Did you mean ',
      suggestType: 'Did you mean to type ',
      register: '',
      typo: '',
      iconSrc: window.location.origin.match(/https?:\/\/\w+/) + '.com/Content/core/email/warning.png',
      successMsg: '',
      timeout: 3000,
      submitURL: false,
      submitBtn: false,
      validation: false,
      validationError: false,
      success: false,
      source: "CUSTHELP",
      partnerid: '',
      baseCSSel: false,
      souceAppend: false,
      styles: '',
      ieStyles: '*background:url(/Content/core/email/ie7-bubble.png) bottom left no-repeat transparent; *padding:.5em 1em 1.5em; *margin-bottom:-5px; *zoom:1;',
      sibTests: [{
        exp: /email/i,
        key: 's_email_address',
        saleskey: 'to'
      }, {
        exp: /first/i,
        key: 's_name_first',
        saleskey: 'Fname'
      }, {
        exp: /last/i,
        key: 's_name_last',
        saleskey: 'Lname'
      }, {
        exp: /postalcode/i,
        key: 's_home_zipcode',
        saleskey: 'Zip'
      }, {
        exp: /rewards/i,
        key: 's_rewards_num',
        saleskey: 'Rewards'
      }, {
        exp: /address2/i,
        key: 's_home_street_2',
        saleskey: ''
      }, {
        exp: /address/i,
        key: 's_home_street_1',
        saleskey: ''
      }, {
        exp: /city/i,
        key: 's_home_city',
        saleskey: 'City'
      }, {
        exp: /state/i,
        key: 's_home_state',
        saleskey: 'State'
      }],
      bdTest: [{
        exp: /month/i,
        type: 'month',
        key: 's_birthdate',
        saleskey: ''
      }, {
        exp: /day/i,
        type: 'day',
        key: 's_birthdate',
        saleskey: ''
      }, {
        exp: /year/i,
        type: 'year',
        key: 's_birthdate',
        saleskey: ''
      }]
    };

    $.fn.emailValidate = function(options) {
      return this.each(function() {
        (new $.emailValidate(this, options));
      });
    };
  }
})(jQuery);

$.emailValidate(document.querySelector(".rn_Email"));