/**
 * November 26, 2016
 *   Skeleton of chrome extension
 * December 1, 2016
 *   Added "Type" column
 *   Support for TFSA encoding
 *   Remove "Tangerine" from account names
 */

(function(document, _, jQuery) {

    /*
     * Examples of account names that will be processed:
     * RG20161121 150
     *    This is a RSP GIC that does not automatically re-enroll maturing 2016
     *    Nov 21 with current rate 1.5%
     * RZ20G20161121 150
     *    This is a RSP GIC that automatically re-enroll for 2 years maturing 2016
     *    Nov 21 with current rate 1.5%
     */
    const TANGERINE_ACCOUNT_REGEX = /([RT]?G)(Z(\d\d))?(\d\d\d\d)(\d\d)(\d\d) (\d\d\d)/i;

    function replaceAccountName(accountName, formatCode) {
        return accountName
                .replace('Tangerine Guaranteed Investment', '')
                .replace('(GIC)', 'GIC')
                .replace('Tangerine RSP Guaranteed Investment', 'RSP')
                .replace('Tangerine', '')
                .replace('Tax-Free Savings Account', 'TFSA')
                .replace('Tax Free Savings Account', 'TFSA')
                .replace('Tax-Free Guaranteed Investment', 'Tax-Free ')
                .replace(formatCode || '', '')
                .replace('-  -', '-');
    }

    function dataFromAccountName(row) {
        const
            accountNameNode = row.childNodes[1],
            accountName = (accountNameNode.innerText || ''),
            matches = TANGERINE_ACCOUNT_REGEX.exec(accountName) || [],
            accountNameAnchorNode = accountNameNode.querySelector('a') || {},
            accountUrl = ((accountNameAnchorNode.attributes || {}).href || {}).nodeValue,
            accountNameHtml = accountUrl ?
            '<a href="' + accountUrl + '">' + replaceAccountName(accountName, matches[0]) + '</a>' :
                accountName,
            accountType = matches[1] || '',
            yearsToReenroll = parseInt(matches[3])/10 || 0,
            yearOfMaturity = parseInt(matches[4]) || 0,
            monthOfMaturity = parseInt(matches[5]) || 0,
            dayOfMaturity = parseInt(matches[6]) || 0,
            dateOfMaturity = yearOfMaturity ?
            yearOfMaturity + '-' + _.padStart(monthOfMaturity, 2, '0') + '-' + _.padStart(dayOfMaturity, 2, '0') :
                '',
            rate = parseInt(matches[7])/100 || 0,
            dollarsUs = (row.childNodes[2] || {}).innerText,
            dollarsCanada = (row.childNodes[3] || {}).innerText;

        return {
            accountType: accountType,
            yearsToReenroll: yearsToReenroll,
            dateOfMaturity: dateOfMaturity,
            rate: rate,
            accountNameHtml: accountNameHtml,
            dollarsUs: dollarsUs,
            dollarsCanada: dollarsCanada
        };
    }

    function accountTypeTitle(accountType) {
        if (accountType === 'RG') {
            return 'RSP GIC';
        }
        if (accountType === 'TG') {
            return 'Tax-Free GIC';
        }
        if (accountType === 'G') {
            return 'GIC';
        }

        return '';
    }

    function newAccountsTableHtml(table) {
        const
            rows = table ?
                Array.prototype.slice.call(table.querySelectorAll('tr')) :
                [],
            rowsForAccounts = rows.filter(function(r) {
                const
                    columns = r.querySelectorAll('td'),
                    isTotalColumn = (columns[0] || {}).innerText === 'TOTAL';

                return columns.length !== 0 && !isTotalColumn;
            }),
            rowsForAccountsHtml = rowsForAccounts
                .map(function(r) {
                    const
                        data = dataFromAccountName(r);


                    return '<tr>' +
                                '<td class="span3" data-title="Account Name:">' + data.accountNameHtml + '</td>' +
                                '<td title="' + accountTypeTitle(data.accountType) + '" class="span1" data-title="Type:">' + data.accountType + '</td>' +
                                '<td class="span2" data-title="Maturity:">' + data.dateOfMaturity + '</td>' +
                                '<td class="span1" data-title="Rate:">' + (data.rate ? data.rate + '%': '') + '</td>' +
                                '<td class="span1" data-title="Re-Enroll:">' + (data.yearsToReenroll ? data.yearsToReenroll + 'yr' : '') +'</td>' +
                                '<td class="span2" data-title="USD:">' + data.dollarsUs + '</td>' +
                                '<td class="span2" data-title="CAD:">' + data.dollarsCanada + '</td>' +
                          '</tr>';
                })
                .join('');


        return  '<table id="tangerineUiTable" class="table table-striped table-condensed table-vertical">' +
                        '<thead>' +
                            '<tr>' +
                                '<th class="span3">Account</th>' +
                                '<th class="span2">Type</th>' +
                                '<th class="span2">Maturity</th>' +
                                '<th class="span1">Rate</th>' +
                                '<th class="span1">Re-Enroll</th>' +
                                '<th class="span2">USD</th>' +
                                '<th class="span2">CAD</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                            rowsForAccountsHtml +
                        '</tbody>' +
                   '</table>';

    }

    function htmlToNode(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function newTotalAccountsTableHtml(table) {
        const
            rows = table ?
                Array.prototype.slice.call(table.querySelectorAll('tr')) :
                [],
                rowTotal = rows.filter(function(r) {
                    const
                        columns = r.querySelectorAll('td'),
                        isTotalColumn = (columns[0] || {}).innerText === 'TOTAL';
                    return isTotalColumn;
                })[0] || {childNodes:[]},
                usdTotal = (rowTotal.childNodes[2] || {}).innerText,
                cadTotal = (rowTotal.childNodes[3] || {}).innerText;

        return '<table class="table">' +
                    '<tbody>' +
                        '<tr class="final">' +
                            '<td class="span3" data-title="TOTAL:">TOTAL</td>' +
                            '<td class="span2">' + '</td>' +
                            '<td class="span2">' + '</td>' +
                            '<td class="span1">' + '</td>' +
                            '<td class="span1">' + '</td>' +
                            '<td class="span2">' + usdTotal + '</td>' +
                            '<td class="span2">' + cadTotal + '</td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>';
    }

    function instructionsHtml() {
        return '<div class="span12">' +
                    'You have the Tangerine UI chrome extension.<br/>' +
                    ' To have it process your accounts you ' +
                    'must change the nickname of each GIC/RSP GIC account with the following format:<br/>' +
                    '&nbsp;&nbsp; <span style="color:green">RG</span><span style="color:blue">Z30</span><span style="color:darkred">20190131</span> <span style="color:black">150</span>' +
                    '<ul>' +
                        '<li><span style="color:green">RG</span> - indicates RSP GIC. You could use G to indicate a regular GIC. Or TG for Tax-Free GIC.</li>' +
                        '<li><span style="color:blue">Z30</span> - indicates automatic re-enroll into GIC every 3.0 years. You can omit this if there is no re-enroll.</li>' +
                        '<li><span style="color:darkred">20190131</span> - date of maturity is January 31, 2019</li>' +
                        '<li><span style="color:black">150</span> - current rate of 1.50%</li>' +
                    '</ul>' +
               '</div>';
    }

    function init() {
        const
            table = document.querySelectorAll('table.table.table-striped.table-condensed.table-vertical')[0],
            instructionsDivHtml = instructionsHtml(),
            instructionsNode = htmlToNode(instructionsDivHtml),
            newTableHtml = newAccountsTableHtml(table),
            newTableNode = htmlToNode(newTableHtml),
            newTableTotalHtml = newTotalAccountsTableHtml(table),
            newTableTotalNode = htmlToNode(newTableTotalHtml);

        if (table && table.parentNode) {
            table.parentNode.insertBefore(instructionsNode, table);
            table.parentNode.insertBefore(newTableNode, table);
            table.parentNode.insertBefore(newTableTotalNode, table);


            const
                jQueryTable = jQuery(newTableNode);

            jQueryTable.DataTable({
                paging: false,
                searching: false,
                info: false
            });
        }
    }


    init();

})(window.document, window._, window.jQuery);
